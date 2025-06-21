import './App.css'
import FileUploader from './components/fileUploader'
import VideoDisplay from './components/videoDisplay'
import VideoReview from './pages/videoReview'

function App() {

  return (
    <div className='app-container'>
      <VideoReview src="test.mp4"/>
    </div>
  )
}

export default App
