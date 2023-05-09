import { BlobServiceClient } from "@azure/storage-blob";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import path from "path";
import fs from "fs";
const storageString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export const uploadToStorage = async (randomString: string, blob: Blob) => {
  try {
    const dirRelativeToPublicFolder = "audio";
    const dir = path.resolve("public", dirRelativeToPublicFolder);
    const filenames = fs.readdirSync(dir);

    // const file = filenames.find((name) => name.includes(randomString));

    var file = blob;

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
    const options = { blobHTTPHeaders: { blobContentType: "audio/mp3" } };

    // // upload file
    await blobClient.uploadData(blob, options);

    // await createBlobInContainer(`/audio/speech-${randomString}.mp3`);
    return true;
  } catch (err) {
    console.log(err);
  }
};
