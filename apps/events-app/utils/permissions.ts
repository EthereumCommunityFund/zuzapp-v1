export const permissionConfig = {
    // Schedules
    '/api/schedule/create': {
        permission: 'creator',
        verify: verifyUserPermissionForEventSpace, // Assuming you'll verify against an associated event_space_id
    },
    '/api/schedule/:id/update': {
        permission: 'creator',
        verify: verifyScheduleOwnership,
    },
    '/api/schedule/:id/delete': {
        permission: 'creator',
        verify: verifyScheduleOwnership,
    },

    // Tracks
    '/api/track/create': {
        permission: 'creator',
        verify: verifyUserPermissionForEventSpace, // Assuming you'll verify against an associated event_space_id
    },
    '/api/track/:id/update': {
        permission: 'creator',
        verify: verifyTrackOwnership,
    },
    '/api/track/:id/delete': {
        permission: 'creator',
        verify: verifyTrackOwnership,
    },

    // Invites
    '/api/invite/create': {
        permission: 'creator',
        verify: verifyUserPermissionForEventSpace, // Assuming you'll verify against an associated event_space_id
    },
    '/api/invite/:id/update': {
        permission: 'creator',
        verify: verifyInviteOwnership,
    },
    '/api/invite/:id/delete': {
        permission: 'creator',
        verify: verifyInviteOwnership,
    },

    // Locations
    '/api/location/create': {
        permission: 'creator',
        verify: verifyUserPermissionForEventSpace, // Assuming you'll verify against an associated event_space_id
    },
    '/api/location/:id/update': {
        permission: 'creator',
        verify: verifyLocationOwnership,
    },
    '/api/location/:id/delete': {
        permission: 'creator',
        verify: verifyLocationOwnership,
    }
};


// Verify user's permission for the associated event_space_id when creating a new resource
async function verifyUserPermissionForEventSpace(supabase, userId: string, eventId: string) {
    const { data } = await supabase
        .from('eventspace')
        .select('creator_id')
        .eq('id', eventId);
    return data && data[0] && data[0].creator_id === userId;
}

// Verification for schedules:
async function verifyScheduleOwnership(supabase, userId, scheduleId) {
    const { data } = await supabase
        .from('Schedule')
        .select('creator_id')
        .eq('id', scheduleId);
    return data && data[0] && data[0].creator_id === userId;
}

// Verification for tracks:
async function verifyTrackOwnership(supabase, userId, trackId) {
    // Implement similar logic like above for Track resource
}

// Verification for invites:
async function verifyInviteOwnership(supabase, userId, inviteId) {
    // Implement similar logic for Invite resource
}

// Verification for locations:
async function verifyLocationOwnership(supabase, userId, locationId) {
    // Implement similar logic for Location resource
}
