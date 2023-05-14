import React, { useState } from "react";
import { handleFFmpegOperations } from "../utils/ffmpegUtils";

const FfmpegFormStyledWithUtils = () => {
  const [imgElementSrc, setImgElementSrc] = useState("");
  const [videoElementSrc, setVideoElementSrc] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.target.elements.fileInput.files.length > 0) {
      return console.log("No file selected");
    }
    setMessage("processing ffmpeg job");
    const { imageObjectUrl, videoObjectUrl } = await handleFFmpegOperations(
      event
    );
    if (imageObjectUrl) {
      setImgElementSrc(imageObjectUrl);
    } else if (videoObjectUrl) {
      setVideoElementSrc(videoObjectUrl);
    }
    setMessage(null);
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
      <div style={{ height: "250px" }}>
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
    </div>
  );
};

export default FfmpegFormStyledWithUtils;
