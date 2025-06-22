import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

type UploadStatus = "idle" | "uploading" | "analyzing" | "success" | "error";

const analysisSteps = [
  "Analyzing speech",
  "Analyzing body language",
  "Analyzing facial expressions",
  "Compiling expert feedback",
];

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  // cycle through *all* steps while uploading/analyzing
  useEffect(() => {
    if (status !== "uploading" && status !== "analyzing") return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex(i => (i + 1) % analysisSteps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [status]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFile(e.target.files[0]);
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
      setTimeout(() => navigate("/display"), 500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="container card text-center">
      <h2 className="mb-md">Upload Your Speech</h2>

      <label className="dropzone mb-md">
        {file ? file.name : "Click here or drag & drop to select a file"}
        <input
          type="file"
          accept=".mov,.mp4"
          onChange={handleFileChange}
        />
      </label>

      {(status === "idle" || status === "error") && file && (
        <button onClick={handleUpload} className="btn btn-primary mb-md">
          Upload
        </button>
      )}

      {(status === "uploading" || status === "analyzing") && (
        <div className="progress-container">
          <div className="progress-bar">
            <span className="progress-text">
              {analysisSteps[stepIndex]}
            </span>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="alert alert-success mb-md">
          All set! Redirecting…
        </div>
      )}

      {status === "error" && (
        <div className="alert alert-error">
          Oops! Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}
