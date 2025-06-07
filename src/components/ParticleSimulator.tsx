
import React, { useState, useEffect } from 'react';
import { Atom, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ParticleSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  charge: number;
  color: string;
  size: number;
  type: 'electron' | 'proton' | 'neutron' | 'photon';
}

const ParticleSimulator: React.FC<ParticleSimulatorProps> = ({ gameState, onExperimentComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [magneticField, setMagneticField] = useState([0]);
  const [electricField, setElectricField] = useState([0]);
  const [collisionCount, setCollisionCount] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0);

  // Initialize particles
  useEffect(() => {
    resetSimulation();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSimulationTime(prev => prev + 0.1);
      updateParticles();
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, magneticField, electricField]);

  const createParticle = (type: Particle['type'], x: number, y: number): Particle => {
    const particleTypes = {
      electron: { mass: 1, charge: -1, color: 'quantum-blue', size: 4 },
      proton: { mass: 1836, charge: 1, color: 'quantum-orange', size: 6 },
      neutron: { mass: 1839, charge: 0, color: 'quantum-green', size: 6 },
      photon: { mass: 0, charge: 0, color: 'quantum-yellow', size: 3 }
    };

    const config = particleTypes[type];
    
    return {
      id: Math.random().toString(36),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      mass: config.mass,
      charge: config.charge,
      color: config.color,
      size: config.size,
      type
    };
  };

  const resetSimulation = () => {
    const newParticles: Particle[] = [];
    
    // Add various particles
    for (let i = 0; i < 3; i++) {
      newParticles.push(createParticle('electron', 100 + i * 50, 150 + i * 30));
      newParticles.push(createParticle('proton', 300 + i * 50, 150 + i * 30));
    }
    
    newParticles.push(createParticle('neutron', 250, 200));
    newParticles.push(createParticle('photon', 400, 100));

    setParticles(newParticles);
    setCollisionCount(0);
    setSimulationTime(0);
    setIsRunning(false);
  };

  const updateParticles = () => {
    setParticles(prevParticles => {
      const newParticles = prevParticles.map(particle => {
        let { x, y, vx, vy } = particle;
        
        // Apply forces
        if (particle.charge !== 0) {
          // Electric field effect
          vx += particle.charge * electricField[0] * 0.01;
          
          // Magnetic field effect (simplified)
          const magneticForce = magneticField[0] * 0.01;
          const tempVx = vx;
          vx += magneticForce * vy * particle.charge;
          vy -= magneticForce * tempVx * particle.charge;
        }
        
        // Update position
        x += vx;
        y += vy;
        
        // Boundary collisions
        if (x <= particle.size || x >= 580 - particle.size) {
          vx = -vx * 0.8; // Energy loss
          x = Math.max(particle.size, Math.min(580 - particle.size, x));
        }
        if (y <= particle.size || y >= 320 - particle.size) {
          vy = -vy * 0.8;
          y = Math.max(particle.size, Math.min(320 - particle.size, y));
        }
        
        return { ...particle, x, y, vx, vy };
      });

      // Check for particle collisions
      for (let i = 0; i < newParticles.length; i++) {
        for (let j = i + 1; j < newParticles.length; j++) {
          const p1 = newParticles[i];
          const p2 = newParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < (p1.size + p2.size)) {
            // Collision detected
            setCollisionCount(prev => prev + 1);
            
            // Simple elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            const v1x = p1.vx * cos + p1.vy * sin;
            const v1y = p1.vy * cos - p1.vx * sin;
            const v2x = p2.vx * cos + p2.vy * sin;
            const v2y = p2.vy * cos - p2.vx * sin;
            
            // Exchange velocities (simplified)
            const temp = v1x;
            newParticles[i].vx = v2x * cos - v1y * sin;
            newParticles[i].vy = v1y * cos + v2x * sin;
            newParticles[j].vx = temp * cos - v2y * sin;
            newParticles[j].vy = v2y * cos + temp * sin;
            
            // Separate particles
            const overlap = (p1.size + p2.size) - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            newParticles[i].x += separationX;
            newParticles[i].y += separationY;
            newParticles[j].x -= separationX;
            newParticles[j].y -= separationY;
          }
        }
      }

      return newParticles;
    });
  };

  const completeExperiment = () => {
    const knowledge = Math.floor(collisionCount * 2 + simulationTime * 0.5);
    onExperimentComplete(knowledge);
    resetSimulation();
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-purple flex items-center gap-3">
            <Atom className="w-8 h-8" />
            Симулятор Частиц
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте поведение субатомных частиц в различных условиях
          </p>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Управление симуляцией</CardTitle>
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
                <label className="text-sm font-medium">Магнитное поле</label>
                <Slider
                  value={magneticField}
                  onValueChange={setMagneticField}
                  max={10}
                  min={-10}
                  step={0.1}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-blue">Сила: {magneticField[0]}</span>
              </div>

              <div>
                <label className="text-sm font-medium">Электрическое поле</label>
                <Slider
                  value={electricField}
                  onValueChange={setElectricField}
                  max={10}
                  min={-10}
                  step={0.1}
                  className="mt-2"
                />
                <span className="text-xs text-quantum-green">Сила: {electricField[0]}</span>
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
            <CardTitle className="text-lg">Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Время симуляции</span>
                <p className="text-lg font-semibold text-quantum-blue">
                  {simulationTime.toFixed(1)}с
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Столкновения</span>
                <p className="text-lg font-semibold text-quantum-orange">
                  {collisionCount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Типы частиц:</span>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-quantum-blue/20 text-quantum-blue">
                  Электроны: {particles.filter(p => p.type === 'electron').length}
                </Badge>
                <Badge className="bg-quantum-orange/20 text-quantum-orange">
                  Протоны: {particles.filter(p => p.type === 'proton').length}
                </Badge>
                <Badge className="bg-quantum-green/20 text-quantum-green">
                  Нейтроны: {particles.filter(p => p.type === 'neutron').length}
                </Badge>
                <Badge className="bg-quantum-yellow/20 text-quantum-yellow">
                  Фотоны: {particles.filter(p => p.type === 'photon').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Canvas */}
      <Card className="energy-border bg-card/90">
        <CardContent className="p-6">
          <div className="relative w-full h-80 bg-lab-dark rounded-lg border border-lab-border overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Field indicators */}
              {magneticField[0] !== 0 && (
                <text x="10" y="20" fill="#9D4EDD" fontSize="12">
                  B = {magneticField[0].toFixed(1)}
                </text>
              )}
              {electricField[0] !== 0 && (
                <text x="10" y="40" fill="#00F5A0" fontSize="12">
                  E = {electricField[0].toFixed(1)}
                </text>
              )}

              {/* Particles */}
              {particles.map((particle) => (
                <g key={particle.id}>
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size}
                    fill={`var(--${particle.color})`}
                    className="animate-glow"
                  />
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size + 2}
                    fill="none"
                    stroke={`var(--${particle.color})`}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </g>
              ))}
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticleSimulator;
