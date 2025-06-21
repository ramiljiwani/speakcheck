import React, { useState, useRef, useEffect } from 'react';

// recordSpeech.tsx
const RecordSpeech: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);

  // Request camera + microphone access once
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch(err => console.error('getUserMedia error:', err));
  }, []);

  // Autoplay the video preview
  useEffect(() => {
    if (stream) {
      videoRef.current?.play();
    }
  }, [stream]);

  // Start recording into chunks
  const startRecording = () => {
    if (!stream) return;
    const options = { mimeType: 'video/webm; codecs=vp8' };
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        setChunks(prev => [...prev, e.data]);
      }
    };
    mediaRecorder.onstop = handleStop;
    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setChunks([]);
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    recorder?.stop();
    setRecording(false);
  };

  // Called when recorder stops: assemble blob and upload
  const handleStop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    uploadVideo(blob);
  };

  // Upload blob to Flask backend
  const uploadVideo = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Upload failed:', text);
      } else {
        console.log('Upload success');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="p-4">
      {/* Live preview mirrored like a mirror */}
      <video
        ref={videoRef}
        style={{ transform: 'scaleX(-1)' }}
        className="w-full max-w-md border"
        muted
        autoPlay
        playsInline
      />
      <div className="mt-2">
        {!recording ? (
          <button onClick={startRecording} className="px-4 py-2 bg-green-500 text-white rounded">
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="px-4 py-2 bg-red-500 text-white rounded">
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordSpeech;
