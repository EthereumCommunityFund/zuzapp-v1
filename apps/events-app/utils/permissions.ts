import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";


export const permissionConfig: any = {
    // Event space
    '/api/eventspace/:id/update': {
        allowedUsers: ['creator', 'collaborator'],
        verify: verifyEventSpace,
    },
    '/api/eventspace/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyEventSpace,
    },
    '/api/eventspace/:id/changeStatus': {
        allowedUsers: ['creator', 'collaborator'],
        verify: verifyEventSpace,
    },

    // Schedules
    '/api/schedule/create': {
        allowedUsers: ["creator", "collaborator"],
        verify: verifyEventSpaceAccess,
    },
    '/api/schedule/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyScheduleAccess,
    },
    '/api/schedule/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyScheduleAccess,
    },

    // Tracks
    '/api/track/create': {
        allowedUsers: ['creator'],
        verify: verifyEventSpaceAccess,
    },
    '/api/track/:id/update': {
        allowedUsers: ['creator'],
        verify: verifyTrackAccess,
    },
    '/api/track/:id/delete': {
        allowedUsers: ['creator'],
        verify: verifyTrackAccess,
    },

    // Invites
    '/api/invite/createInvite': {
        allowedUsers: ['creator'],
        verify: verifyEventSpaceAccess,
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
        allowedUsers: ['creator', 'collaborator'],
        verify: verifyEventSpaceAccess,
    },
    '/api/location/:id/update': {
        allowedUsers: ['creator', 'collaborator'],
        verify: verifyLocationAccess,
    },
    '/api/location/:id/delete': {
        allowedUsers: ['creator', 'collaborator'],
        verify: verifyLocationAccess,
    },


};


async function verifyEventSpace(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["creator"]) {
    const eventSpaceId = req.query.id;
    const event_space_id = req.query.event_space_id;

    const { data: eventData } = await supabase
        .from('eventspace')
        .select('id')
        .eq('id', eventSpaceId);

    console.log(eventData, "event data")
    if (!eventData || !eventData[0] || eventData[0].id !== event_space_id) {
        return false;  // Provided event_space_id doesn't match the eventspace's actual event_space_id
    }

    return verifyEventSpaceAccess(supabase, req, allowedUsers)

}


// Verify user's permission for the associated event_space_id when creating a new resource
async function verifyEventSpaceAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator" | "creator"]) {
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
async function verifyScheduleAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator" | "creator"]) {
    const scheduleId = req.query.id;
    const eventSpaceId = req.query.event_space_id;
    const { data: scheduleData } = await supabase
        .from('schedule')
        .select('event_space_id')
        .eq('id', scheduleId);

    if (!scheduleData || !scheduleData[0] || scheduleData[0].event_space_id !== eventSpaceId) {
        return false;
    }
    return verifyEventSpaceAccess(supabase, req, allowedUsers);
}

async function verifyTrackAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator" | "creator"]) {
    const trackId = req.query.id;
    const eventSpaceId = req.query.event_space_id;
    const { data: trackData } = await supabase
        .from('track')
        .select('event_space_id')
        .eq('id', trackId);

    if (!trackData || !trackData[0] || trackData[0].event_space_id !== eventSpaceId) {
        return false;
    }
    return verifyEventSpaceAccess(supabase, req, allowedUsers);
}



// Verification for invites:
async function verifyInviteAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator" | "creator"]) {
    const inviteId = req.query.id;
    const eventSpaceId = req.query.event_space_id;

    const { data: inviteData } = await supabase
        .from('eventspaceinvites')
        .select('event_space_id')
        .eq('id', inviteId);

    if (!inviteData || !inviteData[0] || inviteData[0].event_space_id !== eventSpaceId) {
        return false;
    }

    return verifyEventSpaceAccess(supabase, req, allowedUsers);
}


async function verifyLocationAccess(supabase: SupabaseClient, req: NextApiRequest, allowedUsers: ["collaborator" | "creator"]) {
    const locationId = req.query.id;
    const eventSpaceId = req.query.event_space_id;

    const { data: locationData } = await supabase
        .from('eventspacelocation')
        .select('event_space_id')
        .eq('id', locationId);

    if (!locationData || !locationData[0] || locationData[0].event_space_id !== eventSpaceId) {
        return false;
    }

    return verifyEventSpaceAccess(supabase, req, allowedUsers);
}

