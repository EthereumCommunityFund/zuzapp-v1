import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";

export const permissionConfig = {
    // Schedules
    '/api/schedule/create': {
        allowedUsers: ["creator", "collaborator"],
        verify: verifyEventSpaceAccess, // Assuming you'll verify against an associated event_space_id
    },
    '/api/schedule/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyScheduleOwnership,
    },
    '/api/schedule/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyScheduleOwnership,
    },

    // Tracks
    '/api/track/create': {
        allowedUsers: ['creator'],
        verify: verifyEventSpaceAccess, // Assuming you'll verify against an associated event_space_id
    },
    '/api/track/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyTrackOwnership,
    },
    '/api/track/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyTrackOwnership,
    },

    // Invites
    '/api/invite/createInvite': {
        allowedUsers: ['creator'],
        verify: verifyEventSpaceAccess, // Assuming you'll verify against an associated event_space_id
    },
    '/api/invite/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyInviteAccess,
    },
    '/api/invite/:id/revoke': {
        allowedUsers: ['creator'],
        verify: verifyInviteAccess,
    },

    // Locations
    '/api/location/create': {
        allowedUsers: ['creator'],
        verify: verifyEventSpaceAccess, // Assuming you'll verify against an associated event_space_id
    },
    '/api/location/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyLocationAccess,
    },
    '/api/location/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyLocationAccess,
    },




};


// Verify user's permission for the associated event_space_id when creating a new resource
async function verifyEventSpaceAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator", "creator"]) {
    if (allowedUsers.includes('creator')) {
        const { data: eventData } = await supabase
            .from('eventspace')
            .select('creator_id')
            .eq('id', req.query.event_space_id);

        if (eventData && eventData[0] && eventData[0].creator_id === req.body.user.id) {
            return true;
        }
    }

    if (allowedUsers.includes('collaborator')) {
        const { data: inviteData } = await supabase
            .from('eventspaceinvites')
            .select('*')
            .eq('event_space_id', req.query.event_space_id)
            .eq('invitee_id', req.body.user.id)
            .eq('status', 'accepted');

        if (inviteData && inviteData.length > 0) {
            return true;
        }
    }

    return false;
}


// Verification for schedules:
async function verifyScheduleOwnership(supabase: SupabaseClient, req: NextApiRequest) {
    // First, retrieve the Schedule by its ID to get the related event_space_id
    const { data: scheduleData } = await supabase.from('schedule').select('event_space_id').eq('id', req.query.id);

    if (!scheduleData || !scheduleData[0]) return false;

    // Then, check if the user is the creator of the related EventSpace
    const { data: eventData } = await supabase.from('eventspace').select('creator_id').eq('id', scheduleData[0].event_space_id);
    return eventData && eventData[0] && eventData[0].creator_id === req.body.user.id;
}

async function verifyTrackOwnership(supabase: SupabaseClient, req: NextApiRequest) {
    const { data: trackData } = await supabase.from('track').select('event_space_id').eq('id', req.query.id);

    if (!trackData || !trackData[0]) return false;
    const { data: eventData } = await supabase.from('eventspace').select('creator_id').eq('id', trackData[0].event_space_id);
    return eventData && eventData[0] && eventData[0].creator_id === req.body.user.id;
}


// Verification for invites:
async function verifyInviteAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator", "creator"]) {
    if (allowedUsers.includes('creator')) {
        const { data: inviteData } = await supabase
            .from('eventspaceinvites')
            .select('inviter_id')
            .eq('id', req.query.id);

        if (inviteData && inviteData[0] && inviteData[0].inviter_id === req.body.user.id) {
            return true;
        }
    }

    if (allowedUsers.includes('collaborator')) {
        const { data: inviteData } = await supabase
            .from('eventspaceinvites')
            .select('*')
            .eq('id', req.query.id)
            .eq('invitee_id', req.body.user.id)
            .eq('status', 'accepted');

        if (inviteData && inviteData.length > 0) {
            return true;
        }
    }

    return false;
}


async function verifyLocationAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator", "creator"]) {
    if (allowedUsers.includes('creator')) {
        const { data: locationData } = await supabase
            .from('eventspacelocation')
            .select('event_space_id')
            .eq('id', req.query.id);

        if (!locationData || !locationData[0]) return false;

        const { data: eventData } = await supabase
            .from('eventspace')
            .select('creator_id')
            .eq('id', locationData[0].event_space_id);

        if (eventData && eventData[0] && eventData[0].creator_id === req.body.user.id) {
            return true;
        }
    }

    if (allowedUsers.includes('collaborator')) {
        const { data: inviteData } = await supabase
            .from('eventspaceinvites')
            .select('*')
            .eq('event_space_id', req.query.event_space_id)
            .eq('invitee_id', req.body.user.id)
            .eq('status', 'accepted');

        if (inviteData && inviteData.length > 0) {
            return true;
        }
    }

    return false;
}
