import React, { useEffect, useState } from 'react';
import { api, type StudyLog, type StudySummary } from '../Services/api';
import { BookOpen, Clock, PlusCircle, CheckCircle2, Calendar, FileText, Sparkles, TrendingUp } from 'lucide-react';

const COMMON_TOPICS = [
    'ASP.NET Core & Web API',
    'System Design & Architecture',
    'LeetCode & Algorithms',
    'React & TypeScript',
    'Database & SQL Optimization',
    'Cloud & DevOps (Docker/AWS)',
];

export const StudyTab: React.FC = () => {
    const [logs, setLogs] = useState<StudyLog[]>([]);
    const [summary, setSummary] = useState<StudySummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form inputs
    const [topic, setTopic] = useState<string>(COMMON_TOPICS[0]);
    const [customTopic, setCustomTopic] = useState<string>('');
    const [minutes, setMinutes] = useState<number>(60);
    const [notes, setNotes] = useState<string>('');

    const PROFILE_ID = 1; // Our seeded developer profile ID

    async function loadData() {
        try {
            setLoading(true);
            const [logsData, summaryData] = await Promise.all([
                api.getStudyLogs(PROFILE_ID),
                api.getStudySummary(PROFILE_ID),
            ]);
            setLogs(logsData);
            setSummary(summaryData);
        } catch (err) {
            console.error('Failed to load study data:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const finalTopic = customTopic.trim() ? customTopic.trim() : topic;
        if (!finalTopic || minutes <= 0) return;

        try {
            setSubmitting(true);
            await api.createStudyLog({
                topic: finalTopic,
                durationMinutes: Number(minutes),
                notes: notes.trim(),
                developerProfileId: PROFILE_ID,
            });

            setSuccessMsg('Study session logged successfully!');
            setNotes('');
            setCustomTopic('');
            setMinutes(60);

            // Refresh logs & summary from database
            await loadData();

            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Failed to save study log:', err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className= "space-y-6" >

        {/* 1. TOP ANALYTICS STATS */ }
        < div className = "grid grid-cols-1 sm:grid-cols-3 gap-4" >

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5" >
                <div className="flex items-center justify-between mb-2" >
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" > Total Time Studied </span>
                        < div className = "p-2 bg-purple-500/10 text-purple-400 rounded-lg" >
                            <Clock className="w-4 h-4" />
                                </div>
                                </div>
                                < div className = "text-3xl font-extrabold text-white" >
                                { summary?.totalHours ?? 0
} <span className="text-sm font-normal text-slate-500" > hours </span>
    </div>
    < p className = "text-xs text-slate-400 mt-1" > { summary?.totalMinutes ?? 0} total minutes logged </p>
        </div>

        < div className = "bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5" >
            <div className="flex items-center justify-between mb-2" >
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" > Today's Focus</span>
                    < div className = "p-2 bg-emerald-500/10 text-emerald-400 rounded-lg" >
                        <TrendingUp className="w-4 h-4" />
                            </div>
                            </div>
                            < div className = "text-3xl font-extrabold text-white" >
                            { summary?.todayMinutes ?? 0} <span className="text-sm font-normal text-slate-500" > mins </span>
                                </div>
                                < p className = "text-xs text-slate-400 mt-1" > Logged today </p>
                                    </div>

                                    < div className = "bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5" >
                                        <div className="flex items-center justify-between mb-2" >
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" > Total Sessions </span>
                                                < div className = "p-2 bg-blue-500/10 text-blue-400 rounded-lg" >
                                                    <BookOpen className="w-4 h-4" />
                                                        </div>
                                                        </div>
                                                        < div className = "text-3xl font-extrabold text-white" >
                                                        { logs.length }
                                                            </div>
                                                            < p className = "text-xs text-slate-400 mt-1" > Dedicated study blocks </p>
                                                                </div>

                                                                </div>

{/* 2. MAIN 2-COLUMN SECTION: Form on Left, History on Right */ }
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6" >

{/* LEFT COLUMN: LOGGING FORM (5 Cols) */ }
    < div className = "lg:col-span-5 space-y-6" >
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6" >
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2" >
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                    Log Study Session
                        </h3>
                        < p className = "text-xs text-slate-400 mb-5" >
                            Record what you studied to track your engineering consistency.
            </p>

{
    successMsg && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2" >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            { successMsg }
                </div>
            )
}

<form onSubmit={ handleSubmit } className = "space-y-4" >
{/* Topic Select */ }
    < div >
    <label className="block text-xs font-medium text-slate-300 mb-1.5" > Study Topic </label>
        < select
value = { topic }
onChange = {(e) => setTopic(e.target.value)}
className = "w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
    >
{
    COMMON_TOPICS.map((t) => (
        <option key= { t } value = { t } className = "bg-slate-900 text-white" >
        { t }
        </option>
    ))
}
    < option value = "custom" className = "bg-slate-900 text-white" > + Custom Topic...</option>
        </select>
        </div>

{/* Custom Topic Input (if selected) */ }
{
    topic === 'custom' && (
        <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5" > Enter Custom Topic </label>
            < input
    type = "text"
    value = { customTopic }
    onChange = {(e) => setCustomTopic(e.target.value)
}
placeholder = "e.g. Docker Containers"
required
className = "w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
    />
    </div>
              )}

{/* Duration Minutes */ }
<div>
    <label className="block text-xs font-medium text-slate-300 mb-1.5" > Duration(Minutes) </label>
        < input
type = "number"
min = "5"
max = "600"
step = "5"
value = { minutes }
onChange = {(e) => setMinutes(Number(e.target.value))}
required
className = "w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
    />
    </div>

{/* Notes / Today I Learned */ }
<div>
    <label className="block text-xs font-medium text-slate-300 mb-1.5" >
        "Today I Learned" Notes < span className = "text-slate-500 font-normal" > (Optional) </span>
            </label>
            < textarea
rows = { 3}
value = { notes }
onChange = {(e) => setNotes(e.target.value)}
placeholder = "Key concepts, commands, or breakthroughs learned..."
className = "w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
    />
    </div>

{/* Submit Button */ }
<button
                type="submit"
disabled = { submitting }
className = "w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
    >
{ submitting? 'Saving to Database...': 'Save Study Session' }
    </button>
    </form>
    </div>

{/* Topic Breakdown Card */ }
{
    summary && summary.topicBreakdown.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6" >
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5" >
                <Sparkles className="w-4 h-4 text-purple-400" />
                    Time Spent by Topic
                        </h4>
                        < div className = "space-y-3" >
                        {
                            summary.topicBreakdown.map((item) => {
                                const percent = Math.round((item.totalMinutes / (summary.totalMinutes || 1)) * 100);
                                return (
                                    <div key= { item.topic } >
                                    <div className="flex justify-between text-xs mb-1" >
                                        <span className="text-white font-medium" > { item.topic } </span>
                                            < span className = "text-slate-400" > { item.totalMinutes }m({ percent } %) </span>
                                                </div>
                                                < div className = "w-full bg-slate-800 h-1.5 rounded-full overflow-hidden" >
                                                    <div
                          className="bg-purple-500 h-full rounded-full transition-all duration-500"
                                style = {{ width: `${percent}%` }
                            }
                        />
                                </div>
                                </div>
                            );
                        })
}
</div>
    </div>
          )}
</div>

{/* RIGHT COLUMN: RECENT STUDY LOGS HISTORY (7 Cols) */ }
<div className="lg:col-span-7" >
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6" >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" >
            <FileText className="w-5 h-5 text-blue-400" />
                Study Journal History
                    </h3>

{
    loading ? (
        <div className= "p-8 text-center text-slate-500 text-sm" > Loading sessions...</div>
            ) : logs.length === 0 ? (
        <div className= "p-8 text-center text-slate-500 text-sm" >
        No study sessions recorded yet.Use the form on the left to record your first session!
            </div>
            ) : (
        <div className= "space-y-3" >
        {
            logs.map((log) => {
                const dateStr = log.sessionDate
                    ? new Date(log.sessionDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })
                    : 'Recent';

                return (
                    <div
                      key= { log.id }
                className = "bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all"
                    >
                    <div className="flex items-start justify-between gap-3 mb-2" >
                        <span className="text-sm font-semibold text-white" > { log.topic } </span>
                            < span className = "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap" >
                            { log.durationMinutes } mins
                                </span>
                                </div>

                {
                    log.notes && (
                        <p className="text-xs text-slate-400 mb-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40" >
                        { log.notes }
                            </p>
                      )
        }

        < div className = "flex items-center gap-2 text-[11px] text-slate-500" >
            <Calendar className="w-3 h-3" />
                <span>{ dateStr } </span>
                </div>
                </div>
                  );
})}
</div>
            )}
</div>
    </div>

    </div>

    </div>
  );
};