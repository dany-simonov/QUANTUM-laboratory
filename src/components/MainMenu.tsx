import React from 'react';
import { Play, Settings, BookOpen, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface MainMenuProps {
  onStartGame: () => void;
  onShowSettings: () => void;
  onShowLogin: () => void;
  playerName: string | null;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowSettings, onShowLogin, playerName }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg lab-grid flex items-center justify-center p-4">
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`particle animate-particle-float bg-quantum-${['blue', 'purple', 'green', 'orange'][i % 4]}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Game Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-glow text-quantum-blue mb-4">
            КВАНТОВАЯ
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-glow text-quantum-purple">
            ЛАБОРАТОРИЯ
          </h2>
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Исследуйте мир физики частиц, проводите эксперименты и открывайте законы Вселенной
          </p>
        </div>

        {/* User Info */}
        {playerName && (
          <Card className="mb-8 p-4 bg-card/50 energy-border inline-block">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-quantum-green" />
              <span className="text-lg">Добро пожаловать, {playerName}!</span>
            </div>
          </Card>
        )}

        {/* Menu Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Button
            onClick={onStartGame}
            size="lg"
            className="h-20 text-xl bg-quantum-blue hover:bg-quantum-blue/80 text-black energy-border animate-glow"
          >
            <Play className="w-8 h-8 mr-3" />
            Начать Исследование
          </Button>

          <Button
            onClick={onShowLogin}
            variant="outline"
            size="lg"
            className="h-20 text-xl border-quantum-purple text-quantum-purple hover:bg-quantum-purple/10"
          >
            <User className="w-8 h-8 mr-3" />
            {playerName ? 'Сменить Исследователя' : 'Вход в Лабораторию'}
          </Button>

          <Button
            onClick={onShowSettings}
            variant="outline"
            size="lg"
            className="h-20 text-xl border-quantum-green text-quantum-green hover:bg-quantum-green/10"
          >
            <Settings className="w-8 h-8 mr-3" />
            Настройки Оборудования
          </Button>

          <Button
            onClick={() => navigate('/scientists')}
            variant="outline"
            size="lg"
            className="h-20 text-xl border-quantum-yellow text-quantum-yellow hover:bg-quantum-yellow/10"
          >
            <BookOpen className="w-8 h-8 mr-3" />
            Справочник Учёных
          </Button>
        </div>

        {/* Achievement Preview */}
        <div className="mt-12 flex justify-center items-center gap-4 text-muted-foreground">
          <Award className="w-6 h-6 text-quantum-orange" />
          <span>Открыто достижений: 0/25</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
