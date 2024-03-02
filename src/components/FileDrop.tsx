import React, { useRef, useState } from "react";
import { useSnackbar } from "./SnackbarProvider";
import Spinner from "./Spinner";
import Button from "./Button";

const FileDrop = ({ onUpload }: { onUpload: (base64: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const snack = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    let dt = event.dataTransfer;
    let files = dt.files;

    if (files.length !== 1) {
      snack({
        key: "file-drop-error",
        text: "Please drop only a single file.",
        variant: "error",
      });
      return;
    }

    handleFileUpload(files[0]);
  };

  const handleFiles = (files: FileList | null) => {
    if (files?.length !== 1) {
      snack({
        key: "file-drop-error",
        text: "Please drop only a single file.",
        variant: "error",
      });
      return;
    }

    handleFileUpload(files[0]);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      if (file.type !== "text/csv") {
        snack({
          key: "file-drop-error",
          text: "Please upload a .csv file.",
          variant: "error",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        snack({
          key: "file-drop-error",
          text: "File size exceeds 2MB limit.",
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        try {
          await onUpload(base64);
          console.log("File uploaded successfully");
        } catch (error) {
          console.error("Error uploading file", error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      snack({
        key: "file-drop-error",
        text: "Error uploading file",
        variant: "error",
      });
    }
  };

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (dropAreaRef.current) dropAreaRef.current.classList.add("bg-gray-50");
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (dropAreaRef.current) dropAreaRef.current.classList.remove("bg-gray-50");
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const handleDropEvent: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (dropAreaRef.current) dropAreaRef.current.classList.remove("bg-gray-50");
    handleDrop(event);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div
        ref={dropAreaRef}
        id="drop-area"
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-xl text-center"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        <p className="text-gray-700 text-lg pointer-events-none">
          Drag and drop your files here
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden pointer-events-none"
          multiple
          onChange={(event) => handleFiles(event.target?.files)}
        />
        <Button
          variant="primary"
          className="mx-auto mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Or select files
        </Button>
      </div>
    </div>
  );
};

export default FileDrop;
