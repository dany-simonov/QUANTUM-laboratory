
import React, { useState } from 'react';
import { Zap, Atom, Waves, Lightbulb, Timer, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExperimentLabProps {
  gameState: any;
  onConductExperiment: (type: string, energyCost: number) => void;
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  requiredLevel: number;
  icon: React.ComponentType;
  color: string;
  knowledgeReward: string;
  duration: number;
}

const ExperimentLab: React.FC<ExperimentLabProps> = ({ gameState, onConductExperiment }) => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentProgress, setExperimentProgress] = useState(0);

  const experiments: Experiment[] = [
    {
      id: 'photoelectric',
      name: 'Фотоэлектрический эффект',
      description: 'Изучите, как свет выбивает электроны из металла. Открытие Эйнштейна!',
      energyCost: 20,
      requiredLevel: 1,
      icon: Lightbulb,
      color: 'quantum-yellow',
      knowledgeReward: '15-25',
      duration: 3
    },
    {
      id: 'double_slit',
      name: 'Опыт с двумя щелями',
      description: 'Демонстрация корпускулярно-волнового дуализма частиц.',
      energyCost: 30,
      requiredLevel: 2,
      icon: Waves,
      color: 'quantum-blue',
      knowledgeReward: '20-30',
      duration: 5
    },
    {
      id: 'particle_collision',
      name: 'Столкновение частиц',
      description: 'Исследуйте субатомные частицы в высокоэнергетических столкновениях.',
      energyCost: 40,
      requiredLevel: 3,
      icon: Atom,
      color: 'quantum-purple',
      knowledgeReward: '25-40',
      duration: 7
    },
    {
      id: 'quantum_entanglement',
      name: 'Квантовая запутанность',
      description: 'Изучите "жуткое действие на расстоянии" Эйнштейна.',
      energyCost: 50,
      requiredLevel: 4,
      icon: Zap,
      color: 'quantum-green',
      knowledgeReward: '30-50',
      duration: 10
    }
  ];

  const startExperiment = (experiment: Experiment) => {
    if (gameState.energy < experiment.energyCost) return;
    if (gameState.level < experiment.requiredLevel) return;

    setActiveExperiment(experiment.id);
    setExperimentProgress(0);

    // Simulate experiment progress
    const progressInterval = setInterval(() => {
      setExperimentProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setActiveExperiment(null);
          onConductExperiment(experiment.id, experiment.energyCost);
          return 0;
        }
        return prev + (100 / experiment.duration);
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
            <Zap className="w-8 h-8" />
            Экспериментальная Лаборатория
          </CardTitle>
          <p className="text-muted-foreground">
            Проводите эксперименты, чтобы получить знания и открыть новые явления физики
          </p>
        </CardHeader>
      </Card>

      {/* Active Experiment */}
      {activeExperiment && (
        <Card className="border-quantum-orange bg-gradient-to-r from-lab-surface to-quantum-orange/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Timer className="w-5 h-5 text-quantum-orange animate-pulse" />
              <span className="font-semibold">Эксперимент в процессе...</span>
            </div>
            <Progress value={experimentProgress} />
            <p className="text-sm text-muted-foreground mt-2">
              Прогресс: {Math.round(experimentProgress)}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiments.map((experiment) => {
          const Icon = experiment.icon;
          const isAvailable = gameState.level >= experiment.requiredLevel;
          const canAfford = gameState.energy >= experiment.energyCost;
          const isActive = activeExperiment === experiment.id;

          return (
            <Card 
              key={experiment.id}
              className={`${isAvailable ? 'energy-border' : 'border-lab-border'} 
                         ${isActive ? 'animate-energy-pulse' : ''} 
                         bg-card/90 transition-all hover:scale-105`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 text-${experiment.color}`} />
                    <div>
                      <CardTitle className="text-lg">{experiment.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {experiment.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={canAfford ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      {experiment.energyCost} энергии
                    </Badge>
                    <Badge 
                      variant={isAvailable ? "default" : "secondary"}
                      className={`text-${experiment.color}`}
                    >
                      Уровень {experiment.requiredLevel}
                    </Badge>
                    <Badge variant="outline">
                      {experiment.knowledgeReward} знаний
                    </Badge>
                  </div>

                  {!isAvailable && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Требуется {experiment.requiredLevel} уровень
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={() => startExperiment(experiment)}
                    disabled={!isAvailable || !canAfford || isActive || activeExperiment !== null}
                    className={`w-full bg-${experiment.color} hover:bg-${experiment.color}/80 text-black`}
                  >
                    {isActive ? 'Эксперимент идет...' : 'Начать эксперимент'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="bg-lab-surface/50 border-quantum-blue/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-quantum-blue mb-2">💡 Советы исследователя:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Энергия восстанавливается автоматически каждые 5 секунд</li>
            <li>• Более сложные эксперименты дают больше знаний</li>
            <li>• Повышайте уровень, чтобы разблокировать новые эксперименты</li>
            <li>• Каждый эксперимент основан на реальных научных открытиях</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperimentLab;
