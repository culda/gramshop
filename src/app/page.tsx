"use client";
import Image from "next/image";

export default function Home() {
  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const buffer = reader.result as ArrayBuffer;
        // const base64 = Buffer.from(buffer).toString("base64");

        // Convert the ArrayBuffer to Base64
        const base64 = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        console.log(typeof base64);
        const buff = Buffer.from(base64, "base64");
        console.log(buff);

        try {
          await fetch("/csvupload", {
            method: "PUT",
            headers: {
              "Content-Type": "application/octet-stream; base64",
            },
            body: base64,
          });
          console.log("File uploaded successfully");
        } catch (error) {
          console.error("Error uploading file", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="file" onChange={handleFileUpload} />
    </main>
  );
}
