
import React, { useState } from 'react';
import { Volume2, RotateCcw, Play, Pause, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface SoundWaveSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const SoundWaveSimulator: React.FC<SoundWaveSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [frequency, setFrequency] = useState([440]);
  const [amplitude, setAmplitude] = useState([50]);
  const [medium, setMedium] = useState<'air' | 'water' | 'steel'>('air');
  const [isPlaying, setIsPlaying] = useState(false);
  const [experimentCount, setExperimentCount] = useState(0);
  const [time, setTime] = useState(0);

  const mediumProperties = {
    air: { speed: 343, density: 1.21, name: 'Воздух' },
    water: { speed: 1482, density: 1000, name: 'Вода' },
    steel: { speed: 5960, density: 7850, name: 'Сталь' }
  };

  const wavelength = mediumProperties[medium].speed / frequency[0];
  const period = 1 / frequency[0];

  const startSimulation = () => {
    setIsPlaying(true);
    setExperimentCount(prev => prev + 1);
    setTime(0);
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsPlaying(false);
          const knowledge = Math.floor(Math.random() * 14) + 11;
          onExperimentComplete(knowledge);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const resetSimulation = () => {
    setFrequency([440]);
    setAmplitude([50]);
    setMedium('air');
    setIsPlaying(false);
    setTime(0);
  };

  const getFrequencyNote = (freq: number) => {
    if (freq < 100) return 'Низкий тон';
    if (freq < 500) return 'Средний тон';
    if (freq < 2000) return 'Высокий тон';
    return 'Очень высокий тон';
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
            <Volume2 className="w-8 h-8" />
            Симулятор Звуковых Волн
          </CardTitle>
          <p className="text-muted-foreground">
            Демонстрация распространения звуковых волн и акустических явлений
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Параметры звука</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Среда распространения
              </label>
              <div className="flex gap-2">
                {Object.entries(mediumProperties).map(([key, props]) => (
                  <Button
                    key={key}
                    onClick={() => setMedium(key as any)}
                    variant={medium === key ? 'default' : 'outline'}
                    size="sm"
                  >
                    {props.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Частота: {frequency[0]} Гц ({getFrequencyNote(frequency[0])})
              </label>
              <Slider
                value={frequency}
                onValueChange={setFrequency}
                min={50}
                max={5000}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Амплитуда: {amplitude[0]}%
              </label>
              <Slider
                value={amplitude}
                onValueChange={setAmplitude}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isPlaying ? stopSimulation : startSimulation}
                className="flex-1 bg-quantum-blue hover:bg-quantum-blue/80"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Воспроизвести
                  </>
                )}
              </Button>
              <Button
                onClick={resetSimulation}
                variant="outline"
                size="icon"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization & Results */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Звуковая волна</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wave Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border h-48 flex items-center justify-center">
              <div className="text-center w-full">
                {/* Simple wave visualization */}
                <div className="mb-4">
                  <svg width="100%" height="80" viewBox="0 0 300 80">
                    <path
                      d={`M 0 40 ${Array.from({length: 30}, (_, i) => {
                        const x = i * 10;
                        const y = 40 + (amplitude[0] / 3) * Math.sin((x / 300) * 2 * Math.PI * 3 + (isPlaying ? time * frequency[0] / 100 : 0));
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {mediumProperties[medium].name}
                </div>
                
                {isPlaying && (
                  <div className="mt-2">
                    <div className="text-quantum-blue animate-pulse">
                      🔊 Волны распространяются...
                    </div>
                    <div className="text-sm">Время: {time.toFixed(1)}с</div>
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-green/10 p-3 rounded border border-quantum-green/20">
                <div className="text-sm text-quantum-green">Длина волны</div>
                <div className="text-lg font-semibold">
                  {wavelength.toFixed(2)} м
                </div>
              </div>
              <div className="bg-quantum-purple/10 p-3 rounded border border-quantum-purple/20">
                <div className="text-sm text-quantum-purple">Период</div>
                <div className="text-lg font-semibold">
                  {(period * 1000).toFixed(2)} мс
                </div>
              </div>
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-blue/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-blue" />
                  <span className="text-sm font-semibold">Основные формулы</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>λ = v/f = {mediumProperties[medium].speed}/{frequency[0]} = {wavelength.toFixed(2)} м</p>
                  <p>T = 1/f = 1/{frequency[0]} = {(period * 1000).toFixed(2)} мс</p>
                  <p>Скорость в {mediumProperties[medium].name}: {mediumProperties[medium].speed} м/с</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center text-sm">
              <span>Экспериментов проведено:</span>
              <Badge>{experimentCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Facts */}
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-blue/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Эффект Доплера</h4>
              <p className="text-muted-foreground">
                Частота звука изменяется при движении источника или наблюдателя
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Резонанс</h4>
              <p className="text-muted-foreground">
                При совпадении частот возникает усиление звука
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Интерференция</h4>
              <p className="text-muted-foreground">
                Наложение волн может усиливать или ослаблять звук
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Скорость звука</h4>
              <p className="text-muted-foreground">
                В твердых телах звук распространяется быстрее, чем в газах
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoundWaveSimulator;
