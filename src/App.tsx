// src/App.tsx
import React, { useEffect, useRef,  } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Home from './pages/home';
import VideoFeedbackPage from './pages/videoReview';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(err => console.error('Audio play failed', err));
    }
  };

  useEffect(() => {
    // 1) connect to your Flask-SocketIO server
    socketRef.current = io('http://127.0.0.1:5001');

    // 2) once connected, subscribe to our event
    socketRef.current.on('connect', () => {
      console.log('[Socket.IO] connected, id=', socketRef.current?.id);
    });

    socketRef.current!.on('question_ready', () => {
      console.log('[Socket.IO] question_ready received, playing audio');
    
      // 1) Bust the browser cache with a timestamp:
      const url = `http://127.0.0.1:5001/audio?ts=${Date.now()}`;
    
      if (audioRef.current) {
        audioRef.current.src = url;
        // 2) Force the element to reload the new resource
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => console.log('[App] playing updated audio'))
          .catch(err => console.error('[App] audio.play() failed', err));
      }
    });

    // optional: handle errors/disconnects
    socketRef.current.on('disconnect', () => {
      console.log('[Socket.IO] disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/display" element={<VideoFeedbackPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
