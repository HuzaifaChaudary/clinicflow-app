import { Phone, Volume2, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LiveCallIndicatorProps {
  patientName: string;
  duration: string;
  currentlySpeaking: 'ai' | 'patient' | 'listening';
  transcript?: string;
  onClose?: () => void;
}

export function LiveCallIndicator({
  patientName,
  duration,
  currentlySpeaking,
  transcript,
  onClose,
}: LiveCallIndicatorProps) {
  const [callDuration, setCallDuration] = useState(duration);

  // Simulate call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => {
        const [minutes, seconds] = prev.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds + 1;
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        return `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 w-80 rounded-lg shadow-2xl border-2 z-40"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--status-info)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--status-info-bg)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--status-info)',
                color: 'white',
              }}
            >
              <Phone className="w-5 h-5" />
            </div>
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'var(--status-info)', opacity: 0.3 }}></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Live Call
              </p>
              <span
                className="relative flex h-2 w-2"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--status-error)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--status-error)' }}></span>
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {patientName}
            </p>
          </div>
        </div>
        <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
          {callDuration}
        </p>
      </div>

      {/* Status indicator */}
      <div className="px-4 py-3 flex items-center gap-2">
        {currentlySpeaking === 'ai' && (
          <>
            <Volume2 className="w-4 h-4 animate-pulse" style={{ color: 'var(--status-info)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--status-info)' }}>
              AI currently speaking
            </p>
          </>
        )}
        {currentlySpeaking === 'patient' && (
          <>
            <Mic className="w-4 h-4 animate-pulse" style={{ color: 'var(--status-success)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--status-success)' }}>
              Patient speaking
            </p>
          </>
        )}
        {currentlySpeaking === 'listening' && (
          <>
            <Mic className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Listening...
            </p>
          </>
        )}
      </div>

      {/* Live transcript */}
      {transcript && (
        <div
          className="px-4 py-3 border-t max-h-32 overflow-y-auto"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Live Transcript
          </p>
          <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {transcript}
          </p>
        </div>
      )}

      {/* Actions */}
      <div
        className="px-4 py-3 border-t flex gap-2"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <button
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-primary)',
          }}
        >
          Take Over Call
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            Minimize
          </button>
        )}
      </div>
    </div>
  );
}
