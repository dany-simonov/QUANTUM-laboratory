
import React, { useState, useEffect } from 'react';
import { Eye, Play, Pause, RotateCcw, Zap, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface OpticsSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

interface LightRay {
  x: number;
  y: number;
  angle: number;
  intensity: number;
  color: string;
  wavelength: number;
}

const OpticsSimulator: React.FC<OpticsSimulatorProps> = ({ gameState, onExperimentComplete }) => {
  const [lightRays, setLightRays] = useState<LightRay[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lensPosition, setLensPosition] = useState([300]);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [prismPosition, setPrismPosition] = useState([450]);
  const [refractionCount, setRefractionCount] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0);

  useEffect(() => {
    resetSimulation();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSimulationTime(prev => prev + 0.1);
      updateLightRays();
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, lensPosition, prismPosition, lensType]);

  const createLightRay = (x: number, y: number, angle: number, wavelength: number): LightRay => {
    const colors = {
      400: '#8B00FF', // Фиолетовый
      450: '#0000FF', // Синий
      500: '#00FF00', // Зеленый
      550: '#FFFF00', // Желтый
      600: '#FF8000', // Оранжевый
      650: '#FF0000', // Красный
    };
    
    const color = colors[wavelength as keyof typeof colors] || '#FFFFFF';
    
    return {
      x,
      y,
      angle,
      intensity: 1,
      color,
      wavelength
    };
  };

  const resetSimulation = () => {
    const newRays: LightRay[] = [];
    
    // Создаем разноцветные лучи света
    const wavelengths = [400, 450, 500, 550, 600, 650];
    wavelengths.forEach((wavelength, index) => {
      newRays.push(createLightRay(50, 150 + index * 20, 0, wavelength));
    });

    setLightRays(newRays);
    setRefractionCount(0);
    setSimulationTime(0);
    setIsRunning(false);
  };

  const updateLightRays = () => {
    setLightRays(prevRays => {
      return prevRays.map(ray => {
        let { x, y, angle, intensity } = ray;
        
        // Движение луча
        const speed = 5;
        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;

        // Взаимодействие с линзой
        if (Math.abs(x - lensPosition[0]) < 5 && y > 100 && y < 300) {
          if (lensType === 'convex') {
            // Собирающая линза
            const distanceFromCenter = y - 200;
            angle -= distanceFromCenter * 0.01;
          } else {
            // Рассеивающая линза
            const distanceFromCenter = y - 200;
            angle += distanceFromCenter * 0.01;
          }
          setRefractionCount(prev => prev + 1);
        }

        // Взаимодействие с призмой
        if (Math.abs(x - prismPosition[0]) < 10 && y > 120 && y < 280) {
          // Дисперсия в призме
          const dispersionFactor = (ray.wavelength - 500) * 0.0001;
          angle += dispersionFactor;
          setRefractionCount(prev => prev + 1);
        }

        // Границы области
        if (x > 580 || x < 0 || y > 320 || y < 80) {
          x = 50;
          y = 150 + Math.random() * 120;
          angle = 0;
          intensity = 1;
        }

        return { ...ray, x, y, angle, intensity };
      });
    });
  };

  const completeExperiment = () => {
    const knowledge = Math.floor(refractionCount * 2 + simulationTime * 0.5 + lightRays.length);
    onExperimentComplete(knowledge);
    resetSimulation();
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-yellow flex items-center gap-3">
            <Eye className="w-8 h-8" />
            Симулятор Оптики
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте преломление, дисперсию и поведение света
          </p>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Оптические элементы
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
                <label className="text-sm font-medium">🔍 Тип линзы</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => setLensType('convex')}
                    variant={lensType === 'convex' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Собирающая
                  </Button>
                  <Button
                    onClick={() => setLensType('concave')}
                    variant={lensType === 'concave' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Рассеивающая
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">📍 Позиция линзы</label>
                <Slider
                  value={lensPosition}
                  onValueChange={setLensPosition}
                  max={400}
                  min={200}
                  step={10}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-blue">Позиция: {lensPosition[0]}</span>
              </div>

              <div>
                <label className="text-sm font-medium">🔺 Позиция призмы</label>
                <Slider
                  value={prismPosition}
                  onValueChange={setPrismPosition}
                  max={500}
                  min={350}
                  step={10}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-purple">Позиция: {prismPosition[0]}</span>
              </div>
            </div>

            <Button 
              onClick={completeExperiment}
              className="w-full bg-quantum-yellow hover:bg-quantum-yellow/80 text-black"
              disabled={simulationTime < 5}
            >
              <Zap className="w-4 h-4 mr-2" />
              Завершить эксперимент
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Результаты наблюдений</CardTitle>
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
                <span className="text-sm text-muted-foreground">Преломления</span>
                <p className="text-lg font-semibold text-quantum-orange">
                  {refractionCount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Спектр света:</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>💡 Наблюдайте дисперсию света в призме</p>
              <p>🔍 Изучайте фокусировку в линзах</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Canvas */}
      <Card className="energy-border bg-card/90">
        <CardContent className="p-6">
          <div className="relative w-full h-80 bg-gradient-to-r from-slate-900 to-blue-900 rounded-lg border border-lab-border overflow-hidden">
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

              {/* Линза */}
              <g transform={`translate(${lensPosition[0]}, 200)`}>
                {lensType === 'convex' ? (
                  <path
                    d="M -5 -100 Q 0 -95 5 -100 L 5 100 Q 0 95 -5 100 Z"
                    fill="rgba(0, 212, 255, 0.3)"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  />
                ) : (
                  <path
                    d="M -5 -100 Q -10 -95 -5 -100 L -5 100 Q -10 95 -5 100 M 5 -100 Q 10 -95 5 -100 L 5 100 Q 10 95 5 100"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="2"
                  />
                )}
                <text x="0" y="-110" textAnchor="middle" fill="#00D4FF" fontSize="12">
                  {lensType === 'convex' ? 'Собирающая' : 'Рассеивающая'}
                </text>
              </g>

              {/* Призма */}
              <g transform={`translate(${prismPosition[0]}, 200)`}>
                <path
                  d="M -15 -80 L 15 -80 L 0 80 Z"
                  fill="rgba(157, 78, 221, 0.3)"
                  stroke="#9D4EDD"
                  strokeWidth="2"
                />
                <text x="0" y="-90" textAnchor="middle" fill="#9D4EDD" fontSize="12">
                  Призма
                </text>
              </g>

              {/* Лучи света */}
              {lightRays.map((ray, index) => (
                <g key={index}>
                  <line
                    x1={ray.x - Math.cos(ray.angle) * 30}
                    y1={ray.y - Math.sin(ray.angle) * 30}
                    x2={ray.x}
                    y2={ray.y}
                    stroke={ray.color}
                    strokeWidth="3"
                    opacity={ray.intensity}
                    filter="url(#glow)"
                  />
                  <circle
                    cx={ray.x}
                    cy={ray.y}
                    r="2"
                    fill={ray.color}
                    filter="url(#glow)"
                  />
                </g>
              ))}

              {/* Источник света */}
              <g transform="translate(30, 200)">
                <circle cx="0" cy="0" r="8" fill="#FFD700" filter="url(#glow)" />
                <text x="0" y="20" textAnchor="middle" fill="#FFD700" fontSize="10">
                  Источник
                </text>
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpticsSimulator;
