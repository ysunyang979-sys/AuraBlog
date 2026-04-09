---
title: Creative Projects
type: "projects"
---

<style>
/* Scoped CSS for Creative Components */
.creative-bento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
}
.bento-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
}
.bento-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0,0,0,0.1);
  border-color: rgba(147, 51, 234, 0.3);
}
.bento-glow {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at center, rgba(147, 51, 234, 0.12) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
  mix-blend-mode: screen;
}
.bento-card:hover .bento-glow { opacity: 1; }

.bento-icon {
  width: 60px; height: 60px;
  border-radius: 18px;
  background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
  display: flex; justify-content: center; align-items: center;
  color: white; margin-bottom: 24px;
  box-shadow: 0 16px 32px rgba(147, 51, 234, 0.25);
  transition: transform 0.4s;
}
.bento-card:hover .bento-icon {
  transform: rotate(-10deg) scale(1.1);
}

.bento-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 24px; font-weight: 800; color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.bento-desc {
  font-size: 15px; color: var(--text-secondary); line-height: 1.6;
}

/* AI Voice Equalizer Component Demo */
.ai-wave { display: flex; gap: 4px; height: 32px; align-items: center;}
.ai-wave span {
  width: 4px; height: 100%;
  background: var(--text-primary); border-radius: 4px;
  animation: wave 1.2s infinite alternate ease-in-out;
}
.ai-wave span:nth-child(2) { animation-delay: 0.1s; height: 60%; }
.ai-wave span:nth-child(3) { animation-delay: 0.3s; height: 80%; }
.ai-wave span:nth-child(4) { animation-delay: 0.5s; height: 40%; }
.ai-wave span:nth-child(5) { animation-delay: 0.2s; height: 100%; }

@keyframes wave { 
  0% { transform: scaleY(0.3); opacity: 0.5; } 
  100% { transform: scaleY(1); opacity: 1; } 
}
</style>

<div class="creative-bento">
  
  <!-- Neural Network Module -->
  <div class="bento-card hover-target">
    <div class="bento-glow"></div>
    <div class="bento-icon" style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); box-shadow: 0 16px 32px rgba(239, 68, 68, 0.25);">
      <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
    </div>
    <div class="bento-title">Quantum Core</div>
    <div class="bento-desc">An experimental physics rendering engine built entirely with mathematical constraints and WebGL arrays.</div>
  </div>

  <!-- Voice AI Component -->
  <div class="bento-card hover-target">
    <div class="bento-glow"></div>
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div class="bento-icon" style="margin-bottom: 0;">
        <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path></svg>
      </div>
      <!-- Equalizer Visualizer -->
      <div class="ai-wave"><span></span><span></span><span></span><span></span><span></span></div>
    </div>
    <div class="bento-title">Aura. Syndicate Voice</div>
    <div class="bento-desc">Real-time artificial synthesis module. Analyzing auditory wavelengths with zero latency.</div>
  </div>

  <!-- Dashboard Widget Component -->
  <div class="bento-card hover-target">
    <div class="bento-glow"></div>
    <div class="bento-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 16px 32px rgba(16, 185, 129, 0.25);">
      <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    </div>
    <div class="bento-title">Bento Analytics UI</div>
    <div class="bento-desc">A conceptual glassmorphic grid mapping library demonstrating extreme visual hierarchy and data flow.</div>
  </div>

</div>
