import { useState } from "react";
import RecordSpeech from "./recordSpeech";
import FileUploader from "../components/fileUploader";
import LiveSpeech from "./live";
import LiveNew from "./liveNew";

const TABS = ['pitch', 'live', 'upload'] as const;
type Tab = typeof TABS[number];

export default function Home() {
    const [activeTab, setActiveTab] = useState<Tab>('live');
    return (
        <div className="home flex-col">
            <h1 
                className="h1"
                style={{ paddingTop: '1vh', marginBottom: '10vh' }}
            >
                SpeakCheck
            </h1>
            {/* Tab Bar */}
        <div className="tab-bar">
            {TABS.map((tab) => (
            <button
                key={tab}
                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
            {activeTab === 'pitch' && (
            <div className="container">
                <RecordSpeech/>
            </div>
            )}

            {activeTab === 'live' && (
            <div>
                <LiveNew/>
            </div>
            )}

            {activeTab === 'upload' && (
            <div>
                <FileUploader/>
            </div>
            )}
        </div>
        </div>
    )
}