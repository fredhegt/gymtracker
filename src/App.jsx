import { useState, useEffect, useCallback } from "react";

// ─── WORKOUT DATA ────────────────────────────────────────────────────────────

const MUSCLE_GROUPS = {
  chest: "Chest",
  triceps: "Triceps",
  biceps: "Biceps",
  shoulders: "Shoulders",
  upperBack: "Upper Back",
  lats: "Lats",
  core: "Core",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  adductors: "Adductors",
  rotatorCuff: "Rotator Cuff",
  rhomboids: "Rhomboids",
  traps: "Traps",
};

const EXERCISE_LIBRARY = [
  // CHEST
  { id: "incline-db-press", name: "Incline Dumbbell Press", muscles: ["chest", "shoulders", "triceps"], sets: 3, reps: "10–12", rest: 90, notes: "Keep elbows at 45°. Avoid flaring to protect shoulder." },
  { id: "cable-chest-fly", name: "Cable Chest Fly", muscles: ["chest"], sets: 3, reps: "12–15", rest: 60, notes: "Low-to-high angle helps upper chest. Light weight, full stretch." },
  { id: "machine-chest-press", name: "Machine Chest Press", muscles: ["chest", "triceps"], sets: 3, reps: "10–12", rest: 90, notes: "Good shoulder-safe option. Control the eccentric." },
  { id: "push-up", name: "Push-Up", muscles: ["chest", "triceps", "shoulders"], sets: 3, reps: "12–15", rest: 60, notes: "Elevate hands if shoulder is uncomfortable." },
  { id: "db-flat-press", name: "Dumbbell Flat Press", muscles: ["chest", "triceps", "shoulders"], sets: 3, reps: "10–12", rest: 90, notes: "Neutral grip can reduce shoulder stress." },
  { id: "pec-deck", name: "Pec Deck Machine", muscles: ["chest"], sets: 3, reps: "12–15", rest: 60, notes: "Keep elbows slightly bent. Don't let shoulders roll forward." },

  // BACK
  { id: "seated-cable-row", name: "Seated Cable Row", muscles: ["lats", "rhomboids", "upperBack"], sets: 3, reps: "10–12", rest: 90, notes: "Squeeze shoulder blades together. Key for shoulder posture." },
  { id: "lat-pulldown", name: "Lat Pulldown", muscles: ["lats", "upperBack"], sets: 3, reps: "10–12", rest: 90, notes: "Lean slightly back, pull to upper chest. Don't shrug." },
  { id: "db-row", name: "Single Arm DB Row", muscles: ["lats", "rhomboids"], sets: 3, reps: "10–12", rest: 60, notes: "Brace core. Drive elbow back, not up." },
  { id: "face-pull", name: "Face Pull", muscles: ["rotatorCuff", "rhomboids", "traps"], sets: 3, reps: "15–20", rest: 60, notes: "Cable at head height. External rotate at end. Critical for shoulder health." },
  { id: "band-pull-apart", name: "Band Pull-Apart", muscles: ["rhomboids", "traps", "rotatorCuff"], sets: 3, reps: "15–20", rest: 45, notes: "Keep arms straight. Squeeze shoulder blades. Great warm-up/prehab." },
  { id: "seated-row-wide", name: "Wide-Grip Seated Row", muscles: ["upperBack", "rhomboids", "traps"], sets: 3, reps: "12–15", rest: 60, notes: "Focus on upper back squeeze." },
  { id: "shrugs", name: "Dumbbell Shrugs", muscles: ["traps"], sets: 3, reps: "12–15", rest: 60, notes: "Hold at top 1 sec. Avoid rolling the shoulder." },

  // SHOULDERS
  { id: "ext-rotation-cable", name: "Cable External Rotation", muscles: ["rotatorCuff"], sets: 3, reps: "15–20", rest: 45, notes: "Elbow at 90°, pinned to side. Light weight. Slow and controlled." },
  { id: "int-rotation-cable", name: "Cable Internal Rotation", muscles: ["rotatorCuff"], sets: 3, reps: "15–20", rest: 45, notes: "Follow external rotation. Balance is key for shoulder health." },
  { id: "lateral-raise", name: "Lateral Raise", muscles: ["shoulders"], sets: 3, reps: "12–15", rest: 60, notes: "Slight forward lean. Lead with elbows. Keep right side lighter initially." },
  { id: "rear-delt-fly", name: "Rear Delt Cable Fly", muscles: ["rotatorCuff", "rhomboids", "shoulders"], sets: 3, reps: "15–20", rest: 60, notes: "Key for correcting forward shoulder posture." },
  { id: "wall-angels", name: "Wall Angels / Shoulder CARs", muscles: ["rotatorCuff", "traps", "rhomboids"], sets: 3, reps: "10", rest: 45, notes: "Back flat against wall. Slow and deliberate. Great shoulder mobiliser." },

  // ARMS
  { id: "ez-bar-curl", name: "EZ Bar Curl", muscles: ["biceps"], sets: 3, reps: "10–12", rest: 60, notes: "Elbows stable. Full range of motion." },
  { id: "hammer-curl", name: "Hammer Curl", muscles: ["biceps"], sets: 3, reps: "10–12", rest: 60, notes: "Neutral grip. Works brachialis for arm thickness." },
  { id: "cable-curl", name: "Cable Bicep Curl", muscles: ["biceps"], sets: 3, reps: "12–15", rest: 60, notes: "Constant tension throughout. Supinate at top." },
  { id: "tricep-pushdown", name: "Tricep Pushdown (Cable)", muscles: ["triceps"], sets: 3, reps: "12–15", rest: 60, notes: "Elbows pinned to sides. Full extension." },
  { id: "overhead-tricep", name: "Overhead Tricep Extension (Cable)", muscles: ["triceps"], sets: 3, reps: "12–15", rest: 60, notes: "Long head emphasis. Keep elbows close." },
  { id: "skull-crusher", name: "Skull Crusher (EZ Bar)", muscles: ["triceps"], sets: 3, reps: "10–12", rest: 60, notes: "Lower to forehead. Keep elbows vertical." },

  // CORE
  { id: "plank", name: "Plank", muscles: ["core"], sets: 3, reps: "40–60s", rest: 45, notes: "Brace hard. Posterior pelvic tilt. Great for lower back." },
  { id: "dead-bug", name: "Dead Bug", muscles: ["core"], sets: 3, reps: "8–10 each", rest: 45, notes: "Opposite arm/leg. Keep lower back pressed to floor." },
  { id: "cable-woodchop", name: "Cable Wood Chop", muscles: ["core"], sets: 3, reps: "12 each", rest: 60, notes: "Rotational core. Avoid twisting right shoulder aggressively." },
  { id: "hanging-knee-raise", name: "Hanging Knee Raise", muscles: ["core"], sets: 3, reps: "12–15", rest: 60, notes: "Control the swing. Posterior tilt at top." },
  { id: "ab-wheel", name: "Ab Wheel Rollout", muscles: ["core"], sets: 3, reps: "8–12", rest: 60, notes: "Keep hips from sagging. Start with partial range." },
  { id: "russian-twist", name: "Russian Twist (Light Weight)", muscles: ["core"], sets: 3, reps: "12 each", rest: 45, notes: "Lean back 45°. Slow rotation. Watch right shoulder load." },
  { id: "lunge-twist", name: "Lunge with Rotation (Med Ball)", muscles: ["core", "quads", "glutes"], sets: 3, reps: "10 each", rest: 60, notes: "ACL rehab staple. Rotate away from front foot. Good balance and hip control." },

  // ACL REHAB / LEGS
  { id: "leg-extension", name: "Leg Extension (Machine)", muscles: ["quads"], sets: 3, reps: "12–15", rest: 60, notes: "ACL rehab. Start light on right leg. Terminal extension focus." },
  { id: "hamstring-curl", name: "Lying Hamstring Curl", muscles: ["hamstrings"], sets: 3, reps: "12–15", rest: 60, notes: "Critical post-ACL. Slow eccentric (3 sec down)." },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscles: ["quads", "glutes", "hamstrings"], sets: 3, reps: "8–10 each", rest: 90, notes: "Progress weight as right leg improves. Keep torso upright." },
  { id: "calf-raise", name: "Calf Raise (Machine or Step)", muscles: ["calves"], sets: 3, reps: "15–20", rest: 45, notes: "Include single-leg right side. Full range, slow eccentric." },
  { id: "adductor-machine", name: "Adductor Machine", muscles: ["adductors"], sets: 3, reps: "15–20", rest: 45, notes: "Key ACL rehab. Slow and controlled, don't go too heavy." },
  { id: "lateral-band-walk", name: "Lateral Band Walk", muscles: ["glutes", "adductors"], sets: 3, reps: "15 each", rest: 45, notes: "Agility/neuromuscular. Keep tension throughout." },
  { id: "single-leg-balance", name: "Single-Leg Balance / Reach", muscles: ["quads", "glutes"], sets: 3, reps: "30s each", rest: 45, notes: "Proprioception. Add eyes closed or wobble board as confidence grows." },
  { id: "mini-band-clam", name: "Mini-Band Clamshell", muscles: ["glutes", "adductors"], sets: 3, reps: "15–20 each", rest: 45, notes: "Hip abductor activation. Key for knee alignment post-ACL." },
  { id: "step-up", name: "Step-Up (Box or Bench)", muscles: ["quads", "glutes"], sets: 3, reps: "10–12 each", rest: 60, notes: "Great ACL rehab move. Keep knee tracking over toe." },
  { id: "rdl", name: "Romanian Deadlift (DB or Bar)", muscles: ["hamstrings", "glutes"], sets: 3, reps: "10–12", rest: 90, notes: "Hip hinge, soft knee. Feel the hamstring stretch." },
];

const SWAP_SUGGESTIONS = {
  chest: ["incline-db-press", "cable-chest-fly", "machine-chest-press", "push-up", "db-flat-press", "pec-deck"],
  triceps: ["tricep-pushdown", "overhead-tricep", "skull-crusher"],
  biceps: ["ez-bar-curl", "hammer-curl", "cable-curl"],
  shoulders: ["lateral-raise", "rear-delt-fly", "wall-angels"],
  upperBack: ["seated-cable-row", "lat-pulldown", "seated-row-wide"],
  lats: ["lat-pulldown", "db-row", "seated-cable-row"],
  rhomboids: ["face-pull", "band-pull-apart", "seated-cable-row", "rear-delt-fly"],
  traps: ["face-pull", "shrugs", "band-pull-apart"],
  rotatorCuff: ["face-pull", "ext-rotation-cable", "int-rotation-cable", "rear-delt-fly", "wall-angels"],
  core: ["plank", "dead-bug", "cable-woodchop", "hanging-knee-raise", "ab-wheel", "russian-twist"],
  quads: ["leg-extension", "bulgarian-split-squat", "step-up"],
  hamstrings: ["hamstring-curl", "rdl"],
  glutes: ["bulgarian-split-squat", "step-up", "rdl", "mini-band-clam"],
  calves: ["calf-raise"],
  adductors: ["adductor-machine", "mini-band-clam", "lateral-band-walk"],
};

const DEFAULT_SESSIONS = [
  {
    id: "A",
    name: "Session A — Upper Push + Shoulder Health",
    tag: "Upper Body",
    color: "#e8f4fd",
    accent: "#2196F3",
    description: "Chest & arms focus with shoulder rehab built in. Avoid heavy overhead pressing.",
    exercises: [
      "wall-angels",
      "band-pull-apart",
      "ext-rotation-cable",
      "incline-db-press",
      "cable-chest-fly",
      "lateral-raise",
      "tricep-pushdown",
      "overhead-tricep",
      "plank",
      "dead-bug",
    ],
  },
  {
    id: "B",
    name: "Session B — ACL Rehab + Lower Body",
    tag: "Legs & Rehab",
    color: "#f0fdf4",
    accent: "#22c55e",
    description: "Full ACL/meniscus rehab session. Mix of strength and neuromuscular work.",
    exercises: [
      "single-leg-balance",
      "lateral-band-walk",
      "leg-extension",
      "hamstring-curl",
      "bulgarian-split-squat",
      "adductor-machine",
      "step-up",
      "calf-raise",
      "lunge-twist",
      "mini-band-clam",
    ],
  },
  {
    id: "C",
    name: "Session C — Upper Pull + Posture",
    tag: "Upper Body",
    color: "#fef3c7",
    accent: "#f59e0b",
    description: "Back, biceps & posture correction. Critical for fixing forward shoulder.",
    exercises: [
      "face-pull",
      "int-rotation-cable",
      "lat-pulldown",
      "seated-cable-row",
      "db-row",
      "rear-delt-fly",
      "ez-bar-curl",
      "hammer-curl",
      "hanging-knee-raise",
      "cable-woodchop",
    ],
  },
  {
    id: "D",
    name: "Session D — Full Body + Core",
    tag: "Full Body",
    color: "#fdf2f8",
    accent: "#a855f7",
    description: "Lighter session mixing everything. Good for a 4th day or active recovery.",
    exercises: [
      "wall-angels",
      "face-pull",
      "machine-chest-press",
      "seated-row-wide",
      "rdl",
      "step-up",
      "cable-curl",
      "tricep-pushdown",
      "ab-wheel",
      "russian-twist",
    ],
  },
];

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  sessions: "wt_sessions",
  logs: "wt_logs",
  lastSession: "wt_lastSession",
};

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const ExerciseCard = ({ exId, sessionId, onSwap, onRemove, logData, onLogSet }) => {
  const ex = EXERCISE_LIBRARY.find((e) => e.id === exId);
  if (!ex) return null;

  const [expanded, setExpanded] = useState(false);
  const completedSets = logData?.[exId] || 0;

  return (
    <div className="ex-card" style={{ "--accent": ex.muscles[0] === "quads" || ex.muscles[0] === "hamstrings" ? "#22c55e" : "#2196F3" }}>
      <div className="ex-header" onClick={() => setExpanded(!expanded)}>
        <div className="ex-left">
          <div className="ex-name">{ex.name}</div>
          <div className="ex-meta">
            {ex.sets} sets · {ex.reps} reps · {ex.rest}s rest
          </div>
          <div className="ex-muscles">
            {ex.muscles.map((m) => (
              <span key={m} className="muscle-tag">{MUSCLE_GROUPS[m]}</span>
            ))}
          </div>
        </div>
        <div className="ex-right">
          <div className="set-tracker">
            {Array.from({ length: ex.sets }).map((_, i) => (
              <button
                key={i}
                className={`set-dot ${i < completedSets ? "done" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLogSet(exId, i < completedSets ? Math.max(0, completedSets - 1) : i + 1);
                }}
              >
                {i < completedSets ? "✓" : i + 1}
              </button>
            ))}
          </div>
          <span className="chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="ex-expanded">
          <p className="ex-notes">💡 {ex.notes}</p>
          <div className="ex-actions">
            <button className="btn-swap" onClick={() => onSwap(exId, ex.muscles)}>
              ⇄ Swap Exercise
            </button>
            <button className="btn-remove" onClick={() => onRemove(sessionId, exId)}>
              ✕ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SwapModal = ({ exerciseId, muscles, sessions, setSessions, onClose }) => {
  const allTargets = [...new Set(muscles.flatMap((m) => SWAP_SUGGESTIONS[m] || []))].filter(
    (id) => id !== exerciseId
  );

  const suggestions = allTargets.slice(0, 8).map((id) => EXERCISE_LIBRARY.find((e) => e.id === id)).filter(Boolean);

  const doSwap = (sessionId, newId) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, exercises: s.exercises.map((e) => (e === exerciseId ? newId : e)) }
          : s
      )
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Swap Exercise</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-sub">Alternatives targeting the same muscles:</p>
        <div className="swap-list">
          {suggestions.length === 0 && <p style={{ color: "#888", padding: "1rem" }}>No alternatives found.</p>}
          {suggestions.map((s) => (
            <div key={s.id} className="swap-item">
              <div>
                <div className="swap-name">{s.name}</div>
                <div className="swap-meta">{s.sets} sets · {s.reps} reps · {s.muscles.map((m) => MUSCLE_GROUPS[m]).join(", ")}</div>
              </div>
              <div className="swap-btns">
                {sessions.map((sess) => (
                  <button key={sess.id} className="btn-swap-do" onClick={() => doSwap(sess.id, s.id)}>
                    → {sess.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "1rem", borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>
            You can also add any exercise from the full library in Edit Session.
          </p>
        </div>
      </div>
    </div>
  );
};

const AddExerciseModal = ({ sessionId, sessions, setSessions, onClose }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const session = sessions.find((s) => s.id === sessionId);
  const existing = session?.exercises || [];

  const filtered = EXERCISE_LIBRARY.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || ex.muscles.includes(filter);
    return matchSearch && matchFilter;
  });

  const addEx = (id) => {
    if (existing.includes(id)) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, exercises: [...s.exercises, id] } : s))
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Exercise</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="add-controls">
          <input
            className="search-input"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All muscles</option>
            {Object.entries(MUSCLE_GROUPS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="add-list">
          {filtered.map((ex) => {
            const added = existing.includes(ex.id);
            return (
              <div key={ex.id} className={`add-item ${added ? "added" : ""}`}>
                <div>
                  <div className="swap-name">{ex.name}</div>
                  <div className="swap-meta">{ex.sets} sets · {ex.reps} reps · {ex.muscles.map((m) => MUSCLE_GROUPS[m]).join(", ")}</div>
                </div>
                <button
                  className={added ? "btn-added" : "btn-add-do"}
                  onClick={() => addEx(ex.id)}
                  disabled={added}
                >
                  {added ? "Added" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SessionView = ({ session, sessions, setSessions, onBack }) => {
  const [swapping, setSwapping] = useState(null); // {exId, muscles}
  const [adding, setAdding] = useState(false);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [logData, setLogData] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (workoutActive) {
      interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(interval);
  }, [workoutActive, startTime]);

  const startWorkout = () => {
    setWorkoutActive(true);
    setStartTime(Date.now());
    setLogData({});
    setElapsed(0);
  };

  const finishWorkout = () => {
    const logs = loadData(STORAGE_KEYS.logs, []);
    logs.unshift({
      date: new Date().toISOString(),
      sessionId: session.id,
      sessionName: session.name,
      duration: elapsed,
      exercises: logData,
    });
    saveData(STORAGE_KEYS.logs, logs.slice(0, 100));
    saveData(STORAGE_KEYS.lastSession, session.id);
    setWorkoutActive(false);
    onBack();
  };

  const handleLogSet = (exId, count) => {
    setLogData((prev) => ({ ...prev, [exId]: count }));
  };

  const handleRemove = (sessId, exId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessId ? { ...s, exercises: s.exercises.filter((e) => e !== exId) } : s))
    );
  };

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="session-view">
      <div className="session-top" style={{ background: session.color, borderBottom: `3px solid ${session.accent}` }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="session-top-info">
          <div className="session-tag" style={{ background: session.accent }}>{session.tag}</div>
          <h2>{session.name}</h2>
          <p>{session.description}</p>
        </div>
        {workoutActive ? (
          <div className="workout-bar">
            <div className="timer">⏱ {fmtTime(elapsed)}</div>
            <button className="btn-finish" onClick={finishWorkout}>Finish Workout ✓</button>
          </div>
        ) : (
          <button className="btn-start" style={{ background: session.accent }} onClick={startWorkout}>
            ▶ Start Workout
          </button>
        )}
      </div>

      <div className="ex-list">
        {session.exercises.map((exId) => (
          <ExerciseCard
            key={exId}
            exId={exId}
            sessionId={session.id}
            onSwap={(id, muscles) => setSwapping({ exId: id, muscles })}
            onRemove={handleRemove}
            logData={workoutActive ? logData : null}
            onLogSet={handleLogSet}
          />
        ))}
        <button className="btn-add-ex" onClick={() => setAdding(true)}>
          + Add Exercise
        </button>
      </div>

      {swapping && (
        <SwapModal
          exerciseId={swapping.exId}
          muscles={swapping.muscles}
          sessions={sessions}
          setSessions={setSessions}
          onClose={() => setSwapping(null)}
        />
      )}
      {adding && (
        <AddExerciseModal
          sessionId={session.id}
          sessions={sessions}
          setSessions={setSessions}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
};

const HistoryView = () => {
  const logs = loadData(STORAGE_KEYS.logs, []);
  const fmtTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="history-view">
      <h2 className="section-title">Workout History</h2>
      {logs.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: "3rem" }}>📋</div>
          <p>No workouts logged yet.<br />Start a session to track your progress!</p>
        </div>
      )}
      {logs.map((log, i) => {
        const completedCount = Object.values(log.exercises || {}).filter((v) => v > 0).length;
        return (
          <div key={i} className="log-card">
            <div className="log-header">
              <div>
                <div className="log-session">{log.sessionName}</div>
                <div className="log-date">{new Date(log.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <div className="log-stats">
                <div className="log-stat">⏱ {fmtTime(log.duration)}</div>
                <div className="log-stat">💪 {completedCount} exercises</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PlanView = ({ sessions, setSessions }) => {
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");

  const addCustomSession = () => {
    if (!newSessionName.trim()) return;
    const newSession = {
      id: `custom-${Date.now()}`,
      name: newSessionName,
      tag: "Custom",
      color: "#f5f5f5",
      accent: "#666",
      description: "Custom session — add exercises as needed.",
      exercises: [],
    };
    setSessions((prev) => [...prev, newSession]);
    setNewSessionName("");
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="plan-view">
      <h2 className="section-title">Your Plan</h2>
      <div className="plan-note">
        <strong>How it works:</strong> Rotate through sessions in any order. Aim for 3–4/week but don't stress — just pick up where you left off. Each session is ~1 hour.
      </div>

      <div className="plan-grid">
        {sessions.map((s) => (
          <div key={s.id} className="plan-card" style={{ borderLeft: `4px solid ${s.accent}`, background: s.color }}>
            <div className="plan-card-top">
              <div className="session-tag" style={{ background: s.accent }}>{s.tag}</div>
              {s.id.startsWith("custom") && (
                <button className="btn-delete-sess" onClick={() => deleteSession(s.id)}>✕</button>
              )}
            </div>
            <div className="plan-card-name">{s.name}</div>
            <div className="plan-card-desc">{s.description}</div>
            <div className="plan-card-count">{s.exercises.length} exercises</div>
          </div>
        ))}
      </div>

      <div className="add-session-box">
        <h3>Create Custom Session</h3>
        <div className="add-sess-row">
          <input
            className="search-input"
            placeholder="Session name..."
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
          <button className="btn-add-do" onClick={addCustomSession}>Create</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [sessions, setSessions] = useState(() => loadData(STORAGE_KEYS.sessions, DEFAULT_SESSIONS));
  const [activeSession, setActiveSession] = useState(null);
  const [tab, setTab] = useState("home");

  useEffect(() => {
    saveData(STORAGE_KEYS.sessions, sessions);
  }, [sessions]);

  const lastSessionId = loadData(STORAGE_KEYS.lastSession, null);
  const lastSession = sessions.find((s) => s.id === lastSessionId);
  const nextSessionIndex = lastSession
    ? (sessions.findIndex((s) => s.id === lastSessionId) + 1) % sessions.length
    : 0;
  const nextSession = sessions[nextSessionIndex];

  if (activeSession) {
    return (
      <SessionView
        session={activeSession}
        sessions={sessions}
        setSessions={setSessions}
        onBack={() => setActiveSession(null)}
      />
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-logo">💪</div>
        <div>
          <div className="header-title">GymTracker</div>
          <div className="header-sub">Personal · Rehab-aware · Yours</div>
        </div>
      </div>

      <div className="tab-bar">
        {["home", "plan", "history"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "home" ? "🏠 Home" : t === "plan" ? "📋 Plan" : "📊 History"}
          </button>
        ))}
      </div>

      <div className="app-body">
        {tab === "home" && (
          <div className="home-view">
            {nextSession && (
              <div className="next-up">
                <div className="next-label">Next Up</div>
                <div className="next-name">{nextSession.name}</div>
                <div className="next-desc">{nextSession.description}</div>
                <button
                  className="btn-start-big"
                  style={{ background: nextSession.accent }}
                  onClick={() => setActiveSession(nextSession)}
                >
                  Start Session →
                </button>
              </div>
            )}

            <h3 className="section-title">All Sessions</h3>
            <div className="session-list">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="session-row"
                  style={{ borderLeft: `4px solid ${s.accent}` }}
                  onClick={() => setActiveSession(s)}
                >
                  <div>
                    <div className="session-row-name">{s.name}</div>
                    <div className="session-row-meta">{s.exercises.length} exercises · ~60 min</div>
                  </div>
                  <div className="session-tag-sm" style={{ background: s.accent }}>{s.tag}</div>
                </div>
              ))}
            </div>

            <div className="info-card">
              <h4>📍 Your Profile</h4>
              <div className="profile-grid">
                <div><span>Height</span><strong>6'0"</strong></div>
                <div><span>Weight</span><strong>85kg</strong></div>
                <div><span>Goal</span><strong>Lean + Build</strong></div>
                <div><span>Rehab</span><strong>ACL + Shoulder</strong></div>
              </div>
            </div>

            <div className="info-card warning">
              <h4>⚠️ Shoulder Note</h4>
              <p>Right shoulder sits forward — likely anterior tilt from old rotator cuff issue. Sessions include face pulls, external rotation, band pull-aparts and rear delt work to correct this. Avoid heavy overhead pressing for now. If pain increases, rest and see your physio.</p>
            </div>

            <div className="info-card green">
              <h4>🦵 ACL Rehab Note</h4>
              <p>3.5 months post-op — progressing well. Session B targets full rehab. Prioritise form over load. Hamstring curls and single-leg work are key. Cycling to work counts as low-impact cardio — keep it up for fat loss too.</p>
            </div>
          </div>
        )}

        {tab === "plan" && (
          <PlanView sessions={sessions} setSessions={setSessions} />
        )}

        {tab === "history" && <HistoryView />}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f8f9fa; color: #1a1a2e; }

        .app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; position: relative; padding-bottom: 2rem; }

        .app-header { background: #1a1a2e; color: white; padding: 1.2rem 1.2rem 1rem; display: flex; align-items: center; gap: 0.8rem; }
        .header-logo { font-size: 2rem; }
        .header-title { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.5px; }
        .header-sub { font-size: 0.75rem; color: #8899bb; }

        .tab-bar { display: flex; background: #f0f2f5; border-bottom: 1px solid #e0e0e0; }
        .tab { flex: 1; padding: 0.75rem; border: none; background: none; font-size: 0.85rem; cursor: pointer; color: #666; font-weight: 500; transition: all 0.2s; }
        .tab.active { color: #1a1a2e; border-bottom: 2px solid #1a1a2e; background: white; font-weight: 700; }

        .app-body { padding: 1rem; }

        /* HOME */
        .next-up { background: #1a1a2e; color: white; border-radius: 16px; padding: 1.4rem; margin-bottom: 1.5rem; }
        .next-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #8899bb; margin-bottom: 0.3rem; }
        .next-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
        .next-desc { font-size: 0.82rem; color: #aab; margin-bottom: 1rem; line-height: 1.4; }
        .btn-start-big { width: 100%; padding: 0.9rem; border: none; border-radius: 10px; color: white; font-size: 1rem; font-weight: 700; cursor: pointer; letter-spacing: 0.3px; }
        .btn-start-big:hover { opacity: 0.9; }

        .section-title { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .session-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
        .session-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8f9fa; border-radius: 12px; cursor: pointer; transition: background 0.2s; }
        .session-row:hover { background: #f0f2f5; }
        .session-row-name { font-size: 0.92rem; font-weight: 600; margin-bottom: 0.2rem; }
        .session-row-meta { font-size: 0.75rem; color: #888; }
        .session-tag-sm { font-size: 0.65rem; padding: 0.25rem 0.6rem; border-radius: 20px; color: white; font-weight: 600; white-space: nowrap; }

        .info-card { background: #f8f9fa; border-radius: 12px; padding: 1rem; margin-bottom: 0.8rem; }
        .info-card h4 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.6rem; }
        .info-card p { font-size: 0.82rem; color: #555; line-height: 1.5; }
        .info-card.warning { background: #fff8e1; border-left: 3px solid #f59e0b; }
        .info-card.green { background: #f0fdf4; border-left: 3px solid #22c55e; }
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .profile-grid div { display: flex; flex-direction: column; }
        .profile-grid span { font-size: 0.7rem; color: #888; }
        .profile-grid strong { font-size: 0.9rem; }

        /* SESSION VIEW */
        .session-view { max-width: 480px; margin: 0 auto; background: white; min-height: 100vh; }
        .session-top { padding: 1rem; }
        .back-btn { background: none; border: none; font-size: 0.9rem; color: #555; cursor: pointer; padding: 0.3rem 0; margin-bottom: 0.8rem; font-weight: 600; }
        .session-top h2 { font-size: 1.1rem; font-weight: 700; margin: 0.4rem 0; }
        .session-top p { font-size: 0.82rem; color: #555; line-height: 1.4; }
        .session-tag { display: inline-block; font-size: 0.7rem; padding: 0.25rem 0.7rem; border-radius: 20px; color: white; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-start { width: 100%; margin-top: 1rem; padding: 0.85rem; border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 0.95rem; cursor: pointer; }
        .workout-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 0.8rem; gap: 0.8rem; }
        .timer { font-size: 1.3rem; font-weight: 700; font-variant-numeric: tabular-nums; color: #1a1a2e; }
        .btn-finish { flex: 1; padding: 0.75rem; background: #22c55e; border: none; border-radius: 10px; color: white; font-weight: 700; cursor: pointer; }

        .ex-list { padding: 0.8rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .ex-card { background: #f8f9fa; border-radius: 12px; overflow: hidden; border: 1px solid #eee; }
        .ex-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.9rem; cursor: pointer; gap: 0.5rem; }
        .ex-left { flex: 1; }
        .ex-name { font-size: 0.92rem; font-weight: 700; margin-bottom: 0.2rem; }
        .ex-meta { font-size: 0.75rem; color: #666; margin-bottom: 0.4rem; }
        .ex-muscles { display: flex; flex-wrap: wrap; gap: 0.25rem; }
        .muscle-tag { font-size: 0.65rem; background: #e0e7ff; color: #3730a3; padding: 0.15rem 0.5rem; border-radius: 10px; font-weight: 600; }
        .ex-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
        .set-tracker { display: flex; gap: 0.3rem; }
        .set-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ccc; background: white; font-size: 0.7rem; cursor: pointer; font-weight: 700; color: #999; transition: all 0.2s; }
        .set-dot.done { background: #22c55e; border-color: #22c55e; color: white; }
        .chevron { font-size: 0.65rem; color: #999; }
        .ex-expanded { padding: 0 0.9rem 0.9rem; border-top: 1px solid #eee; }
        .ex-notes { font-size: 0.8rem; color: #555; line-height: 1.5; padding: 0.6rem 0; }
        .ex-actions { display: flex; gap: 0.5rem; }
        .btn-swap { flex: 1; padding: 0.5rem; background: #e8f4fd; color: #2196F3; border: 1px solid #2196F3; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .btn-remove { padding: 0.5rem 0.75rem; background: #fff0f0; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .btn-add-ex { width: 100%; padding: 0.85rem; background: white; border: 2px dashed #ccc; border-radius: 12px; color: #666; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        .btn-add-ex:hover { border-color: #888; color: #333; }

        /* MODALS */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: flex-end; justify-content: center; }
        .modal { background: white; border-radius: 20px 20px 0 0; width: 100%; max-width: 480px; max-height: 80vh; overflow-y: auto; }
        .modal-wide { max-height: 85vh; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1rem 0.8rem; border-bottom: 1px solid #eee; }
        .modal-header h3 { font-size: 1rem; font-weight: 700; }
        .modal-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #666; }
        .modal-sub { font-size: 0.8rem; color: #888; padding: 0.5rem 1rem; }
        .swap-list, .add-list { padding: 0 1rem; }
        .swap-item, .add-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; gap: 0.5rem; }
        .add-item.added { opacity: 0.5; }
        .swap-name { font-size: 0.88rem; font-weight: 600; margin-bottom: 0.2rem; }
        .swap-meta { font-size: 0.73rem; color: #888; }
        .swap-btns { display: flex; gap: 0.3rem; flex-shrink: 0; }
        .btn-swap-do { padding: 0.4rem 0.6rem; background: #e8f4fd; color: #2196F3; border: 1px solid #2196F3; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
        .btn-add-do { padding: 0.4rem 0.8rem; background: #1a1a2e; color: white; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; flex-shrink: 0; }
        .btn-added { padding: 0.4rem 0.8rem; background: #e0e7ff; color: #666; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
        .add-controls { display: flex; gap: 0.5rem; padding: 0.8rem 1rem; }
        .search-input { flex: 1; padding: 0.6rem 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.85rem; outline: none; }
        .search-input:focus { border-color: #1a1a2e; }
        .filter-select { padding: 0.6rem 0.5rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.8rem; outline: none; background: white; }

        /* PLAN */
        .plan-view { padding-bottom: 1rem; }
        .plan-note { background: #f0f4ff; border-left: 3px solid #4f46e5; border-radius: 8px; padding: 0.8rem; font-size: 0.82rem; color: #333; line-height: 1.5; margin-bottom: 1.2rem; }
        .plan-grid { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
        .plan-card { padding: 1rem; border-radius: 12px; }
        .plan-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .plan-card-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem; }
        .plan-card-desc { font-size: 0.8rem; color: #555; margin-bottom: 0.4rem; line-height: 1.4; }
        .plan-card-count { font-size: 0.75rem; color: #888; font-weight: 600; }
        .btn-delete-sess { background: none; border: none; color: #ef4444; font-size: 0.9rem; cursor: pointer; }
        .add-session-box { background: #f8f9fa; border-radius: 12px; padding: 1rem; }
        .add-session-box h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.8rem; }
        .add-sess-row { display: flex; gap: 0.5rem; }

        /* HISTORY */
        .history-view { }
        .empty-state { text-align: center; padding: 3rem 1rem; color: #888; }
        .empty-state p { font-size: 0.9rem; line-height: 1.6; margin-top: 0.8rem; }
        .log-card { background: #f8f9fa; border-radius: 12px; padding: 1rem; margin-bottom: 0.7rem; }
        .log-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .log-session { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.2rem; }
        .log-date { font-size: 0.75rem; color: #888; }
        .log-stats { text-align: right; }
        .log-stat { font-size: 0.78rem; color: #555; font-weight: 600; }
      `}</style>
    </div>
  );
}
