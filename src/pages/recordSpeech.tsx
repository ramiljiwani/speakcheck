import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const RecordSpeech: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
        if (videoRef.current) videoRef.current.srcObject = ms;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (stream) videoRef.current?.play();
  }, [stream]);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];        // clear the buffer
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
      // build the blob from our ref
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
      navigate("/display")
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t: number) =>
    `${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;

  return (
    <div className="record-root">
      <video ref={videoRef} className="video-preview mirror" muted autoPlay playsInline style={{transform: 'scaleX(-1)'}}/>
      <div className="controls">
        <div className="timer">{formatTime(seconds)}</div>
        {!recording
          ? <button onClick={startRecording} className="btn-record">Record</button>
          : <button onClick={stopRecording} className="btn-stop">Stop</button>
        }
        {!recording && videoBlob && (
          <button onClick={() => uploadVideo(videoBlob)} className="btn-upload">Upload</button>
        )}
      </div>
      {!recording && videoBlob && (
        <video src={URL.createObjectURL(videoBlob)} controls style={{ marginTop: 10, maxWidth: '100%' }}/>
      )}
    </div>
  );
};

export default RecordSpeech;
