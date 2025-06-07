
import React from 'react';
import { Trophy, Star, Lock, Zap, Atom, Book, Target } from 'lucide-react';
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
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
  unlockLevel: number;
  showHint: boolean;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ gameState }) => {
  const achievements: Achievement[] = [
    {
      id: 'first_experiment',
      name: 'Первый исследователь',
      description: 'Проведите ваш первый эксперимент',
      icon: Target,
      color: 'quantum-blue',
      unlocked: gameState.discoveries > 0,
      progress: Math.min(gameState.discoveries, 1),
      maxProgress: 1,
      reward: '+50 знаний',
      unlockLevel: 1,
      showHint: gameState.level >= 1
    },
    {
      id: 'energy_master',
      name: 'Мастер энергии',
      description: 'Достигните 100% энергии',
      icon: Zap,
      color: 'quantum-yellow',
      unlocked: gameState.energy >= 100,
      progress: gameState.energy,
      maxProgress: 100,
      reward: '+25 знаний',
      unlockLevel: 1,
      showHint: gameState.level >= 1
    },
    {
      id: 'knowledge_seeker',
      name: 'Искатель знаний',
      description: 'Накопите 500 знаний',
      icon: Book,
      color: 'quantum-purple',
      unlocked: gameState.knowledge >= 500,
      progress: Math.min(gameState.knowledge, 500),
      maxProgress: 500,
      reward: '+100 знаний, разблокировка ученого',
      unlockLevel: 2,
      showHint: gameState.level >= 2
    },
    {
      id: 'particle_hunter',
      name: 'Охотник за частицами',
      description: 'Проведите 10 экспериментов в симуляторе частиц',
      icon: Atom,
      color: 'quantum-green',
      unlocked: false, // Будет обновляться из игрового состояния
      progress: 0, // Будет обновляться
      maxProgress: 10,
      reward: '+150 знаний, новый симулятор',
      unlockLevel: 3,
      showHint: gameState.level >= 3
    },
    {
      id: 'einstein_fan',
      name: 'Поклонник Эйнштейна',
      description: 'Изучите биографию Альберта Эйнштейна',
      icon: Star,
      color: 'quantum-orange',
      unlocked: gameState.unlockedScientists.includes('Einstein'),
      progress: gameState.unlockedScientists.includes('Einstein') ? 1 : 0,
      maxProgress: 1,
      reward: '+75 знаний',
      unlockLevel: 1,
      showHint: gameState.level >= 1
    },
    {
      id: 'speed_researcher',
      name: 'Скоростной исследователь',
      description: 'Проведите 5 экспериментов за 3 минуты',
      icon: Zap,
      color: 'quantum-blue',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      reward: '+200 знаний, ускорение энергии',
      unlockLevel: 2,
      showHint: gameState.level >= 2
    },
    {
      id: 'russian_science',
      name: 'Российская наука',
      description: 'Изучите всех российских ученых',
      icon: Book,
      color: 'quantum-green',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      reward: '+300 знаний, особый титул',
      unlockLevel: 5,
      showHint: gameState.level >= 3
    },
    {
      id: 'level_master',
      name: 'Мастер уровней',
      description: 'Достигните 5-го уровня',
      icon: Trophy,
      color: 'quantum-yellow',
      unlocked: gameState.level >= 5,
      progress: Math.min(gameState.level, 5),
      maxProgress: 5,
      reward: '+500 знаний, все симуляторы',
      unlockLevel: 4,
      showHint: gameState.level >= 4
    },
    {
      id: 'time_traveler',
      name: 'Путешественник во времени',
      description: 'Проведите в лаборатории 1 час',
      icon: Target,
      color: 'quantum-purple',
      unlocked: gameState.timeInLab >= 3600,
      progress: Math.min(gameState.timeInLab, 3600),
      maxProgress: 3600,
      reward: '+250 знаний',
      unlockLevel: 2,
      showHint: gameState.level >= 2
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const availableAchievements = achievements.filter(a => !a.unlocked && a.showHint);
  const lockedAchievements = achievements.filter(a => !a.unlocked && !a.showHint);

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-orange flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            Достижения
          </CardTitle>
          <p className="text-muted-foreground">
            Ваш прогресс в изучении физики
          </p>
          <div className="flex gap-4 text-sm">
            <span className="text-quantum-green">
              ✓ Получено: {unlockedAchievements.length}
            </span>
            <span className="text-quantum-blue">
              🎯 Доступно: {availableAchievements.length}
            </span>
            <span className="text-muted-foreground">
              🔒 Заблокировано: {lockedAchievements.length}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-quantum-green flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Полученные достижения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className="border-quantum-green bg-gradient-to-r from-quantum-green/10 to-card/90">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-${achievement.color}/20`}>
                        <Icon className={`w-6 h-6 text-${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-quantum-green">
                          ✓ {achievement.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <Badge variant="outline" className="text-quantum-green border-quantum-green">
                          {achievement.reward}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Achievements */}
      {availableAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-quantum-blue flex items-center gap-2">
            <Target className="w-5 h-5" />
            Доступные достижения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAchievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <Card key={achievement.id} className="border-quantum-blue bg-card/90">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-${achievement.color}/20`}>
                        <Icon className={`w-6 h-6 text-${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-2">
                          <Progress value={progressPercent} />
                          <div className="flex justify-between text-xs">
                            <span>{achievement.progress} / {achievement.maxProgress}</span>
                            <span>{Math.round(progressPercent)}%</span>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="mt-2">
                          {achievement.reward}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Заблокированные достижения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-lab-border bg-card/50 opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-lab-surface">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-muted-foreground">???</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Достижение заблокировано
                      </p>
                      <Badge variant="secondary">
                        Уровень {achievement.unlockLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
