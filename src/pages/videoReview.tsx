// src/pages/videoReview.tsx

import { useEffect, useState } from 'react';
import VideoDisplay from '../components/videoDisplay';

interface SectionDetail {
  Analysis: string;
  Recommendations: string[];
  'Relevant Video Section': string;
}

interface SummaryDetail {
  'Overall Assessment': string;
  'Actionable Steps': string[];
}

type Feedback = {
  'Posture & Physical Presence': SectionDetail;
  'Eye Contact': SectionDetail;
  'Vocal Delivery': SectionDetail;
  'Content & Structure': SectionDetail;
  'Nervousness/Comfort': SectionDetail;
  Summary: SummaryDetail;
};

// 2) static list of tabs, Summary always last
const SECTIONS: (keyof Feedback)[] = [
  'Posture & Physical Presence',
  'Eye Contact',
  'Vocal Delivery',
  'Content & Structure',
  'Nervousness/Comfort',
  'Summary',
];

export default function VideoFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof Feedback>(SECTIONS[0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://127.0.0.1:5000/feedback');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Feedback;
        setFeedback(data);
      } catch (err) {
        console.error(err);
        setError('Could not load feedback.');
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div className="alert alert-error p-md">{error}</div>;
  }
  if (!feedback) {
    return <div className="p-lg text-center">Loading feedback…</div>;
  }

  return (
    <div
      className="container flex"
      style={{ gap: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)' }}
    >
      {/* Video Panel */}
      <div className="card" style={{ flex: 1 }}>
        <div className="video-container">
          <VideoDisplay />
        </div>
      </div>

      {/* Feedback Panel */}
      <aside
        className="card"
        style={{
          flex: 1,
          maxHeight: '100vh',
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
        }}
      >
        {/* Tab Bar */}
        <div className="tab-bar">
          {SECTIONS.map((section) => (
            <button
              key={section}
              className={`btn ${activeTab === section ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(section)}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Active Section */}
        {activeTab !== 'Summary' ? (
          // one of the five SectionDetail tabs
          (() => {
            const d = feedback[activeTab] as SectionDetail;
            return (
              <section>
                <h2 className="h4">{activeTab}</h2>
                <p>{d.Analysis}</p>
                <ul className="list-disc list-inside mb-sm">
                  {d.Recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
                <p className="mt-sm">
                  <strong>Relevant Video Section:</strong> {d['Relevant Video Section']}
                </p>
              </section>
            );
          })()
        ) : (
          // Summary tab
          (() => {
            const s = feedback.Summary;
            return (
              <section>
                <h2 className="h4">Summary</h2>
                <p>{s['Overall Assessment']}</p>
                <ul className="list-disc list-inside">
                  {s['Actionable Steps'].map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </section>
            );
          })()
        )}
      </aside>
    </div>
  );
}
