# SpeakCheck 🎤

A comprehensive AI-powered public speaking analysis platform that provides real-time feedback on your presentation skills, body language, and vocal delivery.

## 🌟 Features

### 📹 **Live Recording & Analysis**
- Real-time video recording with camera and microphone
- Instant AI-powered feedback on your speaking performance
- Live interview simulation with AI-generated questions
- Real-time audio responses using text-to-speech

### 🎯 **Comprehensive Speech Analysis**
- **Posture & Physical Presence**: Analyzes stance, gestures, and body language
- **Eye Contact**: Evaluates connection with audience and gaze patterns
- **Vocal Delivery**: Assesses pace, volume, clarity, and tonal variation
- **Content & Structure**: Reviews message clarity and logical flow
- **Nervousness/Comfort**: Identifies stress indicators and comfort levels

### 📁 **File Upload & Review**
- Upload pre-recorded videos (.mov, .mp4)
- Detailed analysis with timestamped feedback
- Actionable recommendations for improvement
- Professional assessment summary

### 🎨 **Modern UI/UX**
- Clean, responsive interface built with React and TypeScript
- Real-time video preview with mirror effect
- Progress indicators and status updates
- Tabbed navigation for different features

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Three.js** with React Three Fiber for 3D visualizations
- **Socket.IO** for real-time communication

### Backend
- **Flask** (Python) web server
- **Google Gemini AI** for video analysis and interview questions
- **FFmpeg** for video/audio processing
- **Flask-SocketIO** for WebSocket support
- **Flask-CORS** for cross-origin requests

### AI & Analysis
- **Google Gemini 2.0 Flash** for video analysis
- **Google Gemini 2.5 Flash** for interview question generation
- **Google Gemini TTS** for text-to-speech responses
- Custom prompts for specialized public speaking evaluation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python 3.10+
- FFmpeg installed on your system
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/speakcheck.git
   cd speakcheck
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install flask flask-cors flask-socketio google-genai ffmpeg-python
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   python app.py
   ```
   The Flask server will run on `http://127.0.0.1:5000`

   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```
   The React app will run on `http://localhost:5173`

## 📖 Usage Guide

### 🎤 Live Recording Mode
1. Navigate to the "live" tab
2. Grant camera and microphone permissions
3. Click "Record" to start recording your speech
4. Click "Stop" when finished
5. Click "Upload" to send for analysis
6. Click "End Live" to get comprehensive feedback

### 📁 File Upload Mode
1. Navigate to the "upload" tab
2. Click or drag & drop your video file (.mov, .mp4)
3. Click "Upload" to start analysis
4. Wait for AI processing to complete
5. Review detailed feedback with timestamps

### 🎯 Pitch Practice Mode
1. Navigate to the "pitch" tab
2. Record your pitch or presentation
3. Upload for specialized business pitch analysis
4. Receive targeted feedback for investor presentations

## 🔧 API Endpoints

### Backend Routes
- `POST /upload` - Upload video for analysis
- `POST /uploadInterview` - Upload interview video with AI questions
- `GET /feedback` - Retrieve analysis results
- `GET /question` - Check for new AI questions
- `GET /audio` - Stream AI-generated audio responses
- `POST /check/<filename>` - Process specific video file

## 📁 Project Structure

```
speakcheck/
├── backend/                 # Flask server
│   ├── app.py              # Main Flask application
│   ├── check.py            # Video analysis logic
│   ├── interview.py        # Interview question generation
│   └── feedback.json       # Analysis results
├── src/
│   ├── components/         # Reusable React components
│   │   ├── fileUploader.tsx
│   │   ├── videoDisplay.tsx
│   │   └── dynamicAvatar/
│   ├── pages/              # Main application pages
│   │   ├── home.tsx        # Main dashboard
│   │   ├── liveNew.tsx     # Live recording interface
│   │   ├── recordSpeech.tsx # Pitch recording
│   │   └── interReview.tsx # Interview review
│   └── types/              # TypeScript type definitions
├── uploads/                # Uploaded video files
└── public/                 # Static assets
```

## 🎨 Customization

### Styling
The application uses custom CSS classes. Main styling can be found in:
- `src/App.css` - Global styles
- `src/index.css` - Base styles
- Component-specific styles in each component

### AI Analysis
Modify the analysis prompts in:
- `backend/check.py` - Main analysis prompt
- `backend/interview.py` - Interview question generation


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful video analysis capabilities
- React and Vite teams for excellent development tools
- FFmpeg for robust video processing
- The open-source community for inspiration and libraries


---

**Made with ❤️ for better public speaking**
