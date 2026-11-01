const API_BASE_URL = 'http://localhost:5171/api';

// --- TYPES (Matching our ASP.NET Core Models & DTOs) ---
export interface DeveloperProfile {
    id: number;
    fullName: string;
    email: string;
    gitHubUsername: string;
    leetCodeUsername: string;
    targetLeetCodeGoal: number;
    targetDailyStudyMinutes: number;
    createdAt: string;
}

export interface GitHubUser {
    username: string;
    name?: string;
    avatarUrl: string;
    bio?: string;
    publicRepos: number;
    followers: number;
    profileUrl: string;
}

export interface GitHubRepo {
    name: string;
    description?: string;
    url: string;
    language?: string;
    stars: number;
    forks: number;
    updatedAt: string;
}

export interface LeetCodeStats {
    username: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
}

export interface StudyLog {
    id?: number;
    topic: string;
    durationMinutes: number;
    notes: string;
    sessionDate?: string;
    developerProfileId: number;
}

export interface StudySummary {
    totalMinutes: number;
    totalHours: number;
    todayMinutes: number;
    topicBreakdown: {
        topic: string;
        totalMinutes: number;
        sessionCount: number;
    }[];
}

// --- API METHODS ---
export const api = {
    // Profiles
    getProfiles: async (): Promise<DeveloperProfile[]> => {
        const res = await fetch(`${API_BASE_URL}/profiles`);
        if (!res.ok) throw new Error('Failed to fetch profiles');
        return res.json();
    },

    // GitHub
    getGitHubUser: async (username: string): Promise<GitHubUser> => {
        const res = await fetch(`${API_BASE_URL}/github/${username}`);
        if (!res.ok) throw new Error('Failed to fetch GitHub user');
        return res.json();
    },

    getGitHubRepos: async (username: string): Promise<GitHubRepo[]> => {
        const res = await fetch(`${API_BASE_URL}/github/${username}/repos`);
        if (!res.ok) throw new Error('Failed to fetch GitHub repositories');
        return res.json();
    },

    // LeetCode
    getLeetCodeStats: async (username: string): Promise<LeetCodeStats> => {
        const res = await fetch(`${API_BASE_URL}/leetcode/${username}`);
        if (!res.ok) throw new Error('Failed to fetch LeetCode stats');
        return res.json();
    },

    // Study Logs
    getStudyLogs: async (profileId: number): Promise<StudyLog[]> => {
        const res = await fetch(`${API_BASE_URL}/studylogs/profile/${profileId}`);
        if (!res.ok) throw new Error('Failed to fetch study logs');
        return res.json();
    },

    getStudySummary: async (profileId: number): Promise<StudySummary> => {
        const res = await fetch(`${API_BASE_URL}/studylogs/profile/${profileId}/summary`);
        if (!res.ok) throw new Error('Failed to fetch study summary');
        return res.json();
    },

    createStudyLog: async (log: StudyLog): Promise<StudyLog> => {
        const res = await fetch(`${API_BASE_URL}/studylogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
        });
        if (!res.ok) throw new Error('Failed to create study log');
        return res.json();
    },
};