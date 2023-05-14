import React, { useState } from "react";

const FileUploadForm = () => {
  const [fileName, setFileName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.elements.fileInput.files.length > 0) {
      const file = event.target.elements.fileInput.files[0];
      setFileName(file.name);
    } else {
      setFileName("No file selected");
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
      {fileName && <p>Selected file: {fileName}</p>}
    </div>
  );
};

export default FileUploadForm;
