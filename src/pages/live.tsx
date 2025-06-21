import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveSpeech: React.FC = () => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const intervalRef = useRef<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(ms => {
        setStream(ms);
        if (videoRef1.current) videoRef1.current.srcObject = ms;
        if (videoRef2.current) videoRef2.current.srcObject = ms;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (stream) {
      videoRef1.current?.play();
      videoRef2.current?.play();
    }
  }, [stream]);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    setVideoBlob(null);
    setSeconds(0);

    intervalRef.current = window.setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    const mr = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
    recorderRef.current = mr;

    mr.ondataavailable = e => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    mr.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
  };

  const uploadVideo = async (blob: Blob) => {
    const form = new FormData();
    form.append('file', blob, 'recording.webm');

    try {
      const res = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());
      console.log('Upload success');
      navigate('/display');
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)
      .toString()
      .padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;

  return (
    <div
      className="record-root"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
    >
      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <video
          ref={videoRef1}
          className="video-preview mirror"
          muted
          autoPlay
          playsInline
          style={{ transform: 'scaleX(-1)', flex: 1 }}
        />
        <video
          ref={videoRef2}
          className="video-preview mirror"
          muted
          autoPlay
          playsInline
          style={{ transform: 'scaleX(-1)', flex: 1 }}
        />
      </div>

      <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="timer" style={{ fontFamily: 'monospace' }}>{formatTime(seconds)}</div>
        {!recording ? (
          <button onClick={startRecording} className="btn-record">
            Record
          </button>
        ) : (
          <button onClick={stopRecording} className="btn-stop">
            Stop
          </button>
        )}

        {!recording && videoBlob && (
          <button onClick={() => uploadVideo(videoBlob)} className="btn-upload">
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveSpeech;
