
import React, { useState, useEffect } from 'react';
import { Zap, Atom, Waves, Lightbulb, Timer, AlertCircle, Trophy, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentProgress, setExperimentProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

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
    },
    {
      id: 5,
      name: "Электромагнитные поля",
      description: "Изучите взаимодействие электричества и магнетизма",
      objective: "Проведите 2 эксперимента с электромагнетизмом",
      hint: "Электричество и магнетизм - две стороны одного явления",
      requiredExperiments: ['electromagnetic_induction', 'electromagnetic_induction'],
      reward: 200,
      unlocked: false,
      completed: false,
      facts: [
        "Максвелл объединил электричество и магнетизм в единую теорию",
        "Свет - это электромагнитная волна",
        "Электромагнитная индукция лежит в основе генераторов"
      ]
    },
    {
      id: 6,
      name: "Лазерные технологии",
      description: "Исследуйте когерентное излучение",
      objective: "Создайте лазерное излучение",
      hint: "Атомы можно заставить излучать свет в унисон",
      requiredExperiments: ['laser_emission'],
      reward: 250,
      unlocked: false,
      completed: false,
      facts: [
        "Лазер означает усиление света вынужденным излучением",
        "Первый лазер был создан в 1960 году",
        "Лазеры используются в медицине, связи и производстве"
      ]
    },
    {
      id: 7,
      name: "Сверхпроводимость",
      description: "Откройте мир нулевого сопротивления",
      objective: "Изучите сверхпроводящие материалы",
      hint: "При низких температурах материалы могут терять сопротивление",
      requiredExperiments: ['superconductivity'],
      reward: 300,
      unlocked: false,
      completed: false,
      facts: [
        "Сверхпроводимость открыта в 1911 году",
        "Сверхпроводники могут левитировать в магнитном поле",
        "Используются в МРТ и ускорителях частиц"
      ]
    },
    {
      id: 8,
      name: "Ядерные реакции",
      description: "Изучите превращения атомных ядер",
      objective: "Проведите управляемую ядерную реакцию",
      hint: "В ядре атома скрыта огромная энергия",
      requiredExperiments: ['nuclear_fission'],
      reward: 350,
      unlocked: false,
      completed: false,
      facts: [
        "Ядерная энергия в миллионы раз мощнее химической",
        "Первый ядерный реактор запущен в 1942 году",
        "Ядерная энергия может быть мирной и военной"
      ]
    },
    {
      id: 9,
      name: "Квантовые компьютеры",
      description: "Исследуйте вычисления на квантовых эффектах",
      objective: "Создайте простейший квантовый алгоритм",
      hint: "Квантовые биты могут быть в суперпозиции состояний",
      requiredExperiments: ['quantum_computing'],
      reward: 400,
      unlocked: false,
      completed: false,
      facts: [
        "Квантовые компьютеры используют суперпозицию и запутанность",
        "Могут решать некоторые задачи экспоненциально быстрее",
        "Первые коммерческие квантовые компьютеры уже существуют"
      ]
    },
    {
      id: 10,
      name: "Теория струн",
      description: "Изучите фундаментальную природу реальности",
      objective: "Исследуйте многомерные пространства",
      hint: "Возможно, все частицы - это вибрирующие струны",
      requiredExperiments: ['string_theory'],
      reward: 500,
      unlocked: false,
      completed: false,
      facts: [
        "Теория струн предполагает 11 измерений пространства-времени",
        "Пытается объединить все фундаментальные взаимодействия",
        "Пока не имеет экспериментального подтверждения"
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
    },
    {
      id: 'electromagnetic_induction',
      name: 'Электромагнитная индукция',
      description: 'Изучите генерацию электричества магнитными полями.',
      energyCost: 55,
      requiredLevel: 5,
      icon: Zap,
      color: 'quantum-orange',
      knowledgeReward: '40-60',
      duration: 6
    },
    {
      id: 'laser_emission',
      name: 'Лазерное излучение',
      description: 'Создайте когерентный пучок света.',
      energyCost: 65,
      requiredLevel: 6,
      icon: Lightbulb,
      color: 'quantum-red',
      knowledgeReward: '50-70',
      duration: 8
    },
    {
      id: 'superconductivity',
      name: 'Сверхпроводимость',
      description: 'Исследуйте материалы с нулевым сопротивлением.',
      energyCost: 75,
      requiredLevel: 7,
      icon: Zap,
      color: 'quantum-cyan',
      knowledgeReward: '60-80',
      duration: 9
    },
    {
      id: 'nuclear_fission',
      name: 'Ядерные реакции',
      description: 'Изучите деление атомных ядер.',
      energyCost: 85,
      requiredLevel: 8,
      icon: Atom,
      color: 'quantum-pink',
      knowledgeReward: '70-90',
      duration: 10
    },
    {
      id: 'quantum_computing',
      name: 'Квантовые вычисления',
      description: 'Создайте простейший квантовый алгоритм.',
      energyCost: 95,
      requiredLevel: 9,
      icon: Zap,
      color: 'quantum-violet',
      knowledgeReward: '80-100',
      duration: 11
    },
    {
      id: 'string_theory',
      name: 'Теория струн',
      description: 'Исследуйте фундаментальную природу реальности.',
      energyCost: 105,
      requiredLevel: 10,
      icon: Waves,
      color: 'quantum-gold',
      knowledgeReward: '90-110',
      duration: 12
    }
  ];

  // Update current level based on completed levels
  useEffect(() => {
    let nextLevel = 1;
    for (let i = 1; i <= 10; i++) {
      if ((gameState.completedLevels || []).includes(i)) {
        nextLevel = i + 1;
      } else {
        break;
      }
    }
    setCurrentLevel(Math.min(nextLevel, 10));
  }, [gameState.completedLevels]);

  // Check if current level is complete and update
  useEffect(() => {
    const currentLevelData = levels.find(level => level.id === currentLevel);
    if (currentLevelData && !(gameState.completedLevels || []).includes(currentLevel)) {
      const requiredCount = currentLevelData.requiredExperiments.length;
      const completedCount = (gameState.completedExperiments || []).filter(exp => 
        currentLevelData.requiredExperiments.includes(exp)
      ).length;
      
      if (completedCount >= requiredCount) {
        onCompleteLevel({
          level: currentLevel,
          reward: currentLevelData.reward,
          name: currentLevelData.name
        });
        
        toast({
          title: `🎉 Уровень ${currentLevel} завершен!`,
          description: `"${currentLevelData.name}" - Получено ${currentLevelData.reward} знаний!`,
        });
      }
    }
  }, [gameState.completedExperiments, currentLevel, onCompleteLevel, toast, gameState.completedLevels]);

  const getCurrentLevel = () => {
    return levels.find(level => level.id === currentLevel);
  };

  const startExperiment = (experiment: Experiment) => {
    if (gameState.energy < experiment.energyCost) {
      toast({
        title: "Недостаточно энергии!",
        description: "Подождите, пока энергия восстановится.",
        variant: "destructive"
      });
      return;
    }
    if (gameState.level < experiment.requiredLevel) {
      toast({
        title: "Уровень слишком низкий!",
        description: `Требуется ${experiment.requiredLevel} уровень.`,
        variant: "destructive"
      });
      return;
    }

    setActiveExperiment(experiment.id);
    setExperimentProgress(0);

    const progressInterval = setInterval(() => {
      setExperimentProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setActiveExperiment(null);
          
          const knowledge = Math.floor(Math.random() * 20) + 15;
          onConductExperiment(experiment.id, experiment.energyCost, knowledge);
          
          return 0;
        }
        return prev + (100 / experiment.duration);
      });
    }, 1000);
  };

  const currentLevelData = getCurrentLevel();
  const isLevelCompleted = (gameState.completedLevels || []).includes(currentLevel);

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
        <Card className={`${isLevelCompleted ? 'border-quantum-green bg-gradient-to-r from-lab-surface to-quantum-green/10' : 'border-quantum-yellow bg-gradient-to-r from-lab-surface to-quantum-yellow/10'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isLevelCompleted ? 'text-quantum-green' : 'text-white'} flex items-center gap-2`}>
              {isLevelCompleted ? <CheckCircle className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
              Уровень {currentLevel}: {currentLevelData.name}
              {isLevelCompleted && <Badge className="bg-quantum-green/20 text-quantum-green ml-2">Завершен!</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentLevelData.description}</p>
            
            <div className={`bg-lab-surface/50 p-4 rounded-lg border ${isLevelCompleted ? 'border-quantum-green/20' : 'border-quantum-yellow/20'}`}>
              <h4 className={`font-semibold ${isLevelCompleted ? 'text-quantum-green' : 'text-quantum-yellow'} mb-2`}>
                🎯 Задание:
              </h4>
              <p>{currentLevelData.objective}</p>
              {!isLevelCompleted && (
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">
                    Прогресс: {(gameState.completedExperiments || []).filter(exp => 
                      currentLevelData.requiredExperiments.includes(exp)
                    ).length} / {currentLevelData.requiredExperiments.length}
                  </div>
                  <Progress 
                    value={((gameState.completedExperiments || []).filter(exp => 
                      currentLevelData.requiredExperiments.includes(exp)
                    ).length / currentLevelData.requiredExperiments.length) * 100} 
                  />
                </div>
              )}
            </div>

            <div className="bg-lab-surface/50 p-4 rounded-lg border border-quantum-blue/20">
              <h4 className="font-semibold text-quantum-blue mb-2">💡 Подсказка:</h4>
              <p>{currentLevelData.hint}</p>
            </div>

            <div className="bg-lab-surface/50 p-4 rounded-lg border border-quantum-purple/20">
              <h4 className="font-semibold text-quantum-purple mb-2">🧠 Интересные факты:</h4>
              <ul className="text-sm space-y-1">
                {currentLevelData.facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-quantum-purple">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <Badge className={`${isLevelCompleted ? 'bg-quantum-green/20 text-quantum-green' : 'bg-quantum-orange/20 text-quantum-orange'}`}>
              {isLevelCompleted ? `✓ Получено: ${currentLevelData.reward} знаний` : `Награда: ${currentLevelData.reward} знаний`}
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
          const completedCount = (gameState.completedExperiments || []).filter(exp => exp === experiment.id).length;

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
                  {completedCount > 0 && (
                    <Badge variant="outline" className="text-quantum-green">
                      ✓ {completedCount}x
                    </Badge>
                  )}
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
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
