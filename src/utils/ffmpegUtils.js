import { blobToDataURL, transformMedia } from "./utils.js";
const { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg = null;

export const initializeFfmpeg = async () => {
  if (ffmpeg === null) {
    ffmpeg = createFFmpeg({
      mainName: "main",
      corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
    });
  }

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  return ffmpeg;
};

export const handleFFmpegOperations = async (event) => {
  await initializeFfmpeg();
  const form = event.target;
  let imageObjectUrl = null;
  let videoObjectUrl = null;
  const returnObj = {
    imageObjectUrl,
    videoObjectUrl,
  };
  const file = form.elements.fileInput.files[0];

  if (form.elements.operation.value === "screenshot") {
    ffmpeg.FS("writeFile", file.name, await fetchFile(file));
    await ffmpeg.run(
      "-i",
      file.name,
      "-ss",
      "00:00:01.000",
      "-vframes",
      "1",
      "output.png"
    );
    const data = ffmpeg.FS("readFile", "output.png");
    const fileUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/png" })
    );
    returnObj.imageObjectUrl = fileUrl;
    ffmpeg.FS("unlink", file.name);
    ffmpeg.FS("unlink", "output.png");
    // URL.revokeObjectURL(fileUrl);
  } else if (form.elements.operation.value === "transcode") {
    ffmpeg.FS("writeFile", file.name, await fetchFile(file));
    await ffmpeg.run("-i", file.name, "output.mp4");

    const data = ffmpeg.FS("readFile", "output.mp4");

    const fileUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    returnObj.videoObjectUrl = fileUrl;
    ffmpeg.FS("unlink", file.name);
    ffmpeg.FS("unlink", "output.mp4");
    // URL.revokeObjectURL(fileUrl);
  } else if (form.elements.customCommand.value) {
    const commandText = form.elements.customCommand.value;
    const commandCSV = commandText.split(",");
    console.log(`commandText = ${commandText}`);
    transformMedia({ file, command: commandCSV });
  }
  // ffmpeg.FS("unlink", inputFile);
  // ffmpeg.FS("unlink", outputFile);
  return returnObj;
};
