
import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Zap, Lightbulb, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState([70]);
  const [effectsVolume, setEffectsVolume] = useState([80]);
  const [particleEffects, setParticleEffects] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [difficulty, setDifficulty] = useState('medium');

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-quantum-blue hover:text-quantum-blue/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад в главное меню
        </Button>

        <Card className="energy-border bg-card/90">
          <CardHeader>
            <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
              <Zap className="w-8 h-8" />
              Настройки Лаборатории
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Audio Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-quantum-green flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Аудио настройки
              </h3>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Звуковые эффекты</span>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Громкость музыки</span>
                    <span className="text-sm text-quantum-blue">{musicVolume[0]}%</span>
                  </div>
                  <Slider
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={!soundEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Громкость эффектов</span>
                    <span className="text-sm text-quantum-blue">{effectsVolume[0]}%</span>
                  </div>
                  <Slider
                    value={effectsVolume}
                    onValueChange={setEffectsVolume}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={!soundEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Graphics Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-quantum-purple flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Графические настройки
              </h3>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Эффекты частиц</span>
                  <Switch
                    checked={particleEffects}
                    onCheckedChange={setParticleEffects}
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-sm">Скорость анимации</span>
                  <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                    <SelectTrigger className="bg-lab-surface border-lab-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-lab-surface border-lab-border">
                      <SelectItem value="slow">Медленная</SelectItem>
                      <SelectItem value="normal">Нормальная</SelectItem>
                      <SelectItem value="fast">Быстрая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Game Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-quantum-orange flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Игровые настройки
              </h3>
              
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <span className="text-sm">Уровень сложности</span>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-lab-surface border-lab-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-lab-surface border-lab-border">
                      <SelectItem value="easy">Легкий (для новичков)</SelectItem>
                      <SelectItem value="medium">Средний (рекомендуется)</SelectItem>
                      <SelectItem value="hard">Сложный (для экспертов)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-lab-border">
              <Button
                className="w-full bg-quantum-green hover:bg-quantum-green/80 text-black font-semibold"
                onClick={() => {
                  // Here you would save settings to localStorage
                  console.log('Settings saved:', {
                    soundEnabled,
                    musicVolume: musicVolume[0],
                    effectsVolume: effectsVolume[0],
                    particleEffects,
                    animationSpeed,
                    difficulty
                  });
                }}
              >
                Сохранить настройки
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
