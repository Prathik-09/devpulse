import React, { useEffect, useState } from 'react';
import { api, type LeetCodeStats } from '../Services/api';
import { Code2, Trophy, Flame, Search, ExternalLink, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export const LeetCodeTab: React.FC = () => {
    const [username, setUsername] = useState<string>('Prathik_Patil02');
    const [searchInput, setSearchInput] = useState<string>('Prathik_Patil02');
    const [stats, setStats] = useState<LeetCodeStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const TARGET_GOAL = 500;

    async function fetchLeetCodeStats(user: string) {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getLeetCodeStats(user);
            setStats(data);
        } catch (err) {
            console.error(err);
            setError(`Could not find LeetCode profile for "${user}". Please check the username.`);
            setStats(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeetCodeStats(username);
    }, [username]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setUsername(searchInput.trim());
        }
    };

    const total = stats?.totalSolved || 0;
    const easyPercent = total > 0 ? Math.round(((stats?.easySolved || 0) / total) * 100) : 0;
    const medPercent = total > 0 ? Math.round(((stats?.mediumSolved || 0) / total) * 100) : 0;
    const hardPercent = total > 0 ? Math.round(((stats?.hardSolved || 0) / total) * 100) : 0;
    const goalPercent = Math.min(Math.round((total / TARGET_GOAL) * 100), 100);
    const problemsRemaining = Math.max(0, TARGET_GOAL - total);

    return (
        <div className= "space-y-6" >

        {/* 1. SEARCH & PROFILE HEADER */ }
        < div className = "bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4" >

        {/* Profile Details */ }
            < div className = "flex items-center gap-4 w-full md:w-auto" >
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20" >
                    <Code2 className="w-8 h-8" />
                        </div>
                        < div >
                        <div className="flex items-center gap-2" >
                            <h2 className="text-xl font-bold text-white" > LeetCode Profile </h2>
    {
        stats && (
            <a
                  href={ `https://leetcode.com/u/${username}/` }
        target = "_blank"
        rel = "noreferrer"
        className = "text-slate-400 hover:text-white transition-colors"
            >
            <ExternalLink className="w-4 h-4" />
                </a>
              )}
</div>
    < p className = "text-xs text-slate-400" > @{ username } </p>
{
    stats && (
        <div className="flex items-center gap-2 mt-1 text-xs text-amber-400 font-medium" >
            <Trophy className="w-3.5 h-3.5" />
                Global Rank: #{ stats.ranking.toLocaleString() }
    </div>
            )
}
</div>
    </div>

{/* Live Search Input */ }
<form onSubmit={ handleSearch } className = "flex items-center gap-2 w-full md:w-auto" >
    <div className="relative flex-1 md:w-64" >
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
value = { searchInput }
onChange = {(e) => setSearchInput(e.target.value)}
placeholder = "Search LeetCode user..."
className = "w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
    />
    </div>
    < button
type = "submit"
className = "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
    >
    Search
    </button>
    </form>

    </div>

{/* 2. LOADING & ERROR STATES */ }
{
    loading && (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400" >
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm" > Querying LeetCode GraphQL Engine...</p>
                    </div>
      )
}

{
    error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3" >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm" > { error } </p>
                    </div>
      )
}

{/* 3. METRICS & DIFFICULTY BREAKDOWN */ }
{
    !loading && !error && stats && (
        <>
        {/* Main Target & Overall Progress */ }
        < div className = "bg-slate-900/60 border border-slate-800 rounded-2xl p-6" >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4" >
                <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5" >
                    <Target className="w-4 h-4" /> Goal Progress Tracker
                        </span>
                        < h3 className = "text-2xl font-bold text-white mt-1" >
                        { total } < span className = "text-slate-500 text-lg font-normal" > / {TARGET_GOAL} Problems Solved</span >
                            </h3>
                            </div>
                            < div className = "text-right" >
                                <span className="text-2xl font-extrabold text-emerald-400" > { goalPercent } % </span>
                                    < p className = "text-xs text-slate-400" > { problemsRemaining } problems to target goal </p>
                                        </div>
                                        </div>

    {/* Stacked Color Breakdown Bar */ }
    <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex" >
        <div style={ { width: `${easyPercent}%` } } className = "bg-emerald-500 h-full transition-all" title = {`Easy: ${stats.easySolved}`
} />
    < div style = {{ width: `${medPercent}%` }} className = "bg-amber-400 h-full transition-all" title = {`Medium: ${stats.mediumSolved}`} />
        < div style = {{ width: `${hardPercent}%` }} className = "bg-rose-500 h-full transition-all" title = {`Hard: ${stats.hardSolved}`} />
            </div>

            < div className = "flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-slate-400" >
                <div className="flex items-center gap-4" >
                    <span className="flex items-center gap-1.5" > <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Easy({ easyPercent } %) </span>
                        < span className = "flex items-center gap-1.5" > <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium({ medPercent } %) </span>
                            < span className = "flex items-center gap-1.5" > <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Hard({ hardPercent } %) </span>
                                </div>
                                < span className = "flex items-center gap-1 text-slate-300 font-medium" >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live GraphQL Sync
                                        </span>
                                        </div>
                                        </div>

{/* 3 Difficulty Cards (Responsive 1-col on mobile, 3-col on desktop) */ }
<div className="grid grid-cols-1 md:grid-cols-3 gap-4" >

{/* EASY */ }
    < div className = "bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 border-l-4 border-l-emerald-500" >
        <div className="flex items-center justify-between mb-2" >
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider" > Easy </span>
                < span className = "text-xs text-slate-500" > { easyPercent } % of total </span>
                    </div>
                    < div className = "text-3xl font-extrabold text-white mb-1" >
                    { stats.easySolved }
                        </div>
                        < p className = "text-xs text-slate-400" > Foundational Data Structures & Algorithms </p>
                            </div>

{/* MEDIUM */ }
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 border-l-4 border-l-amber-400" >
    <div className="flex items-center justify-between mb-2" >
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider" > Medium </span>
            < span className = "text-xs text-slate-500" > { medPercent } % of total </span>
                </div>
                < div className = "text-3xl font-extrabold text-white mb-1" >
                { stats.mediumSolved }
                    </div>
                    < p className = "text-xs text-slate-400" > Dynamic Programming, Graphs, Trees </p>
                        </div>

{/* HARD */ }
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 border-l-4 border-l-rose-500" >
    <div className="flex items-center justify-between mb-2" >
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider" > Hard </span>
            < span className = "text-xs text-slate-500" > { hardPercent } % of total </span>
                </div>
                < div className = "text-3xl font-extrabold text-white mb-1" >
                { stats.hardSolved }
                    </div>
                    < p className = "text-xs text-slate-400" > Advanced Algorithmic Design </p>
                        </div>

                        </div>
                        </>
      )}

</div>
  );
};