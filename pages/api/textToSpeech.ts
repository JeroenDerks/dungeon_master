import type { NextApiRequest, NextApiResponse } from "next";

import { getViseme } from "../../utils/getViseme";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userInput } = req.body;

    const viseme = await getViseme({ userInput });

    if (!viseme) {
      res.status(500).json({ message: "internal issue with key or region" });
      return;
    }

    res.status(200).json(viseme);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
