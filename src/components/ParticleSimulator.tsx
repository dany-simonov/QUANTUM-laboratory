
import React, { useState, useEffect } from 'react';
import { Atom, Play, Pause, RotateCcw, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface ParticleSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'proton' | 'electron' | 'neutron';
  color: string;
}

const ParticleSimulator: React.FC<ParticleSimulatorProps> = ({ gameState, onExperimentComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [energy, setEnergy] = useState([50]);
  const [particleCount, setParticleCount] = useState([10]);
  const [experimentCount, setExperimentCount] = useState(0);
  const [collisionCount, setCollisionCount] = useState(0);

  const particleTypes = [
    { type: 'proton' as const, color: '#ef4444', emoji: '🔴' },
    { type: 'electron' as const, color: '#3b82f6', emoji: '🔵' },
    { type: 'neutron' as const, color: '#10b981', emoji: '🟢' }
  ];

  const createParticles = () => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount[0]; i++) {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      newParticles.push({
        id: i,
        x: Math.random() * 380 + 10,
        y: Math.random() * 280 + 10,
        vx: (Math.random() - 0.5) * energy[0] / 10,
        vy: (Math.random() - 0.5) * energy[0] / 10,
        type: type.type,
        color: type.color
      });
    }
    setParticles(newParticles);
  };

  useEffect(() => {
    createParticles();
  }, [particleCount, energy]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Boundary collisions
          if (newX <= 5 || newX >= 395) {
            newVx = -particle.vx;
            newX = Math.max(5, Math.min(395, newX));
          }
          if (newY <= 5 || newY >= 295) {
            newVy = -particle.vy;
            newY = Math.max(5, Math.min(295, newY));
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Check for particle collisions
  useEffect(() => {
    if (!isRunning) return;

    const checkCollisions = () => {
      let collisions = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 15) {
            collisions++;
          }
        }
      }
      if (collisions > collisionCount) {
        setCollisionCount(collisions);
      }
    };

    checkCollisions();
  }, [particles, isRunning]);

  const startSimulation = () => {
    setIsRunning(true);
    setExperimentCount(prev => prev + 1);
    setCollisionCount(0);
    
    // Auto-stop after 10 seconds and give reward
    setTimeout(() => {
      setIsRunning(false);
      const knowledge = Math.floor(Math.random() * 20) + 15;
      onExperimentComplete(knowledge);
    }, 10000);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCollisionCount(0);
    createParticles();
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-purple flex items-center gap-3">
            <Atom className="w-8 h-8" />
            Симулятор Столкновения Частиц
          </CardTitle>
          <p className="text-muted-foreground">
            Исследуйте поведение элементарных частиц в ускорителе
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Управление</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Энергия: {energy[0]} ГэВ
              </label>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Количество частиц: {particleCount[0]}
              </label>
              <Slider
                value={particleCount}
                onValueChange={setParticleCount}
                min={5}
                max={25}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={isRunning ? stopSimulation : startSimulation}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                disabled={particles.length === 0}
              >
                {isRunning ? (
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
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Эксперименты:</span>
                <Badge>{experimentCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Столкновения:</span>
                <Badge variant="secondary">{collisionCount}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Particle Chamber */}
        <Card className="lg:col-span-2 bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Камера детектора
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-2 border-quantum-purple/30 bg-lab-dark/50 rounded-lg overflow-hidden" style={{ height: '300px', width: '100%' }}>
              {/* Particle tracks */}
              {isRunning && (
                <div className="absolute inset-0 bg-gradient-radial from-quantum-blue/5 via-transparent to-transparent animate-pulse" />
              )}
              
              {/* Particles */}
              {particles.map(particle => {
                const particleType = particleTypes.find(p => p.type === particle.type);
                return (
                  <div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-full transition-all duration-75 flex items-center justify-center text-xs"
                    style={{
                      left: particle.x,
                      top: particle.y,
                      backgroundColor: particleType?.color,
                      boxShadow: `0 0 8px ${particleType?.color}`,
                    }}
                  >
                    {particleType?.emoji}
                  </div>
                );
              })}

              {/* Center target */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-2 border-quantum-yellow/50 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-quantum-yellow" />
                </div>
              </div>

              {isRunning && (
                <div className="absolute top-2 left-2 text-quantum-green text-sm animate-pulse">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Ускоритель активен
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex justify-center gap-6 text-sm">
              {particleTypes.map(type => (
                <div key={type.type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="capitalize">
                    {type.type === 'proton' ? 'Протон' : 
                     type.type === 'electron' ? 'Электрон' : 'Нейтрон'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Physics Info */}
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-purple/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Большой адронный коллайдер</h4>
              <p className="text-muted-foreground">
                Самый мощный ускоритель частиц в мире, длиной 27 км
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Бозон Хиггса</h4>
              <p className="text-muted-foreground">
                Открыт в 2012 году в результате столкновений протонов
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Энергия столкновений</h4>
              <p className="text-muted-foreground">
                При высоких энергиях могут образовываться новые частицы
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Детекторы</h4>
              <p className="text-muted-foreground">
                Фиксируют треки частиц и их характеристики
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticleSimulator;
