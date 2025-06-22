interface VideoDisplayProps {
  src: string;
}

export default function VideoDisplay({ src }: VideoDisplayProps) {
    
      return (
        <div className="video-container video mb-md">
          <video
            src={src}
            controls
            preload="metadata"
            style={{
              borderRadius: 'var(--radius-md)',
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
}