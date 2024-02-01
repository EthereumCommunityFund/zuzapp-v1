import { GuildedMember, GuildedRole } from '@/hooks/useGuildedMembers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverId = 'ME2L6mXR';
  const membersUrl = `https://www.guilded.gg/api/v1/servers/${serverId}/members`;
  const rolesUrl = `https://www.guilded.gg/api/v1/servers/${serverId}/roles`;

  try {
    // Fetch members
    const membersResponse = await fetch(membersUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`,
      },
    });
    const membersData: { members: GuildedMember[] } = await membersResponse.json();

    // Fetch roles
    const rolesResponse = await fetch(rolesUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`,
      },
    });
    const rolesData: { roles: GuildedRole[] } = await rolesResponse.json();

    // Combine members with their roles
    const rolesById: { [key: number]: GuildedRole } = rolesData.roles.reduce((acc: { [key: number]: GuildedRole }, role: GuildedRole) => ({ ...acc, [role.id]: role }), {});
    const enrichedMembers = membersData.members.map((member: GuildedMember) => ({
      ...member,
      roles: member.roleIds.map((roleId: number) => rolesById[roleId]),
    }));

    res.status(200).json({ members: enrichedMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
