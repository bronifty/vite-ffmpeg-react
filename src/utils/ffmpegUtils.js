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
  let imageObjectUrl = null;
  let videoObjectUrl = null;
  const returnObj = {
    imageObjectUrl,
    videoObjectUrl,
  };
  const file = event.target.elements.fileInput.files[0];
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));

  if (event.target.elements.operation.value === "screenshot") {
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
    // URL.revokeObjectURL(fileUrl);
  } else if (event.target.elements.operation.value === "transcode") {
    await ffmpeg.run("-i", file.name, "output.mp4");

    const data = ffmpeg.FS("readFile", "output.mp4");

    const fileUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    returnObj.videoObjectUrl = fileUrl;
    // URL.revokeObjectURL(fileUrl);
  }
  return returnObj;
};

//   // write the file to ffmpeg's virtual file system
//   ffmpeg.FS("writeFile", file.name, await fetchFile(file));

//   if (event.target.elements.operation.value === "screenshot") {
//     // run the ffmpeg command

//     await ffmpeg.run(
//       "-i",
//       file.name,
//       "-ss",
//       "00:00:01.000",
//       "-vframes",
//       "1",
//       "output.png"
//     );
//     // read the result

//     const data = ffmpeg.FS("readFile", "output.png");
//     // create a URL

//     const url = URL.createObjectURL(
//       new Blob([data.buffer], { type: "image/png" })
//     );

//     setimageObjectUrl(url);
//   } else if (event.target.elements.operation.value === "transcode") {
//     // run the ffmpeg command

//     await ffmpeg.run("-i", file.name, "output.mp4");
//     // read the result

//     const data = ffmpeg.FS("readFile", "output.mp4");
//     // create a URL

//     const url = URL.createObjectURL(
//       new Blob([data.buffer], { type: "video/mp4" })
//     );

//     setvideoObjectUrl(url);
//   }
//   return returnObj;
// };
