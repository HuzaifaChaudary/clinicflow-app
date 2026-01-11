import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Phone, CheckCircle, Calendar, ArrowRight } from 'lucide-react';

export function VoiceStateVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Map scroll to states: 0-0.3 = Idle, 0.3-0.6 = Calling, 0.6-1 = Listening
  const idleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const callingOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const listeningOpacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);

  // Waveform intensity (scroll-driven only)
  const waveIntensity = useTransform(scrollYProgress, [0, 0.35, 0.6, 1], [0.1, 1, 0.4, 0.3]);

  // Create waveform bars with transforms at the top level
  const waveformBars = Array.from({ length: 40 }).map((_, i) => {
    const baseHeight = 4 + Math.sin(i * 0.3) * 8;
    const maxHeight = baseHeight * 4;
    
    const barHeight = useTransform(
      waveIntensity, 
      [0, 1], 
      [baseHeight, maxHeight]
    );
    
    return { barHeight, key: i };
  });

  return (
    <div ref={containerRef} className="relative min-h-[600px]">
      <div className="sticky top-32">
        {/* BLUE BACKGROUND CONTAINER - NO WHITE CARD */}
        <div className="relative w-full h-[500px] rounded-2xl bg-[var(--blue-primary)] overflow-hidden">
          
          {/* Background grid pattern (white, subtle) */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* CALL FLOW DIAGRAM - Top Section */}
          <div className="absolute top-8 left-8 right-8 z-10">
            <div className="flex items-center justify-between max-w-2xl">
              {/* Flow: Phone → Arrow → Checkmark */}
              <div className="flex items-center gap-4">
                {/* Phone Icon */}
                <motion.div 
                  className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center"
                  style={{ opacity: callingOpacity }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </motion.div>

                {/* Arrow */}
                <motion.div style={{ opacity: callingOpacity }}>
                  <ArrowRight className="w-6 h-6 text-white/70" />
                </motion.div>

                {/* Checkmark (Confirm) */}
                <motion.div 
                  className="w-12 h-12 rounded-full bg-[var(--orange-signal)] border-2 border-[var(--orange-signal)] flex items-center justify-center"
                  style={{ opacity: listeningOpacity }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Alternative Flow: Phone → Arrow → Reschedule */}
              <div className="flex items-center gap-4">
                {/* Phone Icon */}
                <motion.div 
                  className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center"
                  style={{ opacity: callingOpacity }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </motion.div>

                {/* Arrow */}
                <motion.div style={{ opacity: callingOpacity }}>
                  <ArrowRight className="w-6 h-6 text-white/70" />
                </motion.div>

                {/* Calendar (Reschedule) */}
                <motion.div 
                  className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center"
                  style={{ opacity: listeningOpacity }}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* State Labels - White Text */}
          <div className="absolute top-28 left-8 right-8 z-10">
            <motion.div style={{ opacity: idleOpacity }} className="absolute">
              <div className="text-xs tracking-widest uppercase text-white/60">System Status</div>
              <div className="text-sm mt-1 text-white">Idle / Monitoring</div>
            </motion.div>
            
            <motion.div style={{ opacity: callingOpacity }} className="absolute">
              <div className="text-xs tracking-widest uppercase text-white/90">Active Call</div>
              <div className="text-sm mt-1 text-white">Calling Patient</div>
            </motion.div>
            
            <motion.div style={{ opacity: listeningOpacity }} className="absolute">
              <div className="text-xs tracking-widest uppercase text-[var(--orange-signal)]">Processing</div>
              <div className="text-sm mt-1 text-white">Listening / Responding</div>
            </motion.div>
          </div>

          {/* Channel Indicators - White Text */}
          <div className="absolute left-8 top-52 space-y-3 z-10">
            {/* Voice Channel */}
            <motion.div 
              className="flex items-center gap-3"
              style={{ opacity: callingOpacity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                style={{ opacity: callingOpacity }}
              />
              <span className="text-xs text-white">Voice</span>
            </motion.div>

            {/* SMS Channel (Inactive) */}
            <motion.div 
              className="flex items-center gap-3"
              style={{ opacity: idleOpacity }}
            >
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-xs text-white/40">SMS</span>
            </motion.div>

            {/* System Channel */}
            <motion.div 
              className="flex items-center gap-3"
              style={{ opacity: listeningOpacity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                style={{ opacity: listeningOpacity }}
              />
              <span className="text-xs text-white">System</span>
            </motion.div>
          </div>

          {/* Voice Waveform - White Bars */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1 h-32">
              {waveformBars.map(({ barHeight, key }) => (
                <motion.div
                  key={key}
                  className="w-1 rounded-full bg-gradient-to-t from-white/20 to-white/60"
                  style={{
                    height: barHeight,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status Bar - Bottom */}
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex items-center justify-between text-xs text-white/60">
              <motion.span style={{ opacity: idleOpacity }}>
                Awaiting next scheduled call...
              </motion.span>
              <motion.span style={{ opacity: callingOpacity }}>
                Dialing patient number...
              </motion.span>
              <motion.span style={{ opacity: listeningOpacity }}>
                Response confirmed, updating schedule
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
