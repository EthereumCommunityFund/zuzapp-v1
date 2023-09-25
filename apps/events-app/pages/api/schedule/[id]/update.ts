import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from '../../middlewares/withSession';
import { Database } from '@/database.types';
import { logToFile } from '@/utils/logger';
import { SpeakerType } from '@/types';
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
    speakers,
  } = validatedData;

  console.log(validatedData, 'validated data');

  let start_time = formatTimestamp(validatedData.start_time as Date) as unknown as Date;
  let end_time = formatTimestamp(validatedData.end_time as Date)as unknown as Date;
  let date = formatTimestamp(validatedData.date as Date)as unknown as Date;

  // Update the schedule in the database
  const schedule_update_result = await supabase
    .from('schedule')
    .update({
      name,
      format,
      description,
      date,
      start_time,
      end_time,
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
    })
    .eq('id', id)
    .single();

  if (schedule_update_result.error) {
    logToFile('server error', schedule_update_result.error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  // Handling tags differentially
  let scheduleId = id;
  const currentTags = await supabase.from('scheduletags').select('id').eq('schedule_id', scheduleId);
  let currentTagIds: string[] = [];

  if (currentTags.data) {
    currentTagIds = currentTags.data.map((tag) => tag.id);
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

      if (!currentTagIds.includes(tagId)) {
        await supabase.from('scheduletags').insert({
          schedule_id: scheduleId,
          tag_id: tagId,
        });
      }
    });
  }

  // Bug fix Remove tags that are no longer associated
  console.log('current tags', currentTags);
  if (tags && tags?.length > 0) {
    let _tags = tags as String[];
    const tagsToRemove = currentTagIds.filter((tagId) => !_tags.includes(tagId));
    await supabase.from('scheduletags').delete().in('tag_id', tagsToRemove);
  }

  // Handling speakers differentially
  const currentSpeakers = await supabase.from('schedulespeakerrole').select('speaker_id').eq('schedule_id', scheduleId);
  let currentSpeakerIds: string[] = [];
  if (currentSpeakers.data) {
    currentSpeakerIds = currentSpeakers.data.map((speaker) => speaker.speaker_id);
  }

  let speakerPromises: Promise<void>[] = [];
  if (speakers) {
    speakerPromises = speakers.map(async (speaker: SpeakerType) => {
      const { speaker_name, role } = speaker;
      let existingSpeaker = await supabase.from('speaker').select('id').eq('name', speaker_name.toLowerCase().trim()).single();

      let speakerId;
      if (!existingSpeaker.data) {
        const newSpeaker = await supabase.from('speaker').insert({ name: speaker_name }).select('id').single();
        if (newSpeaker.error || !newSpeaker.data) {
          throw new Error(newSpeaker.error?.message || 'Failed to insert new speaker');
        }
        speakerId = newSpeaker.data.id;
      } else {
        speakerId = existingSpeaker.data.id;
      }

      if (!currentSpeakerIds.includes(speakerId)) {
        await supabase.from('schedulespeakerrole').insert({
          schedule_id: scheduleId,
          speaker_id: speakerId,
          role,
        });
      }

      // Bugfix Remove speakers that are no longer associated

      if (speakers) {
        let _speakers = speakers as SpeakerType[];
        console.log(speakers, 'speakers o');
        const speakersToRemove = currentSpeakerIds.filter((speakerId) => !_speakers.map((s) => s.speaker_name).includes(speakerId));
        console.log(speakersToRemove);
        await supabase.from('schedulespeakerrole').delete().in('speaker_id', speakersToRemove);
      }
    });
  }

  try {
    await Promise.all([...tagPromises, ...speakerPromises]);
  } catch (error: any) {
    logToFile('server error', error.message, 500, req.body.user.email);
    return res.status(500).send('Internal server error');
  }

  return res.status(200).json({
    message: 'Schedule updated',
    data: scheduleId,
  });
};

export default withSession(handler);
