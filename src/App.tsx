import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VideoFeedbackPage from './pages/videoReview'
import Home from './pages/home'

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<FileUploader />} /> */}
          {/* <Route path="/" element={<RecordSpeech />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/display" element={<VideoFeedbackPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
