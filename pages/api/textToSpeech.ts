import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

import { getViseme } from "../../utils/getViseme";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userInput } = req.body;

    console.log(userInput);
    const viseme = await getViseme({ userInput });

    const dir = path.resolve("./audio");
    console.log(dir);
    const filenames = fs.readdirSync(dir);
    console.log(filenames);

    if (!viseme) {
      res.status(500).json({ message: "internal issue with key or region" });
      return;
    }

    res
      .status(200)
      .json({ blendData: viseme?.blendData, filename: viseme?.filename, dir });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
