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

    const viseme = await getViseme({ userInput });

    const dir = path.resolve("./public");
    console.log(dir);
    const filenames = fs.readdirSync(dir);
    console.log(filenames);

    const filename = path.join("/", viseme.filename);

    res.status(200).json({ blendData: viseme.blendData, filename });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
