import PQueue from "p-queue";
import { runFFmpegJob } from "./ffmpeg.js";
const requestQueue = new PQueue({ concurrency: 1 });

export async function parseCommand(commandCSV) {
  console.log("commandCSV", commandCSV);
  // order of args passed to ffmpeg.run() is important:
  // ffmpeg -ss <time> -i <input_file> -frames:v 1 <output_file>
  // -ss, 00:00:01.000, -i, input.mov, -frames:v, 1, output.png
  // "-i", "input.mov", "output.mp4"

  const arrayWithoutSpaces = commandCSV.map((item) =>
    item
      .replace(
        /`([^`]+)`|'([^']+)'|"([^"]+)"/g,
        (match, templateQuotes, singleQuotes, doubleQuotes) =>
          templateQuotes || singleQuotes || doubleQuotes
      )
      .trim()
  );

  const getFileNames = (array) => {
    let inputFile, outputFile;
    for (let i = 0; i < arrayWithoutSpaces.length; i++) {
      if (arrayWithoutSpaces[i] === "-i" && i < arrayWithoutSpaces.length - 1) {
        inputFile = arrayWithoutSpaces[i + 1];
      }
      if (i === arrayWithoutSpaces.length - 1) {
        outputFile = arrayWithoutSpaces[i];
      }
    }
    return { inputFile, outputFile };
  };
  const { inputFile, outputFile } = getFileNames(arrayWithoutSpaces);
  return { parsedCommand: arrayWithoutSpaces, inputFile, outputFile };
}

export async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Read aborted"));
  });
}

const checkFileExtension = (file) => {
  const outputFile = file; // Example file name, change it according to your scenario

  const extension = outputFile
    .substr(outputFile.lastIndexOf("."))
    .toLowerCase();

  let mediaType;

  if (
    extension === ".png" ||
    extension === ".jpg" ||
    extension === ".jpeg" ||
    extension === ".gif"
  ) {
    mediaType = "image";
  } else if (
    extension === ".mp4" ||
    extension === ".avi" ||
    extension === ".mov"
  ) {
    mediaType = "video";
  } else {
    mediaType = "unknown";
  }

  console.log(`Output File: ${outputFile}`);
  console.log(`Media Type: ${mediaType}`);
};

export async function transformMedia({ file, command, API_ENDPOINT = null }) {
  const { parsedCommand, inputFile, outputFile } = await parseCommand(command);
  let outputData = null;

  console.log("parsedCommand", parsedCommand, inputFile, outputFile);

  // compose the ffmpeg command
  // await requestQueue.add(async () => {
  //   const { outputData: tempData } = await runFFmpegJob({
  //     parsedCommand,
  //     inputFile,
  //     outputFile,
  //     mediaFile: file,
  //   });
  //   outputData = tempData;
  // });

  checkFileExtension(outputFile);

  // const mediaBlog = new Blob([outputData.buffer], { type: "video/mp4" });

  // const res = await fetch(API_ENDPOINT, {
  //   method: "POST",
  //   body: payload,
  // });

  // if (!res.ok) {
  //   throw new Error("Creating thumbnail failed");
  // }

  // const mediaBlog = await res.blob();
  // const media = await blobToDataURL(mediaBlog);

  // return media;
}
