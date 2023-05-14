import React, { useState } from "react";
const { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg = null;

const FileUploadForm = () => {
  const [imgElementSrc, setImgElementSrc] = useState("");
  const [videoElementSrc, setVideoElementSrc] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.target.elements.fileInput.files.length > 0) {
      return console.log("No file selected");
    }
    // get the file from the form input
    const file = event.target.elements.fileInput.files[0];
    // lock and load ffmpeg.wasm
    setMessage("creating ffmpeg");
    if (ffmpeg === null) {
      ffmpeg = createFFmpeg({
        mainName: "main",
        corePath:
          "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
      });
      setMessage("loading ffmpeg");
      // let resourcePath = "/ffmpeg-core.js";
      // let url = new URL(resourcePath, document.location);
      // console.log(url.toString());
      // ffmpeg = createFFmpeg({
      //   // mainName: "main",
      //   corePath: url.toString(),
      // });
    }
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    setMessage("writing file to ffmpeg virtual file system");
    // write the file to ffmpeg's virtual file system
    ffmpeg.FS("writeFile", file.name, await fetchFile(file));

    if (event.target.elements.operation.value === "screenshot") {
      // run the ffmpeg command
      setMessage("running ffmpeg job");
      await ffmpeg.run(
        "-i",
        file.name,
        "-ss",
        "00:00:01.000",
        "-vframes",
        "1",
        "output.png"
      );
      // read the result
      setMessage("reading output file from ffmpeg virtual file system");
      const data = ffmpeg.FS("readFile", "output.png");
      // create a URL
      setMessage("creating image url");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/png" })
      );
      setMessage(null);
      setImgElementSrc(url);
    } else if (event.target.elements.operation.value === "transcode") {
      // run the ffmpeg command
      setMessage("running ffmpeg job");
      await ffmpeg.run("-i", file.name, "output.mp4");
      // read the result
      setMessage("reading output file from ffmpeg virtual file system");
      const data = ffmpeg.FS("readFile", "output.mp4");
      // create a URL
      setMessage("creating image url");
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setMessage(null);
      setVideoElementSrc(url);
    }
  };

  return (
    <div>
      <form id="mediaForm" onSubmit={handleSubmit}>
        <select id="operation">
          <option value="transcode" selected>
            Transcode
          </option>
          <option value="screenshot">Screenshot</option>
        </select>
        <label>
          Upload file:
          <input type="file" name="fileInput" />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        {message && (
          <div style={{ color: "red", height: "200px", width: "100%" }}>
            {message}
          </div>
        )}
      </div>
      {imgElementSrc && (
        <img src={imgElementSrc} style={{ height: "200px", width: "200px" }} />
      )}
      {videoElementSrc && (
        <video
          src={videoElementSrc}
          controls
          style={{ height: "200px", width: "200px" }}
        />
      )}
    </div>
  );
};

export default FileUploadForm;
