import React from "react";
import "../index.css";
import VideoDisplay from "../components/videoDisplay";

interface VideoReviewPageProps {
  file?: File;
  src?: string;
  /**
   * The text or JSX you want to render next to the video.
   */
  children?: React.ReactNode;
}

export default function VideoReview({ file, src, children }: VideoReviewPageProps) {
  return (
    <div
      className="container card"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--spacing-lg)",
      }}
    >
      {/* Left column: video */}
      <div style={{ flex: 1 }}>
        <VideoDisplay file={file} src={src} />
      </div>

      {/* Right column: text or feedback panel */}
      <div style={{ flex: 1, padding: "var(--spacing-md)" }}>
        <h3 className="mb-sm">Speech Feedback</h3>
        <div className="text-secondary">
          {children ?? (
            <p>
              {/* placeholder text */}
              Your speech analysis and feedback will appear here. You can
              display bullet points, scores, or recommendations based on your
              app’s logic.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
