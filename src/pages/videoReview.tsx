import { useEffect, useState } from 'react';
import feedbackData from '../../feedback.json'
import VideoDisplay from '../components/videoDisplay';
import { type Feedback } from '../types/feedback';

export default function VideoFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback>({});

  useEffect(() => {
    // Load feedback from JSON file
    setFeedback(feedbackData as Feedback);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Feedback Section */}
      <div className="w-full md:w-1/2 overflow-y-auto">
        {Object.entries(feedback).map(([section, data]) => (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{section}</h2>
            {data.Observations && (
              <p className="mb-2">
                <strong>Observations:</strong> {data.Observations}
              </p>
            )}
            {data.Recommendations && (
              <ul className="list-disc list-inside space-y-1">
                {data.Recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Video Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <VideoDisplay />
      </div>
    </div>
  );
}
