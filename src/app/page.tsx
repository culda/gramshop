"use client";

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
        const base64 = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        try {
          const res = await fetch("/csvupload", {
            method: "PUT",
            headers: {
              "Content-Type": "application/octet-stream; base64",
            },
            body: base64,
          });
          console.log("File uploaded successfully", res);
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
