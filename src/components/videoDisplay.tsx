export default function VideoDisplay() {

    const videoUrl = "backend/uploads/upload.mov"
    
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