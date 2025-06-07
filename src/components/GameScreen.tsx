
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Atom, Zap, Book, Award, Target, Clock, Star, Eye, Waves, Trophy, CircuitBoard, Timer, Thermometer, Volume2, Magnet, TrendingUp, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ExperimentLab from './ExperimentLab';
import ParticleSimulator from './ParticleSimulator';
import OpticsSimulator from './OpticsSimulator';
import WaveSimulator from './WaveSimulator';
import ElectricalCircuitSimulator from './ElectricalCircuitSimulator';
import MechanicalOscillationSimulator from './MechanicalOscillationSimulator';
import ThermalProcessSimulator from './ThermalProcessSimulator';
import SoundWaveSimulator from './SoundWaveSimulator';
import MagneticFieldSimulator from './MagneticFieldSimulator';
import MotionSimulator from './MotionSimulator';
import ScientistProfile from './ScientistProfile';
import AchievementsPanel from './AchievementsPanel';
import PhysicsLab from './PhysicsLab';

interface GameScreenProps {
  onBack: () => void;
  playerName: string;
}

interface GameState {
  energy: number;
  maxEnergy: number;
  knowledge: number;
  discoveries: number;
  level: number;
  timeInLab: number;
  currentExperiment: string | null;
  unlockedScientists: string[];
  achievements: string[];
  completedLevels: number[];
  completedExperiments: string[];
}

const GameScreen: React.FC<GameScreenProps> = ({ onBack, playerName }) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(() => {
    // Загружаем сохраненное состояние
    const saved = localStorage.getItem(`quantumLabGame_${playerName}`);
    return saved ? JSON.parse(saved) : {
      energy: 100,
      maxEnergy: 100,
      knowledge: 0,
      discoveries: 0,
      level: 1,
      timeInLab: 0,
      currentExperiment: null,
      unlockedScientists: ['einstein'],
      achievements: [],
      completedLevels: [],
      completedExperiments: []
    };
  });

  const [activeTab, setActiveTab] = useState<'lab' | 'particles' | 'optics' | 'waves' | 'circuits' | 'oscillations' | 'thermal' | 'sound' | 'magnetic' | 'motion' | 'scientists' | 'achievements' | 'physics-lab'>('lab');
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
        energy: Math.min(prev.maxEnergy, prev.energy + 2)
      }));
    }, 3000);

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
      const newMaxEnergy = 100 + ((newLevel - 1) * 25);
      const newCompletedExperiments = [...prev.completedExperiments, experimentType];
      
      const newState = {
        ...prev,
        energy: prev.energy - energyCost,
        maxEnergy: newMaxEnergy,
        knowledge: newKnowledge,
        discoveries: prev.discoveries + 1,
        currentExperiment: experimentType,
        level: newLevel,
        completedExperiments: newCompletedExperiments
      };

      // Проверяем повышение уровня
      if (newLevel > prev.level) {
        toast({
          title: "Повышение уровня! 🎉",
          description: `Поздравляем! Вы достигли ${newLevel} уровня исследователя! Максимум энергии увеличен до ${newMaxEnergy}.`,
        });

        // Разблокируем ученых быстрее (каждый уровень)
        const scientistUnlocks = {
          2: ['curie', 'planck'],
          3: ['landau', 'bohr'],
          4: ['heisenberg', 'schrodinger'],
          5: ['feynman', 'dirac'],
          6: ['maxwell', 'galilei'],
          7: ['newton', 'goeppert_mayer'],
          8: ['fermi', 'chadwick'],
          9: ['meitner', 'faraday'],
          10: ['gauss', 'mendeleev'],
          11: ['kurchatov', 'sakharov'],
          12: ['korolev', 'lobachevsky'],
          13: ['tsiolkovsky', 'cherenkov'],
          14: ['friedman', 'basov'],
          15: ['mechnikov', 'popov']
        };

        const newUnlocks = scientistUnlocks[newLevel as keyof typeof scientistUnlocks] || [];
        if (newUnlocks.length > 0) {
          const toUnlock = newUnlocks.filter(id => !newState.unlockedScientists.includes(id));
          if (toUnlock.length > 0) {
            newState.unlockedScientists = [...newState.unlockedScientists, ...toUnlock];
            toast({
              title: "Новые ученые разблокированы! 👨‍🔬",
              description: `Изучите ${toUnlock.length} новых биографий в разделе 'Ученые'`,
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

  // Calculate achievements
  const calculateAchievements = () => {
    const achievements = [];
    if (gameState.discoveries >= 1) achievements.push('first_experiment');
    if (gameState.energy >= gameState.maxEnergy) achievements.push('energy_saver');
    if (gameState.knowledge >= 100) achievements.push('knowledge_seeker');
    if (gameState.discoveries >= 10) achievements.push('experiment_master');
    if (gameState.timeInLab >= 600) achievements.push('time_traveler');
    if (gameState.level >= 5) achievements.push('level_up');
    if (gameState.knowledge >= 500) achievements.push('scientist');
    if (gameState.discoveries >= 25) achievements.push('persistent');
    if (gameState.timeInLab >= 1800) achievements.push('marathon');
    if (gameState.knowledge >= 1000) achievements.push('genius');
    if (gameState.discoveries >= 50) achievements.push('experimenter');
    if (gameState.timeInLab >= 3600) achievements.push('dedication');
    return achievements;
  };

  const currentAchievements = calculateAchievements();

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

              {/* Achievements Display */}
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-quantum-yellow" />
                <span className="text-sm">{currentAchievements.length}</span>
              </div>

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
                    <span className="text-quantum-blue">{Math.round(gameState.energy || 0)}/{gameState.maxEnergy || 100}</span>
                  </div>
                  <Progress value={((gameState.energy || 0) / (gameState.maxEnergy || 100)) * 100} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Знания</span>
                    <span className="text-quantum-purple">{gameState.knowledge || 0}</span>
                  </div>
                  <Progress value={(gameState.knowledge || 0) % 100} />
                  <span className="text-xs text-muted-foreground">
                    До {(gameState.level || 1) + 1} уровня: {100 - ((gameState.knowledge || 0) % 100)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-quantum-yellow" />
                    <span>{gameState.discoveries || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-quantum-orange" />
                    <span>{currentAchievements.length}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Время в лаборатории: {Math.floor((gameState.timeInLab || 0) / 60)}м {(gameState.timeInLab || 0) % 60}с</p>
                  <p>Завершено уровней: {(gameState.completedLevels || []).length}</p>
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
                    Частицы
                  </Button>
                  <Button
                    onClick={() => setActiveTab('circuits')}
                    variant={activeTab === 'circuits' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 2}
                  >
                    <CircuitBoard className="w-4 h-4 mr-2" />
                    Электрические цепи
                    {gameState.level < 2 && <span className="ml-auto text-xs">(ур. 2)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('oscillations')}
                    variant={activeTab === 'oscillations' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 3}
                  >
                    <Timer className="w-4 h-4 mr-2" />
                    Колебания
                    {gameState.level < 3 && <span className="ml-auto text-xs">(ур. 3)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('thermal')}
                    variant={activeTab === 'thermal' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 4}
                  >
                    <Thermometer className="w-4 h-4 mr-2" />
                    Тепловые процессы
                    {gameState.level < 4 && <span className="ml-auto text-xs">(ур. 4)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('sound')}
                    variant={activeTab === 'sound' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 5}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Звуковые волны
                    {gameState.level < 5 && <span className="ml-auto text-xs">(ур. 5)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('optics')}
                    variant={activeTab === 'optics' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 6}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Оптика
                    {gameState.level < 6 && <span className="ml-auto text-xs">(ур. 6)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('magnetic')}
                    variant={activeTab === 'magnetic' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 7}
                  >
                    <Magnet className="w-4 h-4 mr-2" />
                    Магнетизм
                    {gameState.level < 7 && <span className="ml-auto text-xs">(ур. 7)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('motion')}
                    variant={activeTab === 'motion' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 8}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Механика
                    {gameState.level < 8 && <span className="ml-auto text-xs">(ур. 8)</span>}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('waves')}
                    variant={activeTab === 'waves' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    disabled={gameState.level < 9}
                  >
                    <Waves className="w-4 h-4 mr-2" />
                    Волны
                    {gameState.level < 9 && <span className="ml-auto text-xs">(ур. 9)</span>}
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
                  <Button
                    onClick={() => setActiveTab('physics-lab')}
                    variant={activeTab === 'physics-lab' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Beaker className="w-4 h-4 mr-2" />
                    Физическая лаборатория
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
            {activeTab === 'circuits' && gameState.level >= 2 && (
              <ElectricalCircuitSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'oscillations' && gameState.level >= 3 && (
              <MechanicalOscillationSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'thermal' && gameState.level >= 4 && (
              <ThermalProcessSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'sound' && gameState.level >= 5 && (
              <SoundWaveSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'optics' && gameState.level >= 6 && (
              <OpticsSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'magnetic' && gameState.level >= 7 && (
              <MagneticFieldSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'motion' && gameState.level >= 8 && (
              <MotionSimulator 
                gameState={gameState}
                onExperimentComplete={handleSimulatorComplete}
              />
            )}
            {activeTab === 'waves' && gameState.level >= 9 && (
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
                gameState={{...gameState, achievements: currentAchievements}}
              />
            )}
            {activeTab === 'physics-lab' && (
              <PhysicsLab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
