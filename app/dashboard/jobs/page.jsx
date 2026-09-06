"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase, ArrowLeft, Plus, Trash2, ExternalLink, Edit3, Check,
  X, Search, Filter, Calendar, Building2, MapPin, TrendingUp,
  Clock, Star, AlertCircle, CheckCircle2, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_CONFIG = {
  "Wishlist":    { color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",   dot: "bg-slate-400" },
  "Applied":     { color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",     dot: "bg-blue-400" },
  "Screening":   { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",   dot: "bg-amber-400" },
  "Interview":   { color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20", dot: "bg-purple-400" },
  "Offer":       { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20",dot: "bg-emerald-400" },
  "Rejected":    { color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",       dot: "bg-red-400" },
  "Accepted":    { color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20",     dot: "bg-cyan-400" },
  "Withdrawn":   { color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20", dot: "bg-orange-400" },
};

const DEFAULT_JOBS = [
  { id: "1", company: "Google", role: "Software Engineer III", location: "Bangalore, India", status: "Interview", salary: "₹40-55 LPA", appliedDate: "2026-08-28", url: "https://careers.google.com", priority: "high", notes: "Round 2 scheduled - System Design focus" },
  { id: "2", company: "Flipkart", role: "SDE-2", location: "Remote", status: "Applied", salary: "₹28-35 LPA", appliedDate: "2026-09-01", url: "https://careers.flipkart.com", priority: "high", notes: "Applied via referral from LinkedIn connection" },
  { id: "3", company: "Razorpay", role: "Backend Engineer", location: "Bengaluru", status: "Screening", salary: "₹22-30 LPA", appliedDate: "2026-09-03", url: "https://razorpay.com/jobs", priority: "medium", notes: "HR call on September 10th" },
];

const STATUSES = Object.keys(STATUS_CONFIG);
const PRIORITIES = ["high", "medium", "low"];

const emptyJob = () => ({
  id: Date.now().toString(),
  company: "", role: "", location: "", status: "Applied",
  salary: "", appliedDate: new Date().toISOString().split("T")[0],
  url: "", priority: "medium", notes: ""
});

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("prepai_jobs");
        return saved ? JSON.parse(saved) : DEFAULT_JOBS;
      } catch { return DEFAULT_JOBS; }
    }
    return DEFAULT_JOBS;
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyJob());

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prepai_jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  const filteredJobs = jobs.filter(j => {
    const matchSearch = !search || j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {});
  const totalApplied = jobs.filter(j => j.status !== "Wishlist").length;
  const interviews = jobs.filter(j => j.status === "Interview").length;
  const offers = jobs.filter(j => j.status === "Offer" || j.status === "Accepted").length;

  const saveJob = () => {
    if (!form.company.trim() || !form.role.trim()) { toast.error("Company and role are required"); return; }
    if (editingId) {
      setJobs(prev => prev.map(j => j.id === editingId ? { ...form, id: editingId } : j));
      toast.success("Job updated!");
      setEditingId(null);
    } else {
      setJobs(prev => [{ ...form, id: Date.now().toString() }, ...prev]);
      toast.success("Job added to tracker!");
    }
    setForm(emptyJob());
    setShowAddForm(false);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    toast.success("Job removed");
  };

  const startEdit = (job) => {
    setForm({ ...job });
    setEditingId(job.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStatus = (id, newStatus) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="ambient-glow bg-teal-500/15 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-glow bg-indigo-500/10 w-[350px] h-[350px] top-1/3 -right-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-teal-500/30 transition-all text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white">Job Tracker</h1>
            </div>
            <p className="text-sm text-slate-400">Track all your applications in one place</p>
          </div>
        </div>
        <button
          onClick={() => { setForm(emptyJob()); setEditingId(null); setShowAddForm(v => !v); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold text-sm hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: totalApplied, icon: Briefcase, color: "text-blue-400" },
          { label: "In Interview", value: interviews, icon: TrendingUp, color: "text-purple-400" },
          { label: "Offers", value: offers, icon: Star, color: "text-emerald-400" },
          { label: "Response Rate", value: jobs.length > 0 ? `${Math.round((jobs.filter(j => ["Screening","Interview","Offer","Accepted","Rejected"].includes(j.status)).length / Math.max(totalApplied, 1)) * 100)}%` : "0%", icon: CheckCircle2, color: "text-cyan-400" }
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl border border-white/10 p-4 flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <div className="glass-panel rounded-3xl border border-teal-500/30 p-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            {editingId ? <Edit3 className="w-4 h-4 text-teal-400" /> : <Plus className="w-4 h-4 text-teal-400" />}
            {editingId ? "Edit Application" : "New Application"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[
              { field: "company", label: "Company *", placeholder: "e.g. Google" },
              { field: "role", label: "Role *", placeholder: "e.g. Software Engineer" },
              { field: "location", label: "Location", placeholder: "e.g. Bangalore / Remote" },
              { field: "salary", label: "Salary / Package", placeholder: "e.g. ₹25-35 LPA" },
              { field: "appliedDate", label: "Applied Date", type: "date" },
              { field: "url", label: "Job URL", placeholder: "https://..." },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">{label}</label>
                <input
                  type={type || "text"}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/40 transition-all"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500/40 transition-all">
                {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500/40 transition-all">
                {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-900 capitalize">{p}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes about this application..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/40 resize-none transition-all" />
          </div>
          <div className="flex gap-3">
            <button onClick={saveJob} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold text-sm hover:opacity-90 transition-all">
              <Check className="w-4 h-4" /> {editingId ? "Update" : "Add"} Job
            </button>
            <button onClick={() => { setShowAddForm(false); setEditingId(null); setForm(emptyJob()); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white font-bold text-sm hover:border-white/20 transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full pl-9 bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
          {["All", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                filterStatus === s ? "bg-teal-500/20 border-teal-500/40 text-teal-300" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
              }`}>
              {s !== "All" && STATUS_CONFIG[s] && <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />}
              {s}
              {s !== "All" && statusCounts[s] > 0 && <span className="px-1 rounded bg-white/10 text-[10px]">{statusCounts[s]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-3">
        {filteredJobs.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No applications found</p>
            <p className="text-xs mt-1">Add your first job application above</p>
          </div>
        )}
        {filteredJobs.map(job => {
          const sc = STATUS_CONFIG[job.status] || STATUS_CONFIG["Applied"];
          const priorityColor = job.priority === "high" ? "text-red-400" : job.priority === "medium" ? "text-amber-400" : "text-slate-400";
          return (
            <div key={job.id} className="glass-panel rounded-2xl border border-white/10 hover:border-white/20 p-4 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Company Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black text-white">{job.company[0]}</span>
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-white text-base truncate">{job.role}</span>
                    <span className={`text-[10px] font-bold uppercase ${priorityColor}`}>● {job.priority}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company}</span>
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.appliedDate}</span>
                    {job.salary && <span className="text-emerald-400 font-semibold">{job.salary}</span>}
                  </div>
                  {job.notes && <p className="text-xs text-slate-500 italic truncate">{job.notes}</p>}
                </div>
                {/* Status & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={job.status}
                    onChange={e => updateStatus(job.id, e.target.value)}
                    className={`text-xs font-bold px-2 py-1.5 rounded-lg border ${sc.bg} ${sc.color} bg-transparent focus:outline-none cursor-pointer`}
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                  </select>
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all" title="Open Job Post">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/dashboard/interview?role=${encodeURIComponent(job.role)}&company=${encodeURIComponent(job.company)}`}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                    title="Start Mock Interview for this Job"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span className="hidden sm:inline">Practice</span>
                  </Link>
                  <button onClick={() => startEdit(job)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="p-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
