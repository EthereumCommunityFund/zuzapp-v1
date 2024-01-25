import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverId = 'ME2L6mXR';
  const url = `https://www.guilded.gg/api/v1/servers/${serverId}/members`;

  try {
    const guildedResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`,
      },
    });
    if (guildedResponse.ok) {
      const data = await guildedResponse.json();
      res.status(200).json(data);
    } else {
      res.status(guildedResponse.status).json({ error: guildedResponse.statusText });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
