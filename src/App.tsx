import { useState, useRef, useEffect } from "react";

const ACCENT = "#c5f135";
const BG = "#0a0a0a";
const CARD = "#141414";
const CARD2 = "#1c1c1c";
const MUTED = "#555";
const TEXT = "#fff";
const SUBTEXT = "#888";

const weekHistory = [
  { week: "Wk 1", target: 2, done: 1 },
  { week: "Wk 2", target: 2, done: 2 },
  { week: "Wk 3", target: 2, done: 0 },
  { week: "Wk 4", target: 2, done: 2 },
  { week: "Wk 5", target: 2, done: 2 },
  { week: "Wk 6", target: 2, done: 1 },
  { week: "Wk 7", target: 2, done: 2 },
  { week: "Wk 8", target: 2, done: 1 },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];
const completedDays = [0, 1, 3];
const todayIndex = 4;

const initialSessions = [
  { id: 1, day: "Tuesday", time: "7:00 PM", duration: "45 min", type: "Hitting session", done: true },
  { id: 2, day: "Saturday", time: "10:00 AM", duration: "60 min", type: "Match", done: false },
];

function Btn({ children, onClick, primary, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? ACCENT : "transparent",
      border: primary ? "none" : `1px solid #333`,
      color: primary ? BG : SUBTEXT,
      borderRadius: 12, padding: "12px 20px",
      fontSize: 14, fontWeight: primary ? 600 : 400,
      fontFamily: "'DM Sans', sans-serif",
      cursor: "pointer", transition: "all 0.15s",
      ...style
    }}>{children}</button>
  );
}

function Tag({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? ACCENT : CARD2,
      color: active ? BG : SUBTEXT,
      border: "none", borderRadius: 20,
      padding: "8px 16px", fontSize: 13, fontWeight: active ? 600 : 400,
      fontFamily: "'DM Sans', sans-serif",
      cursor: "pointer", transition: "all 0.15s",
    }}>{children}</button>
  );
}

// ── ONBOARDING ──────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [freq, setFreq] = useState(null);
  const [busyDays, setBusyDays] = useState([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const goals = ["Build a habit", "Improve my game", "Meet people to play with", "Just stay active"];
  const freqs = ["1x / week", "2x / week", "3x / week"];

  const toggleDay = d => setBusyDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const steps = [
    // Step 0 — Name
    <div key={0}>
      <div style={{ fontSize: 26, fontWeight: 600, color: TEXT, marginBottom: 8 }}>What should we call you?</div>
      <div style={{ fontSize: 14, color: SUBTEXT, marginBottom: 28 }}>Rally will personalise your plan around you.</div>
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Your first name"
        style={{
          width: "100%", background: CARD, border: "1px solid #222", borderRadius: 12,
          padding: "14px 16px", fontSize: 16, color: TEXT, boxSizing: "border-box",
          fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 20,
        }}
      />
      <Btn primary onClick={() => name.trim() && setStep(1)} style={{ width: "100%" }}>Continue →</Btn>
    </div>,

    // Step 1 — Goal
    <div key={1}>
      <div style={{ fontSize: 26, fontWeight: 600, color: TEXT, marginBottom: 8 }}>What's your main goal?</div>
      <div style={{ fontSize: 14, color: SUBTEXT, marginBottom: 28 }}>Pick one — you can always change this later.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {goals.map(g => (
          <button key={g} onClick={() => setGoal(g)} style={{
            background: goal === g ? "#1e2a00" : CARD,
            border: `1px solid ${goal === g ? ACCENT : "#222"}`,
            borderRadius: 12, padding: "14px 16px", fontSize: 14,
            color: goal === g ? ACCENT : SUBTEXT, textAlign: "left",
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s"
          }}>{g}</button>
        ))}
      </div>
      <Btn primary onClick={() => goal && setStep(2)} style={{ width: "100%" }}>Continue →</Btn>
    </div>,

    // Step 2 — Frequency
    <div key={2}>
      <div style={{ fontSize: 26, fontWeight: 600, color: TEXT, marginBottom: 8 }}>How often do you want to play?</div>
      <div style={{ fontSize: 14, color: SUBTEXT, marginBottom: 28 }}>Be realistic — consistency beats ambition.</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {freqs.map(f => <Tag key={f} active={freq === f} onClick={() => setFreq(f)}>{f}</Tag>)}
      </div>
      <Btn primary onClick={() => freq && setStep(3)} style={{ width: "100%" }}>Continue →</Btn>
    </div>,

    // Step 3 — Busy days
    <div key={3}>
      <div style={{ fontSize: 26, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Your busiest days?</div>
      <div style={{ fontSize: 14, color: SUBTEXT, marginBottom: 28 }}>Rally will avoid scheduling sessions on these days.</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {daysOfWeek.map(d => <Tag key={d} active={busyDays.includes(d)} onClick={() => toggleDay(d)}>{d}</Tag>)}
      </div>
      <Btn primary onClick={() => onDone({ name, goal, freq, busyDays })} style={{ width: "100%" }}>Build my plan →</Btn>
    </div>,
  ];

  return (
    <div style={{ padding: "48px 24px 32px" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 2,
            background: i <= step ? ACCENT : "#1c1c1c",
            transition: "background 0.3s"
          }} />
        ))}
      </div>
      {steps[step]}
    </div>
  );
}

// ── HOME ────────────────────────────────────────────────────────────────────
function Home({ user }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [showLog, setShowLog] = useState(null);
  const [logNote, setLogNote] = useState("");
  const [streak, setStreak] = useState(6);

  const done = sessions.filter(s => s.done).length;
  const total = sessions.length;
  const pct = Math.round((done / total) * 100);

  function logSession(id) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, done: true } : s));
    setStreak(prev => prev + 1);
    setLogNote("");
    setShowLog(null);
  }

  return (
    <div style={{ padding: "32px 24px 120px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: MUTED, letterSpacing: "0.1em", marginBottom: 4 }}>RALLY</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: TEXT }}>Hey, {user.name} 👋</div>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", background: ACCENT,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 600, color: BG
        }}>{user.name[0].toUpperCase()}</div>
      </div>

      {/* Week strip */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {days.map((d, i) => {
          const isDone = completedDays.includes(i);
          const isToday = i === todayIndex;
          return (
            <div key={i} style={{
              flex: 1, height: 52, borderRadius: 10,
              background: isDone ? ACCENT : isToday ? CARD2 : CARD,
              border: isToday && !isDone ? "1px solid #333" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: isDone ? BG : MUTED }}>{d}</div>
              {isDone && <div style={{ width: 4, height: 4, borderRadius: "50%", background: BG }} />}
              {isToday && !isDone && <div style={{ width: 4, height: 4, borderRadius: "50%", background: ACCENT }} />}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[{ val: streak, label: "Day streak" }, { val: `${done}/${total}`, label: "This week" }, { val: "14", label: "All sessions" }].map((s, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: SUBTEXT }}>Weekly progress</span>
          <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: ACCENT }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: CARD2, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 4, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Sessions */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 12, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>THIS WEEK</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sessions.map(s => (
            <div key={s.id} style={{
              background: CARD, borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              border: s.done ? "1px solid #2a3a00" : "1px solid transparent"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.done ? ACCENT : "#333" }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{s.day} · {s.time}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{s.duration} · {s.type}</div>
                </div>
              </div>
              {!s.done
                ? <button onClick={() => setShowLog(s.id)} style={{ background: "transparent", border: "1px solid #333", color: SUBTEXT, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log</button>
                : <div style={{ fontSize: 11, color: ACCENT, fontFamily: "'DM Mono', monospace" }}>DONE</div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Log modal */}
      {showLog && (
        <div style={{ background: CARD, border: "1px solid #222", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 10 }}>How did it go?</div>
          <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
            placeholder="Optional — e.g. worked on backhand, played 3 sets..."
            style={{ width: "100%", background: BG, border: "1px solid #222", borderRadius: 10, padding: 10, fontSize: 13, color: TEXT, resize: "none", height: 72, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn primary onClick={() => logSession(showLog)} style={{ flex: 1 }}>Mark as done</Btn>
            <Btn onClick={() => setShowLog(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* Nudge */}
      <div style={{ background: CARD, borderRadius: 14, padding: 16, border: "1px solid #1e2a00" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, background: BG, borderRadius: "50%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 10 }}>
              You haven't played in 3 days. Want to lock in Saturday morning?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn style={{ fontSize: 12, padding: "6px 12px" }}>Not now</Btn>
              <Btn primary style={{ fontSize: 12, padding: "6px 14px" }}>Let's do it</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COACH ───────────────────────────────────────────────────────────────────
function Coach({ user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hey ${user.name}! I'm your Rally coach. I know your goal is to "${user.goal}" and you want to play ${user.freq}. How can I help today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", text: userMsg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Rally, an AI tennis consistency coach. The user's name is ${user.name}. Their goal is: "${user.goal}". They want to play ${user.freq}. Their busy days are: ${user.busyDays.join(", ") || "none specified"}.

Be warm, encouraging, and concise. You help them schedule sessions, stay accountable, and improve their game. Keep responses short (2-4 sentences max). Never be preachy. Be like a good friend who also happens to know tennis.`,
          messages: history.map(m => ({ role: m.role, content: m.text })),
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text).join("") || "I'm having trouble connecting right now. Try again in a moment!";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection issue — try again in a moment!" }]);
    }
    setLoading(false);
  }

  const suggestions = ["Find me a slot this week", "I missed my session, what now?", "Tips for my serve", "How do I stay motivated?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", padding: "24px 24px 0" }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: MUTED, letterSpacing: "0.1em", marginBottom: 4 }}>RALLY COACH</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: TEXT, marginBottom: 20 }}>Your AI coach</div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%", padding: "10px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.6,
              background: m.role === "user" ? "#1e2a00" : CARD,
              color: m.role === "user" ? ACCENT : "#ccc",
              borderBottomRightRadius: m.role === "user" ? 4 : 14,
              borderBottomLeftRadius: m.role === "assistant" ? 4 : 14,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: CARD, padding: "12px 16px", borderRadius: 14, borderBottomLeftRadius: 4, display: "flex", gap: 4, alignItems: "center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: MUTED, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => { setInput(s); }} style={{
              background: CARD, border: "1px solid #222", borderRadius: 20,
              padding: "6px 12px", fontSize: 12, color: SUBTEXT, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 10, paddingBottom: 24, paddingTop: 8, borderTop: "1px solid #1c1c1c" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your coach anything..."
          style={{
            flex: 1, background: CARD, border: "1px solid #222", borderRadius: 12,
            padding: "12px 16px", fontSize: 14, color: TEXT, fontFamily: "'DM Sans', sans-serif", outline: "none"
          }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          background: input.trim() ? ACCENT : CARD2, border: "none", borderRadius: 12,
          width: 48, cursor: input.trim() ? "pointer" : "default", transition: "background 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill={input.trim() ? BG : MUTED}>
            <path d="M2 8l12-6-5 6 5 6z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── PROGRESS ─────────────────────────────────────────────────────────────────
function Progress() {
  const totalDone = weekHistory.reduce((a, w) => a + w.done, 0);
  const totalTarget = weekHistory.reduce((a, w) => a + w.target, 0);
  const consistencyPct = Math.round((totalDone / totalTarget) * 100);
  const bestStreak = 5;

  return (
    <div style={{ padding: "32px 24px 120px" }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: MUTED, letterSpacing: "0.1em", marginBottom: 4 }}>RALLY</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: TEXT, marginBottom: 24 }}>Your progress</div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
        {[
          { val: `${consistencyPct}%`, label: "Consistency", sub: "last 8 weeks" },
          { val: totalDone, label: "Sessions played", sub: "all time" },
          { val: bestStreak, label: "Best streak", sub: "days" },
          { val: `${totalTarget - totalDone}`, label: "Missed sessions", sub: "last 8 weeks" },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 14, padding: "16px 14px" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: i === 0 ? ACCENT : TEXT, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 13, color: TEXT, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly bars */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: MUTED, letterSpacing: "0.05em", marginBottom: 16 }}>WEEKLY HISTORY</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {weekHistory.map((w, i) => {
            const pct = Math.round((w.done / w.target) * 100);
            const color = pct === 0 ? "#993C1D" : pct < 100 ? "#BA7517" : ACCENT;
            return (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: SUBTEXT }}>{w.week}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color }}>{w.done}/{w.target}</span>
                </div>
                <div style={{ height: 8, background: CARD2, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight card */}
      <div style={{ background: "#1e2a00", border: "1px solid #2a3a00", borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#639922", letterSpacing: "0.05em", marginBottom: 8 }}>RALLY INSIGHT</div>
        <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>
          You recovered from a missed week (Wk 3) and stayed consistent for 5 weeks straight. That's the real sign of a lasting habit — not perfection, but recovery.
        </div>
      </div>
    </div>
  );
}

// ── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");

  function handleOnboardingDone(data) {
    setUser(data);
    setScreen("app");
  }

  const tabs = [
    { id: "home", label: "Home" },
    { id: "coach", label: "Coach" },
    { id: "progress", label: "Progress" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: BG, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder, textarea::placeholder { color: #444; }
        input:focus, textarea:focus { border-color: #333 !important; }
      `}</style>

      {screen === "onboarding" && <Onboarding onDone={handleOnboardingDone} />}

      {screen === "app" && (
        <>
          <div style={{ paddingBottom: 80 }}>
            {tab === "home" && <Home user={user} />}
            {tab === "coach" && <Coach user={user} />}
            {tab === "progress" && <Progress />}
          </div>

          {/* Tab bar */}
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: "#0d0d0d", borderTop: "1px solid #1c1c1c",
            display: "flex", padding: "10px 16px 20px", gap: 8,
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "10px 4px", borderRadius: 12, border: "none", cursor: "pointer",
                background: tab === t.id ? ACCENT : "transparent",
                color: tab === t.id ? BG : MUTED,
                fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
              }}>{t.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
