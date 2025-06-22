import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveNew: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // 1) Initialize camera & mic
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(ms => {
        setStream(ms);
        if (videoRef.current) videoRef.current.srcObject = ms;
      })
      .catch(console.error);
  }, []);

  // auto-play the video preview
  useEffect(() => {
    if (stream) videoRef.current?.play();
  }, [stream]);

  // Helper to play audio via HTML5 Audio (replaces react-native-sound-player)
  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Audio play error:', err));
  };

  // Poll /question every 3s and play audio when true
//   useEffect(() => {
//     const poll = setInterval(async () => {
//       try {
//         const res = await fetch('http://127.0.0.1:5000/question');
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         const data = await res.json();
//         if (data === true) {
//           playAudio('http://127.0.0.1:5000/audio');
//           clearInterval(poll);
//         }
//       } catch (err) {
//         console.error('Error polling /question:', err);
//       }
//     }, 3000);
//     return () => clearInterval(poll);
//   }, []);

  // Start recording
  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    setVideoBlob(null);
    setSeconds(0);
    intervalRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);

    const mr = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
    recorderRef.current = mr;
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => setVideoBlob(new Blob(chunksRef.current, { type: 'video/webm' }));
    mr.start();
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
  };

  // Upload video and navigate
  const uploadVideo = async (blob: Blob) => {
    const form = new FormData();
    form.append('file', blob, 'recording.webm');
    try {
      const res = await fetch('http://127.0.0.1:5001/uploadInterview', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error(err);
    }
  };

  const finishLive = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5001/check/interUpload0.mp4`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`Check failed: ${res.statusText}`);
      // optionally you can await res.json() or res.text() here
      navigate("/inter");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <video
        ref={videoRef}
        className="video-preview mirror mb-4 w-full max-w-md"
        muted
        autoPlay
        playsInline
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="controls flex items-center space-x-4">
        <div className="timer font-mono">{formatTime(seconds)}</div>
        {!recording ? (
          <button onClick={startRecording} className="btn-record">Record</button>
        ) : (
          <button onClick={stopRecording} className="btn-stop">Stop</button>
        )}
        {!recording && videoBlob && (
          <button onClick={() => uploadVideo(videoBlob)} className="btn-record">Upload</button>
        )}
        <button onClick={finishLive} className='btn-record'>End Live</button>
      </div>
    </div>
  );
};

export default LiveNew;
