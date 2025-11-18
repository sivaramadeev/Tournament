import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Tournament } from './types';
import { DEFAULT_TOURNAMENT, ADMIN_USERNAME, ADMIN_PASSWORD } from './constants';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PlayerView from './components/PlayerView';
import Header from './components/Header';

export type View = 'player' | 'admin' | 'login';

const App: React.FC = () => {
    const [tournament, setTournament] = useLocalStorage<Tournament>('tournamentData', DEFAULT_TOURNAMENT);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useLocalStorage<boolean>('isAdminLoggedIn', false);
    const [currentView, setCurrentView] = useState<View>('player');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdminLoggedIn) {
            setCurrentView('admin');
        } else {
            setCurrentView('player');
        }
        setLoading(false);
    }, [isAdminLoggedIn]);

    const handleLogin = useCallback((user: string, pass: string): boolean => {
        if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
            setIsAdminLoggedIn(true);
            setCurrentView('admin');
            return true;
        }
        return false;
    }, [setIsAdminLoggedIn]);

    const handleLogout = useCallback(() => {
        setIsAdminLoggedIn(false);
        setCurrentView('login');
    }, [setIsAdminLoggedIn]);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10">Loading Application...</div>;
        }
        switch (currentView) {
            case 'login':
                return <AdminLogin onLogin={handleLogin} />;
            case 'admin':
                if (isAdminLoggedIn) {
                    return <AdminDashboard tournament={tournament} setTournament={setTournament} />;
                }
                return <AdminLogin onLogin={handleLogin} />;
            case 'player':
            default:
                return <PlayerView tournament={tournament} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header
                currentView={currentView}
                setCurrentView={setCurrentView}
                isAdminLoggedIn={isAdminLoggedIn}
                onLogout={handleLogout}
                tournamentStatus={tournament.status}
            />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;