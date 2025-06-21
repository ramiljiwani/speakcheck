import { useEffect, useState } from "react";

interface VideoPlayerProps {
    file?: File;
    src?: string;
  }

export default function VideoDisplay({ file, src }: VideoPlayerProps) {
    const [videoUrl, setVideoUrl] = useState<string | undefined>(src);

    useEffect(() => {
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          setVideoUrl(objectUrl);
          return () => {
            URL.revokeObjectURL(objectUrl);
          };
        }
      }, [file]);
    
      if (!videoUrl) return null;
    
      return (
        <div className="video-container mb-md">
          <video
            src={videoUrl}
            controls
            preload="metadata"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
}