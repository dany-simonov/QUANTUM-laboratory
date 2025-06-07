import React, { useState } from 'react';
import { Zap, Atom, Waves, Lightbulb, Timer, AlertCircle, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExperimentLabProps {
  gameState: any;
  onConductExperiment: (type: string, energyCost: number, knowledge: number) => void;
  onCompleteLevel: (levelData: any) => void;
}

interface Level {
  id: number;
  name: string;
  description: string;
  objective: string;
  hint: string;
  requiredExperiments: string[];
  reward: number;
  unlocked: boolean;
  completed: boolean;
  facts: string[];
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

const ExperimentLab: React.FC<ExperimentLabProps> = ({ gameState, onConductExperiment, onCompleteLevel }) => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentProgress, setExperimentProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);

  const levels: Level[] = [
    {
      id: 1,
      name: "Первые шаги в физике",
      description: "Изучите основы фотоэлектрического эффекта",
      objective: "Проведите эксперимент с фотоэлектрическим эффектом",
      hint: "Свет может выбивать электроны из металла!",
      requiredExperiments: ['photoelectric'],
      reward: 50,
      unlocked: true,
      completed: false,
      facts: [
        "Фотоэлектрический эффект был объяснен Эйнштейном в 1905 году",
        "За это открытие он получил Нобелевскую премию в 1921 году",
        "Этот эффект лежит в основе работы солнечных батарей"
      ]
    },
    {
      id: 2,
      name: "Волны и частицы",
      description: "Изучите корпускулярно-волновой дуализм",
      objective: "Проведите опыт с двумя щелями",
      hint: "Частицы могут вести себя как волны!",
      requiredExperiments: ['double_slit'],
      reward: 75,
      unlocked: false,
      completed: false,
      facts: [
        "Опыт Юнга доказал волновую природу света",
        "Электроны тоже проявляют волновые свойства",
        "Наблюдение влияет на поведение частиц"
      ]
    },
    {
      id: 3,
      name: "Столкновения частиц",
      description: "Исследуйте субатомный мир",
      objective: "Проведите 3 эксперимента по столкновению частиц",
      hint: "Высокие энергии раскрывают секреты материи",
      requiredExperiments: ['particle_collision', 'particle_collision', 'particle_collision'],
      reward: 100,
      unlocked: false,
      completed: false,
      facts: [
        "Большой адронный коллайдер - самый мощный ускоритель в мире",
        "При столкновениях рождаются новые частицы",
        "Так был открыт бозон Хиггса в 2012 году"
      ]
    },
    {
      id: 4,
      name: "Квантовая запутанность",
      description: "Изучите самое странное явление в физике",
      objective: "Проведите эксперимент с квантовой запутанностью",
      hint: 'Эйнштейн называл это "жутким действием на расстоянии"',
      requiredExperiments: ['quantum_entanglement'],
      reward: 150,
      unlocked: false,
      completed: false,
      facts: [
        "Запутанные частицы связаны мгновенно на любом расстоянии",
        "Это основа квантовых компьютеров и криптографии",
        "Эксперименты Белла подтвердили реальность запутанности"
      ]
    }
  ];

  const experiments: Experiment[] = [
    {
      id: 'photoelectric',
      name: 'Фотоэлектрический эффект',
      description: 'Изучите, как свет выбивает электроны из металла. Открытие Эйнштейна!',
      energyCost: 15,
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
      energyCost: 25,
      requiredLevel: 2,
      icon: Waves,
      color: 'quantum-blue',
      knowledgeReward: '20-30',
      duration: 4
    },
    {
      id: 'particle_collision',
      name: 'Столкновение частиц',
      description: 'Исследуйте субатомные частицы в высокоэнергетических столкновениях.',
      energyCost: 35,
      requiredLevel: 3,
      icon: Atom,
      color: 'quantum-purple',
      knowledgeReward: '25-40',
      duration: 5
    },
    {
      id: 'quantum_entanglement',
      name: 'Квантовая запутанность',
      description: 'Изучите "жуткое действие на расстоянии" Эйнштейна.',
      energyCost: 45,
      requiredLevel: 4,
      icon: Zap,
      color: 'quantum-green',
      knowledgeReward: '30-50',
      duration: 7
    }
  ];

  const getCurrentLevel = () => {
    return levels.find(level => level.id === currentLevel);
  };

  const startExperiment = (experiment: Experiment) => {
    if (gameState.energy < experiment.energyCost) return;
    if (gameState.level < experiment.requiredLevel) return;

    setActiveExperiment(experiment.id);
    setExperimentProgress(0);

    const progressInterval = setInterval(() => {
      setExperimentProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setActiveExperiment(null);
          
          const knowledge = Math.floor(Math.random() * 20) + 15;
          onConductExperiment(experiment.id, experiment.energyCost, knowledge);
          
          // Check level completion
          const newCompleted = [...completedExperiments, experiment.id];
          setCompletedExperiments(newCompleted);
          
          const currentLevelData = getCurrentLevel();
          if (currentLevelData && !currentLevelData.completed) {
            const requiredCount = currentLevelData.requiredExperiments.length;
            const completedCount = newCompleted.filter(exp => 
              currentLevelData.requiredExperiments.includes(exp)
            ).length;
            
            if (completedCount >= requiredCount) {
              onCompleteLevel({
                level: currentLevel,
                reward: currentLevelData.reward,
                name: currentLevelData.name
              });
              setCurrentLevel(prev => prev + 1);
            }
          }
          
          return 0;
        }
        return prev + (100 / experiment.duration);
      });
    }, 1000);
  };

  const currentLevelData = getCurrentLevel();

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
            <Target className="w-8 h-8" />
            Экспериментальная Лаборатория
          </CardTitle>
          <p className="text-muted-foreground">
            Проводите эксперименты, выполняйте задания и изучайте физику
          </p>
        </CardHeader>
      </Card>

      {/* Current Level */}
      {currentLevelData && (
        <Card className="border-quantum-green bg-gradient-to-r from-lab-surface to-quantum-green/10">
          <CardHeader>
            <CardTitle className="text-lg text-quantum-green flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Уровень {currentLevel}: {currentLevelData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentLevelData.description}</p>
            
            <div className="bg-lab-surface/50 p-4 rounded-lg border border-quantum-green/20">
              <h4 className="font-semibold text-quantum-green mb-2">🎯 Задание:</h4>
              <p>{currentLevelData.objective}</p>
            </div>

            <div className="bg-lab-surface/50 p-4 rounded-lg border border-quantum-yellow/20">
              <h4 className="font-semibold text-quantum-yellow mb-2">💡 Подсказка:</h4>
              <p>{currentLevelData.hint}</p>
            </div>

            <div className="bg-lab-surface/50 p-4 rounded-lg border border-quantum-blue/20">
              <h4 className="font-semibold text-quantum-blue mb-2">🧠 Интересные факты:</h4>
              <ul className="text-sm space-y-1">
                {currentLevelData.facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-quantum-blue">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <Badge className="bg-quantum-green/20 text-quantum-green">
              Награда: {currentLevelData.reward} знаний
            </Badge>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};

export default ExperimentLab;
