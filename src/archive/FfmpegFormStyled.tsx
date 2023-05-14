import React, { useState } from "react";

const FfmpegFormStyled = () => {
  const [imgElementSrc, setImgElementSrc] = useState("");
  const [videoElementSrc, setVideoElementSrc] = useState("");
  const [message, setMessage] = useState("");

  const { createFFmpeg, fetchFile } = FFmpeg;
  let ffmpeg = null;

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        id="mediaForm"
        onSubmit={handleSubmit}
        className="grid gap-6 p-8 mt-5 bg-white rounded shadow-lg w-96">
        <label className="font-semibold" htmlFor="operation">
          Operation
        </label>
        <select id="operation" className="p-2 border border-gray-300 rounded">
          <option value="transcode" selected>
            Transcode
          </option>
          <option value="screenshot">Screenshot</option>
        </select>

        <label className="font-semibold" htmlFor="fileInput">
          Upload file:
        </label>
        <input
          id="fileInput"
          type="file"
          name="fileInput"
          className="p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>

      <div>
        {message && (
          <div className="mt-5 p-2 w-full h-48 text-white bg-red-500">
            {message}
          </div>
        )}
      </div>

      {imgElementSrc && (
        <img className="mt-5 h-48 w-48 object-cover" src={imgElementSrc} />
      )}

      {videoElementSrc && (
        <video
          className="mt-5 h-48 w-48 object-cover"
          src={videoElementSrc}
          controls
        />
      )}
    </div>
  );
};

export default FfmpegFormStyled;
