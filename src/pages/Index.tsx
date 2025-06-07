
import React, { useState, useEffect } from 'react';
import MainMenu from '@/components/MainMenu';
import LoginScreen from '@/components/LoginScreen';
import SettingsScreen from '@/components/SettingsScreen';
import GameScreen from '@/components/GameScreen';

type Screen = 'menu' | 'login' | 'settings' | 'game';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [playerName, setPlayerName] = useState<string | null>(null);

  // Load player data from localStorage
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('quantumLabPlayerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  const handleLogin = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('quantumLabPlayerName', name);
    setCurrentScreen('menu');
  };

  const handleStartGame = () => {
    if (!playerName) {
      setCurrentScreen('login');
    } else {
      setCurrentScreen('game');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowSettings={() => setCurrentScreen('settings')}
            onShowLogin={() => setCurrentScreen('login')}
            playerName={playerName}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onBack={() => setCurrentScreen('menu')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('menu')}
          />
        );
      case 'game':
        return (
          <GameScreen
            onBack={() => setCurrentScreen('menu')}
            playerName={playerName!}
          />
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default Index;
