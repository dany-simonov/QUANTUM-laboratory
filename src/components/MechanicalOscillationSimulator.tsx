
import React, { useState } from 'react';
import { Timer, RotateCcw, Play, Pause, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MechanicalOscillationSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const MechanicalOscillationSimulator: React.FC<MechanicalOscillationSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [length, setLength] = useState([100]);
  const [amplitude, setAmplitude] = useState([50]);
  const [oscillatorType, setOscillatorType] = useState<'pendulum' | 'spring'>('pendulum');
  const [isOscillating, setIsOscillating] = useState(false);
  const [experimentCount, setExperimentCount] = useState(0);
  const [time, setTime] = useState(0);

  const gravity = 9.81;
  const period = oscillatorType === 'pendulum' 
    ? 2 * Math.PI * Math.sqrt(length[0] / 100 / gravity)
    : 2 * Math.PI * Math.sqrt(length[0] / 1000);
  
  const frequency = 1 / period;

  const startOscillation = () => {
    setIsOscillating(true);
    setExperimentCount(prev => prev + 1);
    setTime(0);
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsOscillating(false);
          const knowledge = Math.floor(Math.random() * 12) + 8;
          onExperimentComplete(knowledge);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const stopOscillation = () => {
    setIsOscillating(false);
    setTime(0);
  };

  const resetSimulation = () => {
    setLength([100]);
    setAmplitude([50]);
    setOscillatorType('pendulum');
    setIsOscillating(false);
    setTime(0);
  };

  const currentPosition = isOscillating 
    ? amplitude[0] * Math.cos(2 * Math.PI * frequency * time)
    : 0;

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-green flex items-center gap-3">
            <Timer className="w-8 h-8" />
            Симулятор Механических Колебаний
          </CardTitle>
          <p className="text-muted-foreground">
            Моделируйте движение маятников и пружинных систем
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Параметры колебаний</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Тип осциллятора
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setOscillatorType('pendulum')}
                  variant={oscillatorType === 'pendulum' ? 'default' : 'outline'}
                  size="sm"
                >
                  Маятник
                </Button>
                <Button
                  onClick={() => setOscillatorType('spring')}
                  variant={oscillatorType === 'spring' ? 'default' : 'outline'}
                  size="sm"
                >
                  Пружина
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                {oscillatorType === 'pendulum' ? 'Длина нити' : 'Жесткость пружины'}: {length[0]} {oscillatorType === 'pendulum' ? 'см' : 'Н/м'}
              </label>
              <Slider
                value={length}
                onValueChange={setLength}
                min={oscillatorType === 'pendulum' ? 50 : 50}
                max={oscillatorType === 'pendulum' ? 200 : 500}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Амплитуда: {amplitude[0]} {oscillatorType === 'pendulum' ? '°' : 'см'}
              </label>
              <Slider
                value={amplitude}
                onValueChange={setAmplitude}
                min={10}
                max={oscillatorType === 'pendulum' ? 90 : 100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isOscillating ? stopOscillation : startOscillation}
                className="flex-1 bg-quantum-purple hover:bg-quantum-purple/80"
              >
                {isOscillating ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Запустить
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
            <CardTitle className="text-lg">Колебательная система</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Oscillator Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border h-48 flex items-center justify-center">
              <div className="text-center">
                {oscillatorType === 'pendulum' ? (
                  <div>
                    <div className="text-4xl mb-2" style={{
                      transform: `rotate(${currentPosition}deg)`,
                      transition: isOscillating ? 'none' : 'transform 0.3s'
                    }}>
                      🏀
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Угол: {currentPosition.toFixed(1)}°
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2" style={{
                      transform: `translateY(${currentPosition / 5}px)`,
                      transition: isOscillating ? 'none' : 'transform 0.3s'
                    }}>
                      🟦
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Смещение: {currentPosition.toFixed(1)} см
                    </div>
                  </div>
                )}
                
                {isOscillating && (
                  <div className="mt-2 text-quantum-green">
                    Время: {time.toFixed(1)}с
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-blue/10 p-3 rounded border border-quantum-blue/20">
                <div className="text-sm text-quantum-blue">Период</div>
                <div className="text-lg font-semibold">
                  {period.toFixed(2)} с
                </div>
              </div>
              <div className="bg-quantum-orange/10 p-3 rounded border border-quantum-orange/20">
                <div className="text-sm text-quantum-orange">Частота</div>
                <div className="text-lg font-semibold">
                  {frequency.toFixed(2)} Гц
                </div>
              </div>
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-green/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-green" />
                  <span className="text-sm font-semibold">Формулы</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {oscillatorType === 'pendulum' ? (
                    <p>T = 2π√(L/g) = 2π√({length[0]}/981) = {period.toFixed(2)} с</p>
                  ) : (
                    <p>T = 2π√(m/k) ≈ 2π√({length[0]}/1000) = {period.toFixed(2)} с</p>
                  )}
                  <p>f = 1/T = {frequency.toFixed(2)} Гц</p>
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
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-purple/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Маятник Фуко</h4>
              <p className="text-muted-foreground">
                Доказывает вращение Земли - плоскость колебаний остается неизменной в пространстве
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Резонанс</h4>
              <p className="text-muted-foreground">
                При совпадении частот внешней силы и собственных колебаний амплитуда резко возрастает
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Период маятника</h4>
              <p className="text-muted-foreground">
                Не зависит от массы груза, только от длины нити и ускорения свободного падения
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Закон Гука</h4>
              <p className="text-muted-foreground">
                Сила упругости пропорциональна деформации: F = -kx
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MechanicalOscillationSimulator;
