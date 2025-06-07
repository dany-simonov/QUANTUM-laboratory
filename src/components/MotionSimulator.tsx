
import React, { useState } from 'react';
import { TrendingUp, RotateCcw, Play, Pause, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MotionSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const MotionSimulator: React.FC<MotionSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [angle, setAngle] = useState([30]);
  const [friction, setFriction] = useState([20]);
  const [mass, setMass] = useState([10]);
  const [surface, setSurface] = useState<'smooth' | 'rough' | 'very_rough'>('smooth');
  const [isMoving, setIsMoving] = useState(false);
  const [experimentCount, setExperimentCount] = useState(0);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState(0);

  const surfaceCoefficients = {
    smooth: 0.1,
    rough: 0.3,
    very_rough: 0.6
  };

  const surfaceNames = {
    smooth: 'Гладкая',
    rough: 'Шероховатая',
    very_rough: 'Очень шероховатая'
  };

  const gravity = 9.81;
  const frictionCoeff = surfaceCoefficients[surface] * (friction[0] / 100);
  const sinAngle = Math.sin((angle[0] * Math.PI) / 180);
  const cosAngle = Math.cos((angle[0] * Math.PI) / 180);
  
  const normalForce = mass[0] * gravity * cosAngle;
  const frictionForce = frictionCoeff * normalForce;
  const gravitationalComponent = mass[0] * gravity * sinAngle;
  const netForce = gravitationalComponent - frictionForce;
  const acceleration = netForce / mass[0];

  const startMotion = () => {
    setIsMoving(true);
    setExperimentCount(prev => prev + 1);
    setTime(0);
    setPosition(0);
    
    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = prev + 0.1;
        // s = (1/2)at²
        const newPosition = 0.5 * Math.max(0, acceleration) * newTime * newTime;
        setPosition(newPosition);
        
        if (newTime >= 5 || (acceleration <= 0 && newTime > 1)) {
          clearInterval(interval);
          setIsMoving(false);
          const knowledge = Math.floor(Math.random() * 15) + 10;
          onExperimentComplete(knowledge);
          return 0;
        }
        return newTime;
      });
    }, 100);
  };

  const stopMotion = () => {
    setIsMoving(false);
    setTime(0);
    setPosition(0);
  };

  const resetSimulation = () => {
    setAngle([30]);
    setFriction([20]);
    setMass([10]);
    setSurface('smooth');
    setIsMoving(false);
    setTime(0);
    setPosition(0);
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-green flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Симулятор Движения по Наклонной Плоскости
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте законы Ньютона и влияние силы трения на движение
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Параметры эксперимента</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Поверхность
              </label>
              <div className="flex flex-col gap-2">
                {Object.entries(surfaceNames).map(([key, name]) => (
                  <Button
                    key={key}
                    onClick={() => setSurface(key as any)}
                    variant={surface === key ? 'default' : 'outline'}
                    size="sm"
                  >
                    {name} (μ = {surfaceCoefficients[key as keyof typeof surfaceCoefficients]})
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Угол наклона: {angle[0]}°
              </label>
              <Slider
                value={angle}
                onValueChange={setAngle}
                min={5}
                max={60}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Масса тела: {mass[0]} кг
              </label>
              <Slider
                value={mass}
                onValueChange={setMass}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Шероховатость: {friction[0]}%
              </label>
              <Slider
                value={friction}
                onValueChange={setFriction}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isMoving ? stopMotion : startMotion}
                className="flex-1 bg-quantum-green hover:bg-quantum-green/80"
              >
                {isMoving ? (
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
            <CardTitle className="text-lg">Движение тела</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Motion Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border h-48 flex items-end justify-start relative">
              {/* Inclined plane */}
              <div 
                className="absolute bottom-0 right-0 border-b-4 border-r-4 border-gray-400"
                style={{
                  width: '80%',
                  height: `${angle[0]}%`,
                  clipPath: 'polygon(100% 100%, 0% 100%, 100% 0%)'
                }}
              />
              
              {/* Moving object */}
              <div
                className="text-2xl absolute transition-all duration-100"
                style={{
                  bottom: `${10 + (position / 5) * Math.sin((angle[0] * Math.PI) / 180)}%`,
                  left: `${10 + (position / 5) * Math.cos((angle[0] * Math.PI) / 180)}%`,
                  transform: isMoving ? 'none' : 'translateX(0)'
                }}
              >
                📦
              </div>
              
              <div className="absolute bottom-2 left-2 text-sm">
                <div>Позиция: {position.toFixed(1)} м</div>
                {isMoving && <div>Время: {time.toFixed(1)} с</div>}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-blue/10 p-3 rounded border border-quantum-blue/20">
                <div className="text-sm text-quantum-blue">Ускорение</div>
                <div className="text-lg font-semibold">
                  {acceleration.toFixed(2)} м/с²
                </div>
              </div>
              <div className="bg-quantum-orange/10 p-3 rounded border border-quantum-orange/20">
                <div className="text-sm text-quantum-orange">Сила трения</div>
                <div className="text-lg font-semibold">
                  {frictionForce.toFixed(1)} Н
                </div>
              </div>
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-green/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-green" />
                  <span className="text-sm font-semibold">Анализ сил</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>F₁ = mg sin α = {mass[0]} × 9.81 × sin({angle[0]}°) = {gravitationalComponent.toFixed(1)} Н</p>
                  <p>F₂ = μN = {frictionCoeff.toFixed(2)} × {normalForce.toFixed(1)} = {frictionForce.toFixed(1)} Н</p>
                  <p>a = (F₁ - F₂)/m = {acceleration.toFixed(2)} м/с²</p>
                  {acceleration <= 0 && <p className="text-quantum-orange">Тело не движется - трение слишком большое!</p>}
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
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-green/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Второй закон Ньютона</h4>
              <p className="text-muted-foreground">
                F = ma - сила равна произведению массы на ускорение
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Сила трения</h4>
              <p className="text-muted-foreground">
                Всегда направлена против движения и зависит от коэффициента трения
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Наклонная плоскость</h4>
              <p className="text-muted-foreground">
                Простейший механизм, уменьшающий необходимую силу
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Галилей</h4>
              <p className="text-muted-foreground">
                Изучал движение по наклонной плоскости для понимания законов падения
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotionSimulator;
