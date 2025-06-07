
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Atom, Zap, Book, Award, Target, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ExperimentLab from './ExperimentLab';
import ParticleSimulator from './ParticleSimulator';
import ScientistProfile from './ScientistProfile';

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
}

const GameScreen: React.FC<GameScreenProps> = ({ onBack, playerName }) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    energy: 100,
    knowledge: 0,
    discoveries: 0,
    level: 1,
    timeInLab: 0,
    currentExperiment: null,
    unlockedScientists: ['Einstein'],
    achievements: []
  });

  const [activeTab, setActiveTab] = useState<'lab' | 'particles' | 'scientists'>('lab');
  const [gameTime, setGameTime] = useState(0);

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

  // Auto-generate energy
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.min(100, prev.energy + 1)
      }));
    }, 5000);

    return () => clearInterval(energyTimer);
  }, []);

  const conductExperiment = (experimentType: string, energyCost: number) => {
    if (gameState.energy < energyCost) {
      toast({
        title: "Недостаточно энергии!",
        description: "Подождите, пока энергия восстановится.",
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => ({
      ...prev,
      energy: prev.energy - energyCost,
      knowledge: prev.knowledge + Math.floor(Math.random() * 20) + 10,
      discoveries: prev.discoveries + 1,
      currentExperiment: experimentType
    }));

    // Check for level up
    const newKnowledge = gameState.knowledge + Math.floor(Math.random() * 20) + 10;
    const newLevel = Math.floor(newKnowledge / 100) + 1;
    
    if (newLevel > gameState.level) {
      toast({
        title: "Повышение уровня!",
        description: `Поздравляем! Вы достигли ${newLevel} уровня исследователя!`,
      });
      
      setGameState(prev => ({
        ...prev,
        level: newLevel
      }));
    }

    toast({
      title: "Эксперимент завершен!",
      description: `Получено знаний: ${Math.floor(Math.random() * 20) + 10}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  <Progress value={gameState.energy} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Знания</span>
                    <span className="text-quantum-purple">{gameState.knowledge}</span>
                  </div>
                  <Progress value={(gameState.knowledge % 100)} className="h-2" />
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
              </CardContent>
            </Card>

            {/* Navigation */}
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
                    onClick={() => setActiveTab('scientists')}
                    variant={activeTab === 'scientists' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Ученые
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
              />
            )}
            {activeTab === 'particles' && (
              <ParticleSimulator 
                gameState={gameState}
                onExperimentComplete={(knowledge) => {
                  setGameState(prev => ({
                    ...prev,
                    knowledge: prev.knowledge + knowledge,
                    discoveries: prev.discoveries + 1
                  }));
                }}
              />
            )}
            {activeTab === 'scientists' && (
              <ScientistProfile 
                unlockedScientists={gameState.unlockedScientists}
                playerLevel={gameState.level}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
