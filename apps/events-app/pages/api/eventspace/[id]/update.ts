import { NextApiRequest, NextApiResponse } from 'next';
import withSession from '../../middlewares/withSession';
import withAuthorization from '../../middlewares/withAuthorization';
import { SupabaseClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { validateEventSpaceUpdate, validateUUID } from '../../../../validators';
import { formatTimestamp } from '../../../../utils';
import { logToFile } from '../../../../utils/logger';
import { Database } from '@/database.types';
import { MainLocationType, QueryWithID } from '@/types';

const updateLocation = async (supabase: SupabaseClient, location: MainLocationType) => {
  if (location.id) {
    // Update existing location
    const { data, error } = await supabase
      .from('location')
      .update({ name: location.name, description: location.description, address: location.address, capacity: location.capacity, image_urls: location.image_urls })
      .eq('id', location.id)
      .select('*');
    return { data, error };
  } else {
    // Insert new location
    const { data, error } = await supabase
      .from('location')
      .insert({ name: location.name, description: location.description, address: location.address, capacity: location.capacity, image_urls: location.image_urls }).select("*")

    return { data, error };
  }
};

const updateEventSpace = async (supabase: SupabaseClient, id: string, updates: any) => {
  const { data, error } = await supabase.from('eventspace').update(updates).eq('id', id).single();

  console.log(data, error);
  return { data, error };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [validation_result, data] = validateEventSpaceUpdate(req.body);
  if (validation_result.error) {
    logToFile('user error', validation_result.error.details[0].message, 400, req.body.user.email);
    return res.status(400).json({ error: validation_result.error.details[0].message });
  }

  const supabase = createPagesServerClient<Database>({ req, res });
  const { id } = req.query as QueryWithID;

  const errors = validateUUID(id);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Extract the main location data and remove it from the event space data object
  const main_location = data.main_location;
  //@ts-ignore
  delete data.main_location;

  let mainLocationId = main_location?.id || '';

  // Update or Insert Location
  if (main_location) {
    console.log('Main location data:', main_location, req.body);


    const { data: locationData, error: locationError } = await updateLocation(supabase, main_location);

    console.log(locationData, locationError)
    if (locationError || !locationData) {
      //@ts-ignore
      logToFile('server error', locationError.message, locationError.code, req.body.user.email);
      return res.status(500).send('Internal server error during location operation');
    }
    //@ts-ignore
    mainLocationId = locationData.id;
  }

  // Prepare updates for the event space
  const updates = {
    ...data,
    start_date: formatTimestamp(data.start_date),
    end_date: formatTimestamp(data.end_date),
    ...(mainLocationId && { main_location_id: mainLocationId }),
  };

  // Update Event Space
  const { data: eventData, error: eventUpdateError } = await updateEventSpace(supabase, id, updates);

  if (eventUpdateError) {
    logToFile('server error', eventUpdateError.message, eventUpdateError.code, req.body.user.email);
    return res.status(500).send('Internal server error during event space update');
  }

  // Respond with success and the updated data
  return res.status(200).json({
    message: 'Event space updated successfully',
    data: eventData,
    mainLocationId,
  });
};

export default withSession(withAuthorization(handler));
