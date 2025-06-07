
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Zap, Lightbulb, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SettingsScreenProps {
  onBack: () => void;
}

interface Settings {
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  particleEffects: boolean;
  animationSpeed: string;
  difficulty: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('quantumLabSettings');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      musicVolume: 70,
      effectsVolume: 80,
      particleEffects: true,
      animationSpeed: 'normal',
      difficulty: 'medium'
    };
  });

  // Sound effects and music setup
  useEffect(() => {
    // Background ambient music
    if (settings.soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Very subtle ambient tone
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(settings.musicVolume / 1000, audioContext.currentTime); // Very quiet
      
      oscillator.start();
      
      return () => {
        oscillator.stop();
        audioContext.close();
      };
    }
  }, [settings.soundEnabled, settings.musicVolume]);

  const playClickSound = () => {
    if (!settings.soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(settings.effectsVolume / 1000, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
    
    setTimeout(() => audioContext.close(), 200);
  };

  const saveSettings = () => {
    localStorage.setItem('quantumLabSettings', JSON.stringify(settings));
    playClickSound();
    toast({
      title: "Настройки сохранены! ✨",
      description: "Все изменения применены успешно.",
    });
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    playClickSound();
  };

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => {
            playClickSound();
            onBack();
          }}
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
                    checked={settings.soundEnabled}
                    onCheckedChange={(value) => updateSetting('soundEnabled', value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Громкость музыки</span>
                    <span className="text-sm text-quantum-blue">{settings.musicVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.musicVolume]}
                    onValueChange={([value]) => updateSetting('musicVolume', value)}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={!settings.soundEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Громкость эффектов</span>
                    <span className="text-sm text-quantum-blue">{settings.effectsVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.effectsVolume]}
                    onValueChange={([value]) => updateSetting('effectsVolume', value)}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={!settings.soundEnabled}
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
                    checked={settings.particleEffects}
                    onCheckedChange={(value) => updateSetting('particleEffects', value)}
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-sm">Скорость анимации</span>
                  <Select value={settings.animationSpeed} onValueChange={(value) => updateSetting('animationSpeed', value)}>
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
                  <Select value={settings.difficulty} onValueChange={(value) => updateSetting('difficulty', value)}>
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
                onClick={saveSettings}
                className="w-full bg-quantum-green hover:bg-quantum-green/80 text-black font-semibold"
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
