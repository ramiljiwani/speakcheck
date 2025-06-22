import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

type UploadStatus = "idle" | "uploading" | "analyzing" | "success" | "error";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const navigate = useNavigate();
  
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
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
        const resp = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!resp.ok) throw new Error(`Server error: ${resp.statusText}`);
  
        setStatus("analyzing");
        const data = await resp.json();
        console.log("AI feedback:", data);
  
        setStatus("success");
        navigate("/display");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
  
    return (
      <>
        <div className="container card text-center">
          <h2 className="mb-md">Upload Your Speech</h2>
          <label className="dropzone mb-md">
            {file ? file.name : "Click here or drag & drop to select a file"}
            <input
              type="file"
              accept=".mov,.mp4"
              onChange={handleFileChange}
              className="input mb-md"
            />
          </label>
          {file && status !== "uploading" && (
            <button onClick={handleUpload} className="btn btn-primary mb-md">
              Upload
            </button>
          )}
          {status === "success" && (
            <div className="alert alert-success">Upload successful!</div>
          )}
          {status === "error" && (
            <div className="alert alert-error">
              Upload failed. Please try again.
            </div>
          )}
        </div>
      </>
    );
  }
  