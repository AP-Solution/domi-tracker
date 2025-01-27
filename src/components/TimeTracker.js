import React from 'react';
import { useTimeTracker } from '../context/TimeTrackerContext';
import '../styles/TimeTracker.scss';

const TimeTracker = () => {
  const {
    isRunning,
    isPaused,
    time,
    hourlyRate,
    sessions,
    setHourlyRate,
    formatTime,
    calculateEarnings,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
    handleReset,
    handleClearHistory
  } = useTimeTracker();

  return (
    <div className="time-tracker">
      <h1>Тайм Трекер</h1>
      
      <div className="rate-input">
        <label> Ставка ₴ / год:</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="timer-display">
        {formatTime(time)}
      </div>

      <div className="earnings-display">
        {calculateEarnings()} ₴
      </div>

      <div className="controls">
        {!isRunning ? (
          <button className="start" onClick={handleStart}>Старт</button>
        ) : isPaused ? (
          <>
            <button className="resume" onClick={handleResume}>Продовжити</button>
            <button className="stop" onClick={handleStop}>Стоп</button>
          </>
        ) : (
          <>
            <button className="pause" onClick={handlePause}>Пауза</button>
            <button className="stop" onClick={handleStop}>Стоп</button>
          </>
        )}
        <button className="reset" onClick={handleReset}>Скасувати</button>
      </div>

      {sessions.length > 0 && (
        <div className="sessions-history">
          <div className="history-header">
            <h2>Історія робочих змін</h2>
            <button className="clear-history" onClick={handleClearHistory}>
              Очистити історію
            </button>
          </div>
          <div className="sessions-list">
            {sessions.map((session, index) => (
              <div key={index} className="session-item">
                <div className="session-time">Тривалість: {session.duration}</div>
                <div className="session-earnings">Зароблено: {session.earnings} ₴</div>
                <div className="session-timestamp">{session.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
