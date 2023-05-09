import { BlobServiceClient } from "@azure/storage-blob";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import path from "path";
import fs from "fs";
const storageString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export const uploadToStorage = async (
  randomString: string,
  audioConfig: sdk.AudioConfig
) => {
  try {
    const dirRelativeToPublicFolder = "audio";
    const dir = path.resolve("public", dirRelativeToPublicFolder);
    const filenames = fs.readdirSync(dir);

    console.log(filenames);

    // const file = filenames.find((name) => name.includes(randomString));

    var file = fs.createWriteStream(dir + `/speech-${randomString}.mp3`);

    console.log(file);

    if (!file) return [];
    const containerName = `audio`;
    const storageAccountName = "dungeonaudio";
    const sasToken = process.env.REACT_APP_AZURE_STORAGE_SAS_TOKEN;
    const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;

    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(uploadUrl);

    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(
      `speech-${randomString}.mp3`
    );

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: "audio/ogg" } };

    // // upload file
    // await blobClient.uploadData(file, options);

    // await createBlobInContainer(`/audio/speech-${randomString}.mp3`);
  } catch (err) {
    console.log(err);
  }
};
