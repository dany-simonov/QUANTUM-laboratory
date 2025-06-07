
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Atom, Zap, Book, Award, Target, Clock, Star, Eye, Waves, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ExperimentLab from './ExperimentLab';
import ParticleSimulator from './ParticleSimulator';
import OpticsSimulator from './OpticsSimulator';
import WaveSimulator from './WaveSimulator';
import ScientistProfile from './ScientistProfile';
import AchievementsPanel from './AchievementsPanel';

interface GameScreenProps {
  onBack: () => void;
  playerName: string;
}

interface GameState {
  energy: number;
  knowledge: number;
  discoveries: number;
  level: number;
  timeInLab: number;
  currentExperiment: string | null;
  unlockedScientists: string[];
  achievements: string[];
  completedLevels: number[];
}

const GameScreen: React.FC<GameScreenProps> = ({ onBack, playerName }) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(() => {
    // Загружаем сохраненное состояние
    const saved = localStorage.getItem(`quantumLabGame_${playerName}`);
    return saved ? JSON.parse(saved) : {
      energy: 100,
      knowledge: 0,
      discoveries: 0,
      level: 1,
      timeInLab: 0,
      currentExperiment: null,
      unlockedScientists: ['einstein'],
      achievements: [],
      completedLevels: []
    };
  });

  const [activeTab, setActiveTab] = useState<'lab' | 'particles' | 'optics' | 'waves' | 'scientists' | 'achievements'>('lab');
  const [gameTime, setGameTime] = useState(0);

  // Сохраняем состояние игры
  useEffect(() => {
    localStorage.setItem(`quantumLabGame_${playerName}`, JSON.stringify(gameState));
  }, [gameState, playerName]);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
      setGameState(prev => ({
        ...prev,
        timeInLab: prev.timeInLab + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-generate energy (faster)
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.min(100, prev.energy + 2)
      }));
    }, 3000); // Быстрее восстановление энергии

    return () => clearInterval(energyTimer);
  }, []);

  const conductExperiment = (experimentType: string, energyCost: number, knowledge: number) => {
    if (gameState.energy < energyCost) {
      toast({
        title: "Недостаточно энергии!",
        description: "Подождите, пока энергия восстановится.",
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => {
      const newKnowledge = prev.knowledge + knowledge;
      const newLevel = Math.floor(newKnowledge / 100) + 1;
      
      const newState = {
        ...prev,
        energy: prev.energy - energyCost,
        knowledge: newKnowledge,
        discoveries: prev.discoveries + 1,
        currentExperiment: experimentType,
        level: newLevel
      };

      // Проверяем повышение уровня
      if (newLevel > prev.level) {
        toast({
          title: "Повышение уровня! 🎉",
          description: `Поздравляем! Вы достигли ${newLevel} уровня исследователя!`,
        });

        // Разблокируем ученых по уровням
        const scientistUnlocks = {
          2: 'curie',
          3: 'landau',
          4: 'bohr',
          5: 'sakharov',
          6: 'kapitsa',
          7: 'feynman'
        };

        if (scientistUnlocks[newLevel as keyof typeof scientistUnlocks]) {
          const scientistId = scientistUnlocks[newLevel as keyof typeof scientistUnlocks];
          if (!newState.unlockedScientists.includes(scientistId)) {
            newState.unlockedScientists = [...newState.unlockedScientists, scientistId];
            toast({
              title: "Новый ученый разблокирован! 👨‍🔬",
              description: "Изучите биографию в разделе 'Ученые'",
            });
          }
        }
      }

      return newState;
    });

    toast({
      title: "Эксперимент завершен! ⚗️",
      description: `Получено знаний: ${knowledge}`,
    });
  };

  const completeLevel = (levelData: any) => {
    setGameState(prev => ({
      ...prev,
      knowledge: prev.knowledge + levelData.reward,
      completedLevels: [...prev.completedLevels, levelData.level]
    }));

    toast({
      title: `Уровень ${levelData.level} завершен! 🏆`,
      description: `${levelData.name} - награда: ${levelData.reward} знаний`,
    });
  };

  const handleSimulatorComplete = (knowledge: number) => {
    setGameState(prev => ({
      ...prev,
      knowledge: prev.knowledge + knowledge,
      discoveries: prev.discoveries + 1
    }));

    toast({
      title: "Симуляция завершена! 🔬",
      description: `Получено знаний: ${knowledge}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearProgress = () => {
    const confirmed = window.confirm('Вы уверены, что хотите сменить исследователя? Весь прогресс будет сброшен!');
    if (confirmed) {
      localStorage.removeItem(`quantumLabGame_${playerName}`);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg">
      {/* Header */}
      <div className="border-b border-lab-border bg-lab-surface/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-quantum-blue hover:text-quantum-blue/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Главное меню
            </Button>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-quantum-green" />
                <span className="text-sm">{formatTime(gameTime)}</span>
              </div>
              
              <Badge variant="outline" className="text-quantum-blue border-quantum-blue">
                {playerName} - Уровень {gameState.level}
              </Badge>

              <Button
                onClick={clearProgress}
                variant="outline"
                size="sm"
                className="text-quantum-orange border-quantum-orange hover:bg-quantum-orange/10"
              >
                Сменить исследователя
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Game Stats */}
          <div className="space-y-4">
            <Card className="energy-border bg-card/90">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-blue">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Энергия</span>
                    <span className="text-quantum-blue">{gameState.energy}/100</span>
                  </div>
                  <Progress value={gameState.energy} />
                  <span className="text-xs text-muted-foreground">
                    +2 каждые 3 секунды
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Знания</span>
                    <span className="text-quantum-purple">{gameState.knowledge}</span>
                  </div>
                  <Progress value={(gameState.knowledge % 100)} />
                  <span className="text-xs text-muted-foreground">
                    До {gameState.level + 1} уровня: {100 - (gameState.knowledge % 100)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-quantum-yellow" />
                    <span>{gameState.discoveries}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-quantum-orange" />
                    <span>{gameState.achievements.length}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Время в лаборатории: {Math.floor(gameState.timeInLab / 60)}м {gameState.timeInLab % 60}с</p>
                  <p>Завершено уровней: {gameState.completedLevels.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Navigation */}
            <Card className="bg-card/90">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => setActiveTab('lab')}
                    variant={activeTab === 'lab' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Лаборатория
                  </Button>
                  <Button
                    onClick={() => setActiveTab('particles')}
                    variant={activeTab === 'particles' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Atom className="w-4 h-4 mr-2" />
                    Симулятор частиц
                  </Button>
                  <Button
                    onClick={() => setActiveTab('optics')}
                    variant={activeTab === 'optics' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 2}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Симулятор оптики
                    {gameState.level < 2 && <span className="ml-auto text-xs">(ур. 2)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('waves')}
                    variant={activeTab === 'waves' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 3}
                  >
                    <Waves className="w-4 h-4 mr-2" />
                    Симулятор волн
                    {gameState.level < 3 && <span className="ml-auto text-xs">(ур. 3)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('scientists')}
                    variant={activeTab === 'scientists' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Ученые
                  </Button>
                  <Button
                    onClick={() => setActiveTab('achievements')}
                    variant={activeTab === 'achievements' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Достижения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'lab' && (
              <ExperimentLab 
                gameState={gameState}
                onConductExperiment={conductExperiment}
                onCompleteLevel={completeLevel}
              />
            )}
            {activeTab === 'particles' && (
              <ParticleSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'optics' && gameState.level >= 2 && (
              <OpticsSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'waves' && gameState.level >= 3 && (
              <WaveSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'scientists' && (
              <ScientistProfile 
                unlockedScientists={gameState.unlockedScientists}
                playerLevel={gameState.level}
              />
            )}
            {activeTab === 'achievements' && (
              <AchievementsPanel 
                gameState={gameState}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
