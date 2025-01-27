import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TimeTrackerProvider } from './context/TimeTrackerContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import TimeTracker from './components/TimeTracker';
import Deliveries from './components/Deliveries';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  return (
    <TimeTrackerProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timetracker" element={<TimeTracker />} />
              <Route path="/deliveries" element={<Deliveries />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TimeTrackerProvider>
  );
}

export default App;
