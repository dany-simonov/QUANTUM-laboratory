
import React, { useState, useEffect } from 'react';
import { Waves, Play, Pause, RotateCcw, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface WaveSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const WaveSimulator: React.FC<WaveSimulatorProps> = ({ gameState, onExperimentComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState([2]);
  const [amplitude, setAmplitude] = useState([50]);
  const [waveSpeed, setWaveSpeed] = useState([3]);
  const [showInterference, setShowInterference] = useState(false);
  const [time, setTime] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0);
  const [waveInteractions, setWaveInteractions] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 0.1);
      setSimulationTime(prev => prev + 0.1);
      
      if (showInterference && Math.sin(time) > 0.9) {
        setWaveInteractions(prev => prev + 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, time, showInterference]);

  const resetSimulation = () => {
    setTime(0);
    setSimulationTime(0);
    setWaveInteractions(0);
    setIsRunning(false);
  };

  const generateWavePoints = (phase: number = 0) => {
    const points = [];
    for (let x = 0; x < 600; x += 5) {
      const y = amplitude[0] * Math.sin((x * frequency[0] * 0.01) + (time * waveSpeed[0]) + phase) + 150;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const completeExperiment = () => {
    const knowledge = Math.floor(waveInteractions * 3 + simulationTime * 1 + frequency[0] + amplitude[0] * 0.1);
    onExperimentComplete(knowledge);
    resetSimulation();
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-green flex items-center gap-3">
            <Waves className="w-8 h-8" />
            Симулятор Волн
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте волновые явления: интерференцию, частоту и амплитуду
          </p>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Параметры волн
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                className="flex-1"
              >
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Пауза' : 'Запуск'}
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  📊 Частота
                </label>
                <Slider
                  value={frequency}
                  onValueChange={setFrequency}
                  max={8}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-blue">
                  {frequency[0].toFixed(1)} Гц
                </span>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  📏 Амплитуда
                </label>
                <Slider
                  value={amplitude}
                  onValueChange={setAmplitude}
                  max={80}
                  min={10}
                  step={5}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-green">
                  {amplitude[0]} пикселей
                </span>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  ⚡ Скорость волны
                </label>
                <Slider
                  value={waveSpeed}
                  onValueChange={setWaveSpeed}
                  max={6}
                  min={1}
                  step={0.2}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-purple">
                  {waveSpeed[0].toFixed(1)} ед/с
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowInterference(!showInterference)}
                variant={showInterference ? 'default' : 'outline'}
                size="sm"
              >
                {showInterference ? '✓' : '○'} Интерференция
              </Button>
            </div>

            <Button 
              onClick={completeExperiment}
              className="w-full bg-quantum-green hover:bg-quantum-green/80 text-black"
              disabled={simulationTime < 4}
            >
              <Zap className="w-4 h-4 mr-2" />
              Завершить эксперимент
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Измерения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Время</span>
                <p className="text-lg font-semibold text-quantum-blue">
                  {simulationTime.toFixed(1)}с
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Взаимодействия</span>
                <p className="text-lg font-semibold text-quantum-orange">
                  {waveInteractions}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Длина волны:</span>
                <span className="text-quantum-purple">
                  {(waveSpeed[0] / frequency[0]).toFixed(1)} ед
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Период:</span>
                <span className="text-quantum-blue">
                  {(1 / frequency[0]).toFixed(2)} с
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Энергия:</span>
                <span className="text-quantum-yellow">
                  {(amplitude[0] * frequency[0]).toFixed(0)} ед
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>🌊 Наблюдайте изменения формы волны</p>
              <p>⚡ Экспериментируйте с параметрами</p>
              <p>🔬 Изучайте волновые свойства</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wave Visualization */}
      <Card className="energy-border bg-card/90">
        <CardContent className="p-6">
          <div className="relative w-full h-80 bg-gradient-to-b from-slate-900 to-blue-900 rounded-lg border border-lab-border overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Grid */}
              <defs>
                <pattern id="waveGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waveGrid)" />

              {/* Center line */}
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="5,5" />

              {/* Primary wave */}
              <polyline
                points={generateWavePoints()}
                fill="none"
                stroke="#00F5A0"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Secondary wave for interference */}
              {showInterference && (
                <polyline
                  points={generateWavePoints(Math.PI / 3)}
                  fill="none"
                  stroke="#FF4444"
                  strokeWidth="2"
                  opacity="0.7"
                  filter="url(#glow)"
                />
              )}

              {/* Wave source indicator */}
              <circle
                cx="30"
                cy="150"
                r="8"
                fill="#FFD700"
                filter="url(#glow)"
              >
                <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
              </circle>
              
              <text x="30" y="170" textAnchor="middle" fill="#FFD700" fontSize="10">
                Источник
              </text>

              {/* Amplitude indicator */}
              <line 
                x1="100" 
                y1={150 - amplitude[0]} 
                x2="100" 
                y2={150 + amplitude[0]} 
                stroke="#9D4EDD" 
                strokeWidth="2"
                opacity="0.6"
              />
              <text x="110" y="150" fill="#9D4EDD" fontSize="10">
                A = {amplitude[0]}
              </text>

              {/* Frequency indicator */}
              <text x="500" y="30" fill="#00D4FF" fontSize="12">
                f = {frequency[0].toFixed(1)} Гц
              </text>
              <text x="500" y="50" fill="#00F5A0" fontSize="12">
                v = {waveSpeed[0].toFixed(1)} ед/с
              </text>
              
              {showInterference && (
                <text x="400" y="30" fill="#FF4444" fontSize="12">
                  Интерференция
                </text>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaveSimulator;
