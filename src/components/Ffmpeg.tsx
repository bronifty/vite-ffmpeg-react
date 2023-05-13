import React from "react";

const Ffmpeg = () => {
  const { createFFmpeg, fetchFile } = FFmpeg;
  let ffmpeg = null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit");
    if (ffmpeg === null) {
      ffmpeg = createFFmpeg({
        mainName: "main",
        corePath:
          "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
      });
      // await ffmpeg.load();
    }
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS(
      "writeFile",
      "test.mov",
      await fetchFile(new URL("/test.mov", document.location).href)
    );
    // ffmpeg.FS("writeFile", name, await fetchFile(files[0]));
    await ffmpeg.run("-i", "test.mov", "output.mp4");
    // await ffmpeg.run("-i", name, "output.mp4");
    // read the file result and dump it to the local file system
    const data = ffmpeg.FS("readFile", "output.mp4");
    // const video = document.getElementById("output-video");
    const ffmpegUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    console.log("ffmpegUrl", ffmpegUrl);
  };

  return (
    <>
      <h3>Upload a video to transcode to mp4 (x264) and play!</h3>
      <form id="mediaForm" onSubmit={handleSubmit}>
        <select id="operation">
          <option value="transcode" selected>
            Transcode
          </option>
          <option value="screenshot">Screenshot</option>
        </select>
        <input type="file" id="uploader" />
        <button type="submit">Submit</button>
      </form>

      <video id="output-video" controls></video>
      <br />
      <img id="output-image" />

      <button onClick={() => {}}>Cancel</button>
      <p id="message"></p>
    </>
  );
};

export default Ffmpeg;
