"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare, ArrowLeft, Sparkles, RefreshCw, ChevronRight,
  Mic, MicOff, BarChart3, CheckCircle2, AlertTriangle, Star, Lightbulb,
  Volume2, Target, Award, StopCircle, Play, Trash2, Waveform, Radio
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Describe a challenging project you worked on and how you handled it.",
  "Why do you want to work at our company?",
  "Tell me about a time you disagreed with a team member and how you resolved it.",
  "Walk me through a system you designed from scratch.",
  "What is your greatest technical weakness and how are you improving it?",
  "How do you handle multiple high-priority tasks with tight deadlines?",
  "Describe a time you took initiative and went beyond your defined scope.",
  "Tell me about your most impactful project.",
  "How do you stay updated with the latest technologies?",
];

const ScoreBar = ({ label, score, color = "#8b5cf6" }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-black" style={{ color }}>{score}/100</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
    </div>
  </div>
);

// Animated sound wave bars for recording indicator
const SoundWave = ({ active }) => (
  <div className="flex items-center gap-0.5 h-6">
    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
      <div
        key={i}
        className={`w-1 rounded-full transition-all ${active ? "bg-rose-400" : "bg-slate-600"}`}
        style={{
          height: active ? `${Math.random() * 16 + 4}px` : `${h * 2 + 2}px`,
          animation: active ? `wave ${0.5 + i * 0.1}s ease-in-out infinite alternate` : "none",
        }}
      />
    ))}
    <style jsx>{`
      @keyframes wave {
        from { height: 4px; }
        to { height: 22px; }
      }
    `}</style>
  </div>
);

export default function CommunicationTrainerPage() {
  const [question, setQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [context, setContext] = useState("Technical interview for a software engineering role");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showImproved, setShowImproved] = useState(false);

  // Voice states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
    }
    return () => stopRecording();
  }, []);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      const tick = () => {
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(100, avg * 2));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } catch (e) {
      // mic access not needed for SpeechRecognition — silently skip viz
    }
  };

  const stopAudioVisualization = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setAudioLevel(0);
  };

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (!question.trim()) {
      toast.error("Please select or enter an interview question first");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    let finalText = transcript;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsPaused(false);
      setInterimText("");
      toast.success("🎙️ Recording started — speak your answer!");
      startAudioVisualization();
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = finalText;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += (final ? " " : "") + t;
        } else {
          interim += t;
        }
      }
      finalText = final;
      setTranscript(final);
      setInterimText(interim);
      setUserResponse(final + (interim ? " " + interim : ""));
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") return;
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone in browser settings.");
      } else {
        toast.error(`Voice error: ${event.error}`);
      }
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording && !isPaused) {
        // Auto-restart for continuous recording
        try { recognition.start(); } catch (_) {}
      }
    };

    recognition.start();
  }, [question, transcript, isRecording, isPaused]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearInterval(timerRef.current);
    stopAudioVisualization();
    setIsRecording(false);
    setIsPaused(false);
    setInterimText("");
    if (transcript) {
      setUserResponse(transcript);
      toast.success("Recording saved! Review and click Evaluate.");
    }
  }, [transcript]);

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      setIsPaused(true);
      setIsRecording(false);
      clearInterval(timerRef.current);
      stopAudioVisualization();
      toast("⏸️ Recording paused. Click resume to continue.");
    }
  };

  const resumeRecording = () => {
    startRecording();
  };

  const clearRecording = () => {
    stopRecording();
    setTranscript("");
    setInterimText("");
    setUserResponse("");
    setRecordingTime(0);
    toast("Recording cleared.");
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const evaluate = async () => {
    if (!question.trim()) { toast.error("Please enter or select an interview question"); return; }
    if (!userResponse.trim()) { toast.error("Please record or type your response to evaluate"); return; }
    if (isRecording) stopRecording();
    setLoading(true);
    setResult(null);
    setShowImproved(false);
    try {
      const res = await fetch("/api/communication/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userResponse, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success("Communication analysis complete!");
    } catch (e) {
      toast.error(e.message || "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const overallColor = result
    ? result.overallScore >= 80 ? "#22d3ee" : result.overallScore >= 60 ? "#a78bfa" : "#f59e0b"
    : "#8b5cf6";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="ambient-glow bg-rose-500/15 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-glow bg-orange-500/10 w-[350px] h-[350px] top-1/3 -right-20" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-rose-500/30 transition-all text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Communication Trainer</h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1">
              <Mic className="w-3 h-3" /> Voice Enabled
            </span>
          </div>
          <p className="text-sm text-slate-400">Speak or type your answer — AI evaluates STAR structure, clarity & impact</p>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-400" /> Quick Question Picker
        </h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestion(q)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium text-left ${
                question === q
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-rose-500/20 hover:text-slate-200"
              }`}
            >
              {q.length > 48 ? q.substring(0, 48) + "…" : q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Question Input */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300 block mb-2">Interview Question</label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Enter or pick an interview question..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/40 resize-none transition-all"
              />
            </div>

            {/* Voice Recorder Panel */}
            <div className={`rounded-2xl border transition-all duration-300 p-4 space-y-3 ${
              isRecording ? "border-rose-500/50 bg-rose-500/5" :
              isPaused ? "border-amber-500/30 bg-amber-500/5" :
              transcript ? "border-emerald-500/20 bg-emerald-500/5" :
              "border-white/10 bg-white/3"
            }`}>
              {/* Recorder Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-rose-500 animate-pulse" : isPaused ? "bg-amber-400" : "bg-slate-600"}`} />
                  <span className="text-xs font-bold text-slate-300">
                    {isRecording ? "RECORDING" : isPaused ? "PAUSED" : transcript ? "RECORDED" : "VOICE RECORDER"}
                  </span>
                  {(isRecording || isPaused) && recordingTime > 0 && (
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg">
                      {formatTime(recordingTime)}
                    </span>
                  )}
                </div>
                {/* Audio Level Bar */}
                {isRecording && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full transition-all duration-75"
                        style={{
                          height: `${Math.random() * (audioLevel / 5) + 4}px`,
                          background: i < audioLevel / 10 ? "#f43f5e" : "rgba(255,255,255,0.1)",
                          minHeight: "4px",
                          maxHeight: "20px",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Interim transcript display while recording */}
              {isRecording && interimText && (
                <div className="text-xs text-slate-400 italic bg-white/5 rounded-xl p-2 border border-white/5 min-h-[28px]">
                  <span className="text-slate-500">Hearing: </span>
                  <span className="text-slate-300">{interimText}</span>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-2">
                {!isRecording && !isPaused ? (
                  <button
                    onClick={startRecording}
                    disabled={!voiceSupported}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-500/25 hover:scale-105 active:scale-95"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {transcript ? "Re-record" : "Start Recording"}
                  </button>
                ) : isRecording ? (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95"
                    >
                      ⏸ Pause
                    </button>
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <StopCircle className="w-3.5 h-3.5" /> Stop & Save
                    </button>
                  </>
                ) : isPaused ? (
                  <>
                    <button
                      onClick={resumeRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume
                    </button>
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <StopCircle className="w-3.5 h-3.5" /> Stop & Save
                    </button>
                  </>
                ) : null}

                {(transcript || userResponse) && !isRecording && (
                  <button
                    onClick={clearRecording}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/20 font-bold text-xs transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Recorded transcript preview */}
              {transcript && !isRecording && (
                <div className="text-xs text-slate-300 bg-white/5 rounded-xl p-3 border border-emerald-500/10 leading-relaxed max-h-20 overflow-y-auto">
                  <span className="text-emerald-400 font-bold block mb-1">✓ Recorded transcript:</span>
                  {transcript}
                </div>
              )}

              {!voiceSupported && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Voice not supported in this browser. Use Chrome or Edge for voice input.
                </p>
              )}
            </div>

            {/* Manual Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-300">
                  Your Response <span className="text-slate-500 font-normal text-xs">(edit transcript or type manually)</span>
                </label>
                <span className="text-xs text-slate-500">{userResponse.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                value={userResponse}
                onChange={e => setUserResponse(e.target.value)}
                placeholder="Speak using the recorder above, or type your answer here..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/40 resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4 h-fit">
          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2">Interview Context</label>
            <input
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500/40 transition-all"
            />
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Voice transcription (real-time)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Clarity &amp; conciseness scoring</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> STAR method analysis</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Technical depth scoring</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> AI-improved response rewrite</div>
          </div>

          {/* Quick steps guide */}
          <div className="p-3 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">How to use</p>
            {[
              "Pick or type a question",
              "Click 🎙️ Start Recording",
              "Speak your answer naturally",
              "Stop → review transcript",
              "Click Evaluate My Answer",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 font-black text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>

          <button
            onClick={evaluate}
            disabled={loading || !question.trim() || !userResponse.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Evaluating...</> : <><Sparkles className="w-4 h-4" /> Evaluate My Answer</>}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overall Score */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={overallColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2.51 * result.overallScore} ${251.2}`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color: overallColor }}>{result.overallScore}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Score</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {result.scores && Object.entries(result.scores).map(([key, val]) => (
                <ScoreBar key={key} label={key.replace(/([A-Z])/g, " $1").trim()} score={val.score} color={overallColor} />
              ))}
            </div>
          </div>

          {/* Detailed Score Feedback */}
          {result.scores && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rose-400" /> Detailed Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.scores).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-black text-lg" style={{ color: overallColor }}>{val.score}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAR Alignment */}
          {result.starAlignment && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" /> STAR Method Analysis
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["situation", "task", "action", "result"].map(key => {
                  const data = result.starAlignment[key];
                  const present = data?.present;
                  return (
                    <div key={key} className={`p-4 rounded-2xl border ${present ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {present ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                        <span className="font-black text-white uppercase text-xs tracking-widest">{key}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${present ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {data?.quality || "—"}
                      </span>
                      {data?.note && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{data.note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Improvements & Tip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {result.improvements?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Key Improvements
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.tipOfDay && (
              <div className="glass-panel rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Interview Tip
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.tipOfDay}</p>
              </div>
            )}
          </div>

          {/* Improved Response */}
          {result.improvedResponse && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" /> AI-Improved Response
                </h3>
                <button
                  onClick={() => setShowImproved(v => !v)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all font-semibold"
                >
                  {showImproved ? "Hide" : "Reveal"}
                </button>
              </div>
              {showImproved && (
                <div className="p-4 rounded-2xl bg-white/5 border border-cyan-500/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300">
                  {result.improvedResponse}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
