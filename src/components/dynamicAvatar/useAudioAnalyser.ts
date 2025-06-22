// src/hooks/useAudioAnalyser.ts
import { useEffect, useRef, useState } from 'react';

export function useAudioAnalyser(audioRef: React.RefObject<HTMLAudioElement | null>): Uint8Array {
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef    = useRef<number>(0);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const AudioCtxCtor = window.AudioContext ||
    (window as any).webkitAudioContext;

    const ctx = new AudioCtxCtor();
    const source = ctx.createMediaElementSource(audioEl);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const arr = new Uint8Array(bufferLength);
    analyserRef.current = analyser;

    const tick = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(arr);
      setDataArray(arr.slice());  // copy so React sees the change
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      analyser.disconnect();
      source.disconnect();
      ctx.close();
    };
  }, [audioRef]);

  return dataArray;
}
