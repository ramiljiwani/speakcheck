import React, { useEffect, useState } from 'react';
import VideoDisplay from '../components/videoDisplay';

export default function VideoFeedbackPage() {
  const [rawFeedback, setRawFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    try {
      const response = await fetch("http://127.0.0.1:5000/feedback");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      setRawFeedback(text);
      console.log('Feedback loaded:', text);
    } catch (err) {
      console.error('Failed to load feedback:', err);
      setError('Could not load feedback.');
    }
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Raw Feedback Section */}
      <div className="w-full md:w-1/2 overflow-auto bg-gray-50 p-4 rounded">
        {!rawFeedback ? (
          <p>Loading feedback...</p>
        ) : (
          <pre className="whitespace-pre-wrap">{rawFeedback}</pre>
        )}
      </div>

      {/* Video Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <VideoDisplay />
      </div>
    </div>
  );
}
