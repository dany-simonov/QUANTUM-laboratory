
import React from 'react';
import { Trophy, Star, Award, Target, Zap, Clock, BookOpen, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AchievementsPanelProps {
  gameState: any;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  unlocked: boolean;
  condition: string;
  hint?: string;
  category: 'experiments' | 'knowledge' | 'time' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  reward: number;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ gameState }) => {
  const achievements: Achievement[] = [
    // Легкие достижения (1-3 уровень)
    {
      id: 'first_experiment',
      name: 'Первый шаг в науке',
      description: 'Проведите свой первый эксперимент',
      icon: Star,
      unlocked: gameState.discoveries >= 1,
      condition: 'Проведите любой эксперимент',
      category: 'experiments',
      difficulty: 'easy',
      reward: 10
    },
    {
      id: 'energy_saver',
      name: 'Энергосберегающий',
      description: 'Накопите максимум энергии',
      icon: Zap,
      unlocked: gameState.energy >= gameState.maxEnergy,
      condition: 'Накопите максимум энергии',
      category: 'special',
      difficulty: 'easy',
      reward: 15
    },
    {
      id: 'knowledge_seeker',
      name: 'Искатель знаний',
      description: 'Наберите 100 очков знаний',
      icon: BookOpen,
      unlocked: gameState.knowledge >= 100,
      condition: 'Получите 100 знаний',
      category: 'knowledge',
      difficulty: 'easy',
      reward: 20
    },

    // Средние достижения (3-5 уровень)
    {
      id: 'experiment_master',
      name: 'Мастер экспериментов',
      description: 'Проведите 10 экспериментов',
      icon: Target,
      unlocked: gameState.discoveries >= 10,
      condition: 'Проведите 10 экспериментов',
      hint: gameState.level >= 3 ? 'Прогресс: ' + gameState.discoveries + '/10' : undefined,
      category: 'experiments',
      difficulty: 'medium',
      reward: 50
    },
    {
      id: 'time_traveler',
      name: 'Путешественник во времени',
      description: 'Проведите 10 минут в лаборатории',
      icon: Clock,
      unlocked: gameState.timeInLab >= 600,
      condition: 'Время в лаборатории: 10 минут',
      hint: gameState.level >= 3 ? 'Прогресс: ' + Math.floor(gameState.timeInLab / 60) + '/10 минут' : undefined,
      category: 'time',
      difficulty: 'medium',
      reward: 30
    },
    {
      id: 'level_up',
      name: 'Повышение квалификации',
      description: 'Достигните 5 уровня',
      icon: Award,
      unlocked: gameState.level >= 5,
      condition: 'Достигните 5 уровня',
      hint: gameState.level >= 3 ? 'Текущий уровень: ' + gameState.level + '/5' : undefined,
      category: 'knowledge',
      difficulty: 'medium',
      reward: 75
    },

    // Сложные достижения (5-7 уровень)
    {
      id: 'scientist',
      name: 'Настоящий ученый',
      description: 'Наберите 500 очков знаний',
      icon: Medal,
      unlocked: gameState.knowledge >= 500,
      condition: 'Получите 500 знаний',
      hint: gameState.level >= 5 ? 'Прогресс: ' + gameState.knowledge + '/500' : undefined,
      category: 'knowledge',
      difficulty: 'hard',
      reward: 100
    },
    {
      id: 'persistent',
      name: 'Настойчивый исследователь',
      description: 'Проведите 25 экспериментов',
      icon: Target,
      unlocked: gameState.discoveries >= 25,
      condition: 'Проведите 25 экспериментов',
      hint: gameState.level >= 5 ? 'Прогресс: ' + gameState.discoveries + '/25' : undefined,
      category: 'experiments',
      difficulty: 'hard',
      reward: 125
    },
    {
      id: 'marathon',
      name: 'Марафонец науки',
      description: 'Проведите 30 минут в лаборатории',
      icon: Clock,
      unlocked: gameState.timeInLab >= 1800,
      condition: 'Время в лаборатории: 30 минут',
      hint: gameState.level >= 5 ? 'Прогресс: ' + Math.floor(gameState.timeInLab / 60) + '/30 минут' : undefined,
      category: 'time',
      difficulty: 'hard',
      reward: 150
    },

    // Легендарные достижения (7+ уровень)
    {
      id: 'genius',
      name: 'Гений физики',
      description: 'Наберите 1000 очков знаний',
      icon: Trophy,
      unlocked: gameState.knowledge >= 1000,
      condition: 'Получите 1000 знаний',
      hint: gameState.level >= 7 ? 'Прогресс: ' + gameState.knowledge + '/1000' : undefined,
      category: 'knowledge',
      difficulty: 'legendary',
      reward: 200
    },
    {
      id: 'experimenter',
      name: 'Великий экспериментатор',
      description: 'Проведите 50 экспериментов',
      icon: Star,
      unlocked: gameState.discoveries >= 50,
      condition: 'Проведите 50 экспериментов',
      hint: gameState.level >= 7 ? 'Прогресс: ' + gameState.discoveries + '/50' : undefined,
      category: 'experiments',
      difficulty: 'legendary',
      reward: 250
    },
    {
      id: 'dedication',
      name: 'Преданность науке',
      description: 'Проведите 1 час в лаборатории',
      icon: Medal,
      unlocked: gameState.timeInLab >= 3600,
      condition: 'Время в лаборатории: 60 минут',
      hint: gameState.level >= 7 ? 'Прогресс: ' + Math.floor(gameState.timeInLab / 60) + '/60 минут' : undefined,
      category: 'time',
      difficulty: 'legendary',
      reward: 300
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-quantum-green';
      case 'medium': return 'text-quantum-yellow';
      case 'hard': return 'text-quantum-orange';
      case 'legendary': return 'text-quantum-purple';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкое';
      case 'medium': return 'Среднее';
      case 'hard': return 'Сложное';
      case 'legendary': return 'Легендарное';
      default: return 'Неизвестно';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'experiments': return 'Эксперименты';
      case 'knowledge': return 'Знания';
      case 'time': return 'Время';
      case 'special': return 'Особые';
      default: return 'Другое';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalRewards = unlockedAchievements.reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-purple flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            Достижения
          </CardTitle>
          <p className="text-muted-foreground">
            Выполняйте особые задания и получайте награды за свои успехи
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-green">
                {unlockedAchievements.length}
              </div>
              <div className="text-sm text-muted-foreground">
                из {achievements.length} достижений
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-blue">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                завершено
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-yellow">
                {totalRewards}
              </div>
              <div className="text-sm text-muted-foreground">
                бонусных знаний
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Общий прогресс</span>
              <span>{unlockedAchievements.length}/{achievements.length}</span>
            </div>
            <Progress value={(unlockedAchievements.length / achievements.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const shouldShowHint = achievement.hint && !achievement.unlocked;
          const isVisible = achievement.unlocked || 
                          (achievement.difficulty === 'easy') ||
                          (achievement.difficulty === 'medium' && gameState.level >= 3) ||
                          (achievement.difficulty === 'hard' && gameState.level >= 5) ||
                          (achievement.difficulty === 'legendary' && gameState.level >= 7);

          if (!isVisible) {
            return (
              <Card key={achievement.id} className="border-lab-border bg-card/50 opacity-50">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <h3 className="font-semibold text-muted-foreground">Заблокировано</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Достигните больших высот в науке
                  </p>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card 
              key={achievement.id}
              className={`${achievement.unlocked ? 'energy-border' : 'border-lab-border'} 
                         ${achievement.unlocked ? 'bg-gradient-to-br from-card to-quantum-green/5' : 'bg-card/90'}
                         transition-all hover:scale-105`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`w-8 h-8 ${achievement.unlocked ? 'text-quantum-green' : 'text-muted-foreground'}`} />
                  {achievement.unlocked && (
                    <Badge className="bg-quantum-green/20 text-quantum-green">
                      +{achievement.reward}
                    </Badge>
                  )}
                </div>
                
                <h3 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-quantum-green' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {achievement.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(achievement.difficulty)}
                    >
                      {getDifficultyName(achievement.difficulty)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(achievement.category)}
                    </Badge>
                  </div>

                  {shouldShowHint && (
                    <div className="text-xs text-quantum-blue bg-quantum-blue/10 p-2 rounded">
                      💡 {achievement.hint}
                    </div>
                  )}

                  {!achievement.unlocked && (
                    <div className="text-xs text-muted-foreground">
                      📋 {achievement.condition}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPanel;
