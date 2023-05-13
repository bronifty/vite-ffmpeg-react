import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const MyVideoConverter = () => {
  const [ffmpeg, setFFmpeg] = useState(null);

  const processVideo = async (event) => {
    event.preventDefault();
    const operation = event.target.operation.value;
    const file = event.target.file.files[0];

    if (ffmpeg === null) {
      const ffmpegInstance = createFFmpeg({
        log: true,
      });
      setFFmpeg(ffmpegInstance);
    }

    const message = document.getElementById("message");
    const name = file.name;

    message.innerHTML = "Loading ffmpeg-core.js";

    await ffmpeg.load();

    ffmpeg.FS("writeFile", name, await fetchFile(file));

    if (operation === "transcode") {
      message.innerHTML = "Start transcoding";
      await ffmpeg.run("-i", name, "output.mp4");
      message.innerHTML = "Complete transcoding";
      const data = ffmpeg.FS("readFile", "output.mp4");
      const video = document.getElementById("output-video");
      video.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    } else if (operation === "screenshot") {
      message.innerHTML = "Start taking screenshot";
      await ffmpeg.run(
        "-i",
        name,
        "-ss",
        "00:00:01.000",
        "-vframes",
        "1",
        "output.png"
      );
      message.innerHTML = "Complete screenshot";
      const data = ffmpeg.FS("readFile", "output.png");
      const img = document.getElementById("output-image");
      img.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/png" })
      );
    } else {
      throw new Error(`Invalid operation: ${operation}`);
    }
  };

  const cancel = () => {
    try {
      ffmpeg.exit();
    } catch (e) {}
    setFFmpeg(null);
  };

  return (
    <div>
      <h3>Upload a video to transcode to mp4 (x264) and play!</h3>
      <form onSubmit={processVideo}>
        <select id="operation" name="operation">
          <option value="transcode" selected>
            Transcode
          </option>
          <option value="screenshot">Screenshot</option>
        </select>
        <input type="file" name="file" id="uploader" />
        <button type="submit">Submit</button>
      </form>

      <video id="output-video" controls></video>
      <br />
      <img id="output-image" />

      <button onClick={cancel}>Cancel</button>
      <p id="message"></p>
    </div>
  );
};

export default MyVideoConverter;
