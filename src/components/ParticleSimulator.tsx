
import React, { useState, useEffect } from 'react';
import { Atom, Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';
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
  trail: Array<{x: number, y: number}>;
}

const ParticleSimulator: React.FC<ParticleSimulatorProps> = ({ gameState, onExperimentComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [magneticField, setMagneticField] = useState([0]);
  const [electricField, setElectricField] = useState([0]);
  const [collisionCount, setCollisionCount] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0);

  useEffect(() => {
    resetSimulation();
  }, []);

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
      electron: { mass: 1, charge: -1, color: '#00D4FF', size: 5 }, // Яркий голубой
      proton: { mass: 1836, charge: 1, color: '#FF4444', size: 7 }, // Красный
      neutron: { mass: 1839, charge: 0, color: '#00F5A0', size: 7 }, // Зеленый
      photon: { mass: 0, charge: 0, color: '#FFD700', size: 4 } // Золотой
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
      type,
      trail: []
    };
  };

  const resetSimulation = () => {
    const newParticles: Particle[] = [];
    
    // Add various particles with better positioning
    for (let i = 0; i < 4; i++) {
      newParticles.push(createParticle('electron', 100 + i * 60, 150 + i * 20));
      newParticles.push(createParticle('proton', 300 + i * 60, 150 + i * 20));
    }
    
    newParticles.push(createParticle('neutron', 250, 200));
    newParticles.push(createParticle('neutron', 350, 180));
    newParticles.push(createParticle('photon', 400, 100));
    newParticles.push(createParticle('photon', 150, 250));

    setParticles(newParticles);
    setCollisionCount(0);
    setSimulationTime(0);
    setIsRunning(false);
  };

  const updateParticles = () => {
    setParticles(prevParticles => {
      const newParticles = prevParticles.map(particle => {
        let { x, y, vx, vy, trail } = particle;
        
        // Update trail
        const newTrail = [...trail, {x, y}];
        if (newTrail.length > 10) {
          newTrail.shift();
        }
        
        // Apply forces
        if (particle.charge !== 0) {
          vx += particle.charge * electricField[0] * 0.01;
          const magneticForce = magneticField[0] * 0.01;
          const tempVx = vx;
          vx += magneticForce * vy * particle.charge;
          vy -= magneticForce * tempVx * particle.charge;
        }
        
        // Update position
        x += vx;
        y += vy;
        
        // Boundary collisions with energy damping
        if (x <= particle.size || x >= 580 - particle.size) {
          vx = -vx * 0.9;
          x = Math.max(particle.size, Math.min(580 - particle.size, x));
        }
        if (y <= particle.size || y >= 320 - particle.size) {
          vy = -vy * 0.9;
          y = Math.max(particle.size, Math.min(320 - particle.size, y));
        }
        
        return { ...particle, x, y, vx, vy, trail: newTrail };
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
            setCollisionCount(prev => prev + 1);
            
            // Simple elastic collision with conservation of momentum
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            const v1x = p1.vx * cos + p1.vy * sin;
            const v1y = p1.vy * cos - p1.vx * sin;
            const v2x = p2.vx * cos + p2.vy * sin;
            const v2y = p2.vy * cos - p2.vx * sin;
            
            // Exchange velocities with mass consideration
            const newV1x = ((p1.mass - p2.mass) * v1x + 2 * p2.mass * v2x) / (p1.mass + p2.mass);
            const newV2x = ((p2.mass - p1.mass) * v2x + 2 * p1.mass * v1x) / (p1.mass + p2.mass);
            
            newParticles[i].vx = newV1x * cos - v1y * sin;
            newParticles[i].vy = v1y * cos + newV1x * sin;
            newParticles[j].vx = newV2x * cos - v2y * sin;
            newParticles[j].vy = v2y * cos + newV2x * sin;
            
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
    const knowledge = Math.floor(collisionCount * 3 + simulationTime * 1 + particles.length * 2);
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Управление симуляцией
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
                  ⚡ Магнитное поле
                </label>
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
                <label className="text-sm font-medium flex items-center gap-2">
                  🔌 Электрическое поле
                </label>
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
              disabled={simulationTime < 3}
            >
              <Zap className="w-4 h-4 mr-2" />
              Завершить эксперимент
              {simulationTime < 3 && ` (${(3 - simulationTime).toFixed(1)}с)`}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Статистика эксперимента</CardTitle>
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
                <span className="text-sm text-muted-foreground">Столкновения</span>
                <p className="text-lg font-semibold text-quantum-orange">
                  {collisionCount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Частицы в симуляции:</span>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Badge style={{backgroundColor: '#00D4FF20', color: '#00D4FF'}}>
                  Электроны: {particles.filter(p => p.type === 'electron').length}
                </Badge>
                <Badge style={{backgroundColor: '#FF444420', color: '#FF4444'}}>
                  Протоны: {particles.filter(p => p.type === 'proton').length}
                </Badge>
                <Badge style={{backgroundColor: '#00F5A020', color: '#00F5A0'}}>
                  Нейтроны: {particles.filter(p => p.type === 'neutron').length}
                </Badge>
                <Badge style={{backgroundColor: '#FFD70020', color: '#FFD700'}}>
                  Фотоны: {particles.filter(p => p.type === 'photon').length}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>💡 Знания: ~{Math.floor(collisionCount * 3 + simulationTime * 1 + particles.length * 2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Simulation Canvas */}
      <Card className="energy-border bg-card/90">
        <CardContent className="p-6">
          <div className="relative w-full h-80 bg-gradient-to-br from-lab-dark to-slate-900 rounded-lg border border-lab-border overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="1"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Field indicators */}
              {magneticField[0] !== 0 && (
                <text x="15" y="25" fill="#9D4EDD" fontSize="14" fontWeight="bold">
                  ⚡ B = {magneticField[0].toFixed(1)}
                </text>
              )}
              {electricField[0] !== 0 && (
                <text x="15" y="50" fill="#00F5A0" fontSize="14" fontWeight="bold">
                  🔌 E = {electricField[0].toFixed(1)}
                </text>
              )}

              {/* Particle trails */}
              {particles.map((particle) => (
                <g key={`trail-${particle.id}`}>
                  <path
                    d={particle.trail.map((point, index) => 
                      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                    ).join(' ')}
                    stroke={particle.color}
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                  />
                </g>
              ))}

              {/* Particles with glow effect */}
              {particles.map((particle) => (
                <g key={particle.id}>
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size + 2}
                    fill={particle.color}
                    opacity="0.2"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size}
                    fill={particle.color}
                    filter="url(#glow)"
                  />
                  <circle
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size - 1}
                    fill="white"
                    opacity="0.6"
                  />
                  
                  {/* Particle type indicator */}
                  <text
                    x={particle.x}
                    y={particle.y + 2}
                    textAnchor="middle"
                    fontSize="8"
                    fill="black"
                    fontWeight="bold"
                  >
                    {particle.type === 'electron' ? 'e⁻' : 
                     particle.type === 'proton' ? 'p⁺' :
                     particle.type === 'neutron' ? 'n' : 'γ'}
                  </text>
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
