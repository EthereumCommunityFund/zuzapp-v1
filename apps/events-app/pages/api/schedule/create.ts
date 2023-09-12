
import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";
import { Database } from "@/database.types";
import { logToFile } from "@/utils/logger";
import { validateScheduleObject } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const supabase = createPagesServerClient<Database>({ req, res });

    // Validate schedule data
    const [validation_result, validatedData] = validateScheduleObject(req.body);
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email);
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const {
        name, format, description, date, start_time, end_time, all_day,
        schedule_frequency, images, video_call_link, live_stream_url, location_id,
        event_type, experience_level, rsvp_amount, limit_rsvp, event_space_id, track_id, tags,
        speakers
    } = validatedData;

    const schedule_insert_result = await supabase.from('schedule').insert({
        name, format, description, date, start_time, end_time, all_day,
        schedule_frequency, images, video_call_link, live_stream_url, location_id,
        event_type, experience_level, rsvp_amount, limit_rsvp, event_space_id, track_id
    }).select("id").single();

    if (schedule_insert_result.error || !schedule_insert_result.data) {
        logToFile("server error", schedule_insert_result.error.message, 500, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    const scheduleId = schedule_insert_result.data.id;

    // Handling tags concurrently
    const tagPromises = tags.map(async (tag: string) => {
        let existing_tag = await supabase.from('tags').select('id').eq('name', tag.trim()).single();

        let tagId;
        if (!existing_tag.data) {
            const newTag = await supabase.from('tags').insert({ name: tag }).select("id").single();
            if (newTag.error || !newTag.data) {
                throw new Error(newTag.error?.message || "Failed to insert new tag");
            }
            tagId = newTag.data.id;
        } else {
            tagId = existing_tag.data.id;
        }

        await supabase.from('ScheduleTags').insert({
            schedule_id: scheduleId,
            tag_id: tagId
        });
    });


    type SpeakerType = { speaker_name: string, role: string }

    // Handling speakers and their roles concurrently
    const speakerPromises = speakers.map(async (speaker: SpeakerType) => {
        const { speaker_name, role } = speaker;
        let existingSpeaker = await supabase.from('Speaker').select('id').eq('name', speaker_name.toLowerCase().trim()).single();

        let speakerId;
        if (!existingSpeaker.data) {
            const newSpeaker = await supabase.from('Speaker').insert({ name: speaker_name }).select("id").single();
            if (newSpeaker.error || !newSpeaker.data) {
                throw new Error(newSpeaker.error?.message || "Failed to insert new speaker");
            }
            speakerId = newSpeaker.data.id;
        } else {
            speakerId = existingSpeaker.data.id;
        }

        await supabase.from('ScheduleSpeakerRole').insert({
            schedule_id: scheduleId,
            speaker_id: speakerId,
            role
        });
    });

    try {
        await Promise.all([...tagPromises, ...speakerPromises]);
    } catch (error: any) {
        logToFile("server error", error.message, 500, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({ // Assuming that the correct status is 200, adjust if needed.
        message: "Schedule created",
        id: scheduleId
    });
}


export default withSession(handler);


