import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FileUploader from './components/fileUploader'
import VideoDisplay from './components/videoDisplay'
import VideoFeedbackPage from './pages/videoReview'

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FileUploader />} />
          <Route path="/display" element={<VideoFeedbackPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
