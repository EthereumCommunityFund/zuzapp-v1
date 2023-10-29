import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from '../../middlewares/withSession';
import { Database } from '@/database.types';
import { logToFile } from '@/utils/logger';
import { OrganizerType } from '@/types';
import { validateScheduleUpdate, validateUUID } from '@/validators';
import { formatTimestamp } from '@/utils';
import { array } from 'joi';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createPagesServerClient<Database>({ req, res });

  const { id } = req.query as { id: string };

  const errors = validateUUID(id);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Validate schedule data
  const [validation_result, validatedData] = validateScheduleUpdate(req.body);
  if (validation_result.error) {
    logToFile('user error', validation_result.error.details[0].message, 400, req.body.user.email);
    return res.status(400).json({ error: validation_result.error.details[0].message });
  }

  let {
    name,
    format,
    description,
    all_day,
    schedule_frequency,
    images,
    video_call_link,
    live_stream_url,
    location_id,
    event_type,
    experience_level,
    rsvp_amount,
    limit_rsvp,
    event_space_id,
    track_id,
    tags,
    organizers,
  } = validatedData;

  let validatedFields: any = {
    name,
    format,
    description,
    all_day,
    schedule_frequency,
    images,
    video_call_link,
    live_stream_url,
    location_id,
    event_type,
    experience_level,
    rsvp_amount,
    limit_rsvp,
    event_space_id,
    track_id,
  };

  let insertData: any = {}
  let start_time = formatTimestamp(validatedData.start_time as Date);
  let end_time = formatTimestamp(validatedData.end_time as Date);
  let date = formatTimestamp(validatedData.date as Date);
  if (validatedData.end_date) {
    let end_date = formatTimestamp(validatedData.end_date as Date);
    insertData = { start_time, end_time, date: validatedData.date, end_date: validatedData.end_date };
  } else {
    insertData = { start_time, end_time, date };
  }

  for (let key in validatedFields) {
    if (validatedFields[key] !== undefined) {
      insertData[key] = validatedFields[key];
    }
  }

  // Update the schedule in the database
  const schedule_update_result = await supabase
    .from('schedule')
    .update(insertData)
    .eq('id', id)
    .single();

  if (schedule_update_result.error) {
    logToFile('server error', schedule_update_result.error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  // Handling tags differentially
  let scheduleId = id;
  // Delete existing tags for the schedule from the 'scheduletags' table
  const deleteExistingTagsResult = await supabase
    .from('scheduletags')
    .delete()
    .eq('schedule_id', scheduleId);

  if (deleteExistingTagsResult.error) {
    throw new Error(deleteExistingTagsResult.error.message || 'Failed to delete existing tags');
  }

  let tagPromises: Promise<void>[] = [];
  if (tags) {
    tagPromises = tags.map(async (tag: string) => {
      let existing_tag = await supabase.from('tags').select('id').eq('name', tag.trim()).single();

      let tagId;
      if (!existing_tag.data) {
        const newTag = await supabase.from('tags').insert({ name: tag }).select('id').single();
        if (newTag.error || !newTag.data) {
          throw new Error(newTag.error?.message || 'Failed to insert new tag');
        }
        tagId = newTag.data.id;
      } else {
        tagId = existing_tag.data.id;
      }

      await supabase.from('scheduletags').insert({
        schedule_id: scheduleId,
        tag_id: tagId,
      });

    });
  }


  const deleteExistingSpeakerRolesResult = await supabase
    .from('schedulespeakerrole')
    .delete()
    .eq('schedule_id', scheduleId);

  if (deleteExistingSpeakerRolesResult.error) {
    throw new Error(deleteExistingSpeakerRolesResult.error.message || 'Failed to delete existing speaker roles');
  }


  let speakerPromises: Promise<void>[] = [];
  if (organizers) {
    speakerPromises = organizers.map(async (organizer: OrganizerType) => {
      const { name, role } = organizer;
      // console.log(name, organizer)
      let existingOrganizer = await supabase.from('speaker').select('id').eq('name', name.trim()).single();

      // console.log(existingOrganizer, "existing speaker")

      let speakerId;
      if (!existingOrganizer.data) {
        const newOrganizer = await supabase.from('speaker').insert({ name: name }).select('id').single();
        if (newOrganizer.error || !newOrganizer.data) {
          throw new Error(newOrganizer.error?.message || 'Failed to insert new speaker');
        }
        speakerId = newOrganizer.data.id;
      } else {
        speakerId = existingOrganizer.data.id;
      }


      await supabase.from('schedulespeakerrole').insert({
        schedule_id: scheduleId,
        speaker_id: speakerId,
        role,
      });
    });
  }

  try {
    await Promise.all([...tagPromises, ...speakerPromises]);
  } catch (error: any) {
    logToFile('server error', error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  // Inserting into the EditLogs after updating the schedule
  const editLogInsertResult = await supabase
    .from('editlogs')
    .insert({
      schedule_id: id,
      editor_id: req.body.user.id,
      edit_summary: 'Updated schedule'
    });

  if (editLogInsertResult.error) {
    logToFile('server error', editLogInsertResult.error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error while logging edit');
  }


  return res.status(200).json({
    message: 'Schedule updated',
    data: scheduleId,
  });
};

export default withSession(handler);
