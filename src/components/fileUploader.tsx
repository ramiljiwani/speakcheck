import { useState, type ChangeEvent } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) 
        {
            if (e.target.files) {
                setFile(e.target.files[0]);
            }
        }

    async function handleUpload() {
        if (!file) return;
        setStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const resp = await fetch("http://localhost:5173/upload", {
                method: "POST",
                body: formData,
                // If your Flask is on a different origin, make sure CORS is enabled server-side.
            });
      
            if (!resp.ok) throw new Error(`Server error: ${resp.statusText}`);
            setStatus("success");
          } catch (err) {
            console.error(err);
            setStatus("error");
          }
    }

    return (
        <div>
            <input
                type="file"
                accept=".mov,.mp4"
                onChange={handleFileChange}
            />
            { file && status !== "uploading" &&
                <button>Upload</button>
            }
            {status === "uploading" && <p>Uploading…</p>}
            {status === "success" && <p style={{ color: "green" }}>Upload successful!</p>}
            {status === "error" && <p style={{ color: "red" }}>Upload failed.</p>}
        </div>
    )
}