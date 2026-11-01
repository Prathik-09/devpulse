import React, { useEffect, useState } from 'react';
import { api, type GitHubUser, type GitHubRepo } from '../Services/api';
import { GitBranch, Star, GitFork, ExternalLink, Search, Calendar, Code, AlertCircle } from 'lucide-react';

// Language badge colors matching official GitHub colors
const LANGUAGE_COLORS: Record<string, string> = {
    'C#': 'bg-purple-500',
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-emerald-500',
    Java: 'bg-amber-600',
    HTML: 'bg-orange-500',
    CSS: 'bg-pink-500',
    Default: 'bg-slate-500',
};

export const GitHubTab: React.FC = () => {
    const [username, setUsername] = useState<string>('saiprathik');
    const [searchInput, setSearchInput] = useState<string>('saiprathik');
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch GitHub User Profile and Repositories
    async function fetchGitHubData(targetUser: string) {
        try {
            setLoading(true);
            setError(null);

            const [userData, reposData] = await Promise.all([
                api.getGitHubUser(targetUser),
                api.getGitHubRepos(targetUser),
            ]);

            setUser(userData);
            setRepos(reposData);
        } catch (err) {
            console.error(err);
            setError(`Could not find GitHub user "${targetUser}". Please check the spelling.`);
            setUser(null);
            setRepos([]);
        } finally {
            setLoading(false);
        }
    }

    // Load default user on mount
    useEffect(() => {
        fetchGitHubData(username);
    }, [username]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setUsername(searchInput.trim());
        }
    };

    // Compute language distribution across repositories
    const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const totalReposWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);

    return (
        <div className= "space-y-6" >

        {/* 1. SEARCH & PROFILE HEADER */ }
        < div className = "bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4" >

        {/* Profile Snapshot */ }
            < div className = "flex items-center gap-4 w-full md:w-auto" >
                <img
            src={ user?.avatarUrl || 'https://github.com/ghost.png' }
    alt = { user?.username }
    className = "w-16 h-16 rounded-xl border border-slate-700 object-cover"
        />
        <div>
        <div className="flex items-center gap-2" >
            <h2 className="text-xl font-bold text-white" > { user?.name || user?.username || username
}</h2>
{
    user && (
        <a
                  href={ user.profileUrl }
    target = "_blank"
    rel = "noreferrer"
    className = "text-slate-400 hover:text-white transition-colors"
        >
        <ExternalLink className="w-4 h-4" />
            </a>
              )
}
</div>
    < p className = "text-xs text-slate-400" > @{ user?.username || username}</p>
        < div className = "flex items-center gap-4 mt-2 text-xs text-slate-400" >
            <span><strong className="text-white" > { user?.publicRepos ?? 0}</strong> Repos</span >
                <span><strong className="text-white" > { user?.followers ?? 0}</strong> Followers</span >
                    </div>
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
placeholder = "Search GitHub username..."
className = "w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
    />
    </div>
    < button
type = "submit"
className = "px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-colors"
    >
    Search
    </button>
    </form>

    </div>

{/* 2. LANGUAGE DISTRIBUTION BAR */ }
{
    repos.length > 0 && totalReposWithLanguage > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6" >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2" >
                <Code className="w-4 h-4 text-emerald-400" />
                    Top Repository Languages
                        </h3>

    {/* Multi-colored Progress Bar */ }
    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800" >
    {
        Object.entries(languageCounts).map(([lang, count]) => {
            const percent = Math.round((count / totalReposWithLanguage) * 100);
            const colorClass = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Default;
            return (
                <div
                  key= { lang }
            style = {{ width: `${percent}%` }
        }
                  className = {`${colorClass} h-full transition-all`}
    title = {`${lang}: ${percent}%`
}
                />
              );
            })}
</div>

{/* Language Legends */ }
<div className="flex flex-wrap gap-4 mt-3" >
{
    Object.entries(languageCounts).map(([lang, count]) => {
        const percent = Math.round((count / totalReposWithLanguage) * 100);
        const colorClass = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Default;
        return (
            <div key= { lang } className = "flex items-center gap-1.5 text-xs text-slate-400" >
                <span className={ `w-2.5 h-2.5 rounded-full ${colorClass}` } />
                    < span className = "text-white font-medium" > { lang } </span>
                        < span > { percent } % </span>
                        </div>
              );
})}
</div>
    </div>
      )}

{/* 3. LOADING & ERROR STATES */ }
{
    loading && (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400" >
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm" > Fetching repositories from GitHub API...</p>
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

{/* 4. REPOSITORIES GRID (1 Col on Mobile, 2 Col on Tablet/Desktop) */ }
{
    !loading && !error && (
        <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4" >
            Recent Public Repositories({ repos.length })
                </h3>

    {
        repos.length === 0 ? (
            <div className= "bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm" >
            No public repositories found for this account.
            </div>
          ) : (
                <div className= "grid grid-cols-1 md:grid-cols-2 gap-4" >
                {
                    repos.map((repo) => {
                        const colorClass = (repo.language && LANGUAGE_COLORS[repo.language]) || LANGUAGE_COLORS.Default;
                        const formattedDate = new Date(repo.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        });

                        return (
                            <div
                    key= { repo.name }
                        className = "bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group"
                            >
                            <div>
                            <div className="flex items-start justify-between gap-2 mb-2" >
                                <a
                          href={ repo.url }
                        target = "_blank"
                        rel = "noreferrer"
                        className = "font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 break-all"
                            >
                            <GitBranch className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            { repo.name }
                                < ExternalLink className = "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    </div>

                                    < p className = "text-slate-400 text-xs line-clamp-2 mb-4" >
                                    { repo.description || 'No description provided.' }
                                        </p>
                                        </div>

                                        < div className = "flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60" >
                                        {/* Language Badge */ }
                                            < div className = "flex items-center gap-1.5" >
                                                {
                                                    repo.language ? (
                                                        <>
                                                        <span className= {`w-2 h-2 rounded-full ${colorClass}`} />
                                                <span className="text-slate-300" > { repo.language } </span>
                                                    </>
                        ) : (
                                                        <span className="text-slate-500" > Markdown / Other </span>
                                                    )
    }
    </div>

    {/* Stars, Forks & Date */ }
    <div className="flex items-center gap-3" >
        <span className="flex items-center gap-1 hover:text-amber-400 transition-colors" >
            <Star className="w-3.5 h-3.5" />
            { repo.stars }
                </span>
                < span className = "flex items-center gap-1" >
                    <GitFork className="w-3.5 h-3.5" />
                    { repo.forks }
                        </span>
                        < span className = "hidden sm:flex items-center gap-1 text-[11px] text-slate-500" >
                            <Calendar className="w-3 h-3" />
                            { formattedDate }
                                </span>
                                </div>
                                </div>
                                </div>
                );
})}
</div>
          )}
</div>
      )}

</div>
  );
};