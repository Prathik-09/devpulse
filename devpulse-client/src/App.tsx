import React, { useState } from 'react';
import { Navbar } from './Components/Navbar';
import { OverviewTab } from './Components/OverviewTab';
import { GitHubTab } from './Components/GitHubTab';
import { LeetCodeTab } from './Components/LeetCodeTab';
import { StudyTab } from './Components/StudyTab';
import type { TabType } from './types';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    return (
        <div className= "min-h-screen bg-slate-950 text-slate-100 pb-20 md:pb-8" >
        {/* Responsive Navigation */ }
        < Navbar
    activeTab = { activeTab }
    setActiveTab = { setActiveTab }
    developerName = "Sai Prathik"
        />

    {/* Main Content Area */ }
        < main className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" >
        { activeTab === 'overview' && <OverviewTab />
}
{ activeTab === 'github' && <GitHubTab /> }
{ activeTab === 'leetcode' && <LeetCodeTab /> }
{ activeTab === 'study' && <StudyTab /> }
</main>
    </div>
  );
}