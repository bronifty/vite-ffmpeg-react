import React, { useState } from "react";
const { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg = null;

const FileUploadForm = () => {
  const [elementSrc, setElementSrc] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (event.target.elements.fileInput.files.length > 0) {
      // get the file from the form input
      const file = event.target.elements.fileInput.files[0];
      // lock and load ffmpeg.wasm
      if (ffmpeg === null) {
        ffmpeg = createFFmpeg({
          mainName: "main",
          corePath:
            "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
        });
      }
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      // write the file to ffmpeg's virtual file system
      // ffmpeg.FS("writeFile", name, await fetchFile(files[0]));
      ffmpeg.FS("writeFile", file.name, await fetchFile(file));
      // run the ffmpeg command
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
      const data = ffmpeg.FS("readFile", "output.png");
      // create a URL
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/png" })
      );
      setElementSrc(url);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Upload file:
          <input type="file" name="fileInput" />
        </label>
        <button type="submit">Submit</button>
      </form>
      {elementSrc && <img src={elementSrc} />}
    </div>
  );
};

export default FileUploadForm;
