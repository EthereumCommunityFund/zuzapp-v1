import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from '../middlewares/withSession';
import { Database } from '@/database.types';
import { logToFile } from '@/utils/logger';
import { validateScheduleCreation } from '@/validators';
import { formatTimestamp } from '@/utils';
import { ScheduleCreateRequestBody, OrganizerType } from '@/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createPagesServerClient<Database>({ req, res });

  console.log(req.body, 'body');

  // Validate schedule data
  const [validation_result, validatedData] = validateScheduleCreation(req.body);
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
  // console.log(validatedData.start_time, validatedData.end_time, "timre")
  let insertData: any = {}
  let start_time = formatTimestamp(validatedData.start_time as Date);
  let end_time = formatTimestamp(validatedData.end_time as Date);
  let date = formatTimestamp(validatedData.date as Date);
  if (validatedData.end_date) {
    let end_date = formatTimestamp(validatedData.end_date as Date);
    insertData = { start_time, end_time, date, end_date };
  } else {
    insertData = { start_time, end_time, date };
  }




  // Loop through validatedFields and only include defined properties in insertData
  for (let key in validatedFields) {
    if (validatedFields[key] !== undefined) {
      insertData[key] = validatedFields[key];

    }
  }

  console.log('insert data', insertData)

  const schedule_insert_result = await supabase.from('schedule').insert(insertData).select('id').single();

  if (schedule_insert_result.error || !schedule_insert_result.data) {
    logToFile('server error', schedule_insert_result.error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  const scheduleId = schedule_insert_result.data.id;

  // Add the creator to the edit logs
  const { user } = req.body; // Assuming user info is in the request body

  const editLogInsertResult = await supabase.from('editlogs').insert({
    schedule_id: scheduleId,
    editor_id: user.id,
    edit_summary: 'Created schedule',
  });

  console.log(editLogInsertResult, 'result');

  if (editLogInsertResult.error) {
    logToFile('server error', editLogInsertResult.error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error when adding to edit logs');
  }

  // Handling tags concurrently
  const tagPromises = tags.map(async (tag: string) => {
    console.log(tag, 'tag');
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

  // Handling speakers and their roles concurrently
  const organizerPromises = organizers.map(async (speaker: OrganizerType) => {
    console.log(speaker, 'speakerss');
    const { name, role } = speaker;
    let existingOrganizer = await supabase.from('speaker').select('id').eq('name', name.trim()).single();
    console.log('existing speaker', existingOrganizer);
    let speakerId;
    if (!existingOrganizer.data) {
      const newSpeaker = await supabase.from('speaker').insert({ name: name }).select('id').single();
      if (newSpeaker.error || !newSpeaker.data) {
        throw new Error(newSpeaker.error?.message || 'Failed to insert new speaker');
      }
      speakerId = newSpeaker.data.id;
      console.log(speakerId, 'speaker id');
    } else {
      speakerId = existingOrganizer.data.id;
      console.log(speakerId, 'speaker id');
    }

    let speaker_role = await supabase
      .from('schedulespeakerrole')
      .insert({
        schedule_id: scheduleId,
        speaker_id: speakerId,
        role,
      })
      .select('*')
      .single();

    if (speaker_role.error || !speaker_role.data) {
      throw new Error(speaker_role.error?.message || 'Failed to insert new speaker role');
    }
  });

  try {
    await Promise.all([...tagPromises, ...organizerPromises]);
  } catch (error: any) {
    logToFile('server error', error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  return res.status(200).json({
    // Assuming that the correct status is 200, adjust if needed.
    message: 'Schedule created',
    data: scheduleId,
  });
};

export default withSession(handler);
