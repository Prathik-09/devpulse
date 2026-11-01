import React, { useEffect, useState } from 'react';
import { api, type DeveloperProfile, type GitHubUser, type LeetCodeStats, type StudySummary } from '../Services/api';
import { GitBranch, Code2, Clock, Trophy, ExternalLink, Flame, CheckCircle2 } from 'lucide-react';

export const OverviewTab: React.FC = () => {
    const [profile, setProfile] = useState<DeveloperProfile | null>(null);
    const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
    const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
    const [studySummary, setStudySummary] = useState<StudySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);
                // 1. Fetch Developer Profile from our ASP.NET Core DB
                const profiles = await api.getProfiles();
                if (profiles.length === 0) {
                    setError('No developer profile found. Please create one in Swagger first.');
                    setLoading(false);
                    return;
                }

                const currentProfile = profiles[0];
                setProfile(currentProfile);

                // 2. Fetch live data concurrently from GitHub, LeetCode, and Study Summary
                const [gh, lc, study] = await Promise.allSettled([
                    api.getGitHubUser(currentProfile.gitHubUsername),
                    api.getLeetCodeStats(currentProfile.leetCodeUsername),
                    api.getStudySummary(currentProfile.id),
                ]);

                if (gh.status === 'fulfilled') setGithubUser(gh.value);
                if (lc.status === 'fulfilled') setLeetcodeStats(lc.value);
                if (study.status === 'fulfilled') setStudySummary(study.value);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                setError('Failed to connect to backend API. Make sure your ASP.NET Core API is running!');
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className= "flex flex-col items-center justify-center p-12 text-slate-400" >
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm" > Fetching live metrics from backend & APIs...</p>
                    </div>

    );
  }

if (error) {
    return (
        <div className= "bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center" >
        <p className="font-semibold" > { error } </p>
            < p className = "text-xs text-slate-400 mt-2" >
                Make sure your Visual Studio backend is running with <code>Ctrl + F5 </code> on HTTPS.
                </p>
                </div>
    );
}

// Calculate LeetCode goal progress
const targetGoal = profile?.targetLeetCodeGoal || 500;
const currentSolved = leetcodeStats?.totalSolved || 0;
const progressPercent = Math.min(Math.round((currentSolved / targetGoal) * 100), 100);

return (
    <div className= "space-y-6" >

    {/* 1. PROFILE HERO BANNER */ }
    < div className = "bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6" >
        <img
          src={ githubUser?.avatarUrl || 'https://github.com/ghost.png' }
alt = { profile?.fullName || 'Developer Avatar'}
className = "w-24 h-24 rounded-2xl border-2 border-emerald-500/40 shadow-lg object-cover"
    />
    <div className="flex-1 text-center sm:text-left" >
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2" >
            <h1 className="text-2xl sm:text-3xl font-bold text-white" > { profile?.fullName } </h1>
                < span className = "flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium" >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full - Stack Engineer
                        </span>
                        </div>
                        < p className = "text-slate-400 text-sm max-w-2xl mb-4" >
                        { githubUser?.bio || 'Building scalable, high-performance web applications and tracking continuous engineering growth.'}
</p>
    < div className = "flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs" >
    { githubUser && (
            <a
                href={ githubUser.profileUrl }
target = "_blank"
rel = "noreferrer"
className = "flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
    >
    <GitBranch className="w-3.5 h-3.5 text-blue-400" />
        @{ profile?.gitHubUsername }
        < ExternalLink className = "w-3 h-3 text-slate-500" />
            </a>
            )}
{
    leetcodeStats && (
        <a
                href={ `https://leetcode.com/u/${profile?.leetCodeUsername}/` }
    target = "_blank"
    rel = "noreferrer"
    className = "flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
        <Code2 className="w-3.5 h-3.5 text-amber-400" />
            LeetCode: { profile?.leetCodeUsername }
    <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
            )
}
</div>
    </div>
    </div>

{/* 2. RESPONSIVE METRIC CARDS (1 col on phone, 2 on tablet, 4 on desktop) */ }
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >

{/* Card 1: GitHub Repos */ }
    < div className = "bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all" >
        <div className="flex items-center justify-between mb-3" >
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider" > Public Repos </span>
                < div className = "p-2 bg-blue-500/10 text-blue-400 rounded-lg" >
                    <GitBranch className="w-4 h-4" />
                        </div>
                        </div>
                        < div className = "text-3xl font-extrabold text-white mb-1" >
                        { githubUser?.publicRepos ?? '--'}
</div>
    < p className = "text-xs text-slate-400" > Repositories hosted on GitHub </p>
        </div>

{/* Card 2: LeetCode Solved & Goal */ }
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all" >
    <div className="flex items-center justify-between mb-3" >
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider" > LeetCode Solved </span>
            < div className = "p-2 bg-amber-500/10 text-amber-400 rounded-lg" >
                <Flame className="w-4 h-4" />
                    </div>
                    </div>
                    < div className = "text-3xl font-extrabold text-white mb-1" >
                    { leetcodeStats?.totalSolved ?? '--'}
<span className="text-sm font-normal text-slate-500 ml-1.5" > / {targetGoal}</span >
    </div>
    < div className = "w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden" >
        <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
style = {{ width: `${progressPercent}%` }}
            />
    </div>
    </div>

{/* Card 3: Study Hours */ }
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all" >
    <div className="flex items-center justify-between mb-3" >
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider" > Total Study Time </span>
            < div className = "p-2 bg-purple-500/10 text-purple-400 rounded-lg" >
                <Clock className="w-4 h-4" />
                    </div>
                    </div>
                    < div className = "text-3xl font-extrabold text-white mb-1" >
                    { studySummary?.totalHours ?? 0}
<span className="text-sm font-normal text-slate-500 ml-1.5" > hrs </span>
    </div>
    < p className = "text-xs text-slate-400" >
        Today: <span className="text-emerald-400 font-semibold" > { studySummary?.todayMinutes ?? 0} mins </span>
            </p>
            </div>

{/* Card 4: Global Rank */ }
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all" >
    <div className="flex items-center justify-between mb-3" >
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider" > Global Rank </span>
            < div className = "p-2 bg-emerald-500/10 text-emerald-400 rounded-lg" >
                <Trophy className="w-4 h-4" />
                    </div>
                    </div>
                    < div className = "text-3xl font-extrabold text-white mb-1" >
                        { leetcodeStats?.ranking? `#${leetcodeStats.ranking.toLocaleString()}` : '--'}
</div>
    < p className = "text-xs text-slate-400" > Worldwide LeetCode Standing </p>
        </div>

        </div>

        </div>
  );
};