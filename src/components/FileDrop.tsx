import React from "react";

const FileDrop = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const handleDrop = (event) => {
    let dt = event.dataTransfer;
    let files = dt.files;

    if (files.length !== 1) {
      // Display an error message or take appropriate action
      console.log("Please drop only a single file.");
      return;
    }

    onUpload(files[0]);
  };

  const handleFiles = (files) => {
    // Process the files here
    console.log(files);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        id="drop-area"
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-xl text-center"
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => event.target.classList.add("bg-gray-50")}
        onDragLeave={(event) => event.target.classList.remove("bg-gray-50")}
        onDrop={(event) => {
          event.preventDefault();
          event.target.classList.remove("bg-gray-50");
          handleDrop(event);
        }}
      >
        <p className="text-gray-700 text-lg">Drag and drop your files here</p>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          onClick={() =>
            document.querySelector("#drop-area input[type=file]").click()
          }
        >
          Or select files
        </button>
      </div>
    </div>
  );
};

export default FileDrop;
