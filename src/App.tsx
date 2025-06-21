import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FileUploader from './components/fileUploader'
import VideoDisplay from './components/videoDisplay'

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FileUploader />} />
          <Route path="/display" element={<VideoDisplay />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
