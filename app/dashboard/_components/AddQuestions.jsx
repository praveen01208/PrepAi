"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Sparkles,
  LoaderCircle,
  Briefcase,
  Code2,
  Calendar,
  Building2,
  Tag,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddQuestions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          typeQuestion,
          company,
          jobExperience,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      if (data.mockId) {
        setOpenDialog(false);
        router.push("/dashboard/pyq/" + data.mockId);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "There was an error generating questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpenDialog(true)}
        className="group relative overflow-hidden rounded-3xl p-6 glass-card border border-dashed border-purple-400/40 dark:border-purple-500/30 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px]"
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-md">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Company Sets
          </span>
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            + Generate Question Set
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tailor questions by target employer &amp; tech domains
          </p>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl w-[95vw] rounded-3xl p-0 overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-7 text-white border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4" /> PREP-AI Repository
            </div>
            <DialogTitle className="text-2xl font-black text-white">
              Targeted Question Bank
            </DialogTitle>
            <DialogDescription className="text-purple-200 text-xs mt-1">
              Specify your target employer and question style for accurate practice questions.
            </DialogDescription>
          </div>

          <form onSubmit={onSubmit} className="p-5 sm:p-7 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                  Target Role
                </label>
                <Input
                  className="rounded-xl glass-input text-sm"
                  value={jobPosition}
                  placeholder="e.g. Backend Engineer"
                  required
                  onChange={handleInputChange(setJobPosition)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  Target Company
                </label>
                <Input
                  className="rounded-xl glass-input text-sm"
                  value={company}
                  placeholder="e.g. Google, Amazon, Stripe"
                  required
                  onChange={handleInputChange(setCompany)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-500" />
                Tech Stack / Core Topics
              </label>
              <Textarea
                className="rounded-xl glass-input min-h-[85px] text-sm"
                value={jobDesc}
                placeholder="e.g. Python, Distributed Systems, SQL, Concurrency"
                required
                onChange={handleInputChange(setJobDesc)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-500" />
                  Category / Focus Type
                </label>
                <Input
                  className="rounded-xl glass-input text-sm"
                  value={typeQuestion}
                  placeholder="e.g. System Design, Algorithms"
                  required
                  onChange={handleInputChange(setTypeQuestion)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  Years Experience
                </label>
                <Input
                  className="rounded-xl glass-input text-sm"
                  value={jobExperience}
                  max="50"
                  type="number"
                  placeholder="e.g. 3"
                  required
                  onChange={handleInputChange(setJobExperience)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-xs font-semibold"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs px-6 py-2.5 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Generating Bank...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Questions
                  </span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddQuestions;
