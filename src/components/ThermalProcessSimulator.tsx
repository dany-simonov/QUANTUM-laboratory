
import React, { useState } from 'react';
import { Thermometer, RotateCcw, Play, Info, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface ThermalProcessSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const ThermalProcessSimulator: React.FC<ThermalProcessSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [initialTemp, setInitialTemp] = useState([20]);
  const [targetTemp, setTargetTemp] = useState([100]);
  const [material, setMaterial] = useState<'water' | 'iron' | 'copper' | 'aluminum'>('water');
  const [processType, setProcessType] = useState<'heating' | 'cooling' | 'conduction'>('heating');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(20);
  const [experimentCount, setExperimentCount] = useState(0);
  const [time, setTime] = useState(0);

  const materialProperties = {
    water: { specificHeat: 4186, density: 1000, name: 'Вода' },
    iron: { specificHeat: 449, density: 7874, name: 'Железо' },
    copper: { specificHeat: 385, density: 8960, name: 'Медь' },
    aluminum: { specificHeat: 897, density: 2700, name: 'Алюминий' }
  };

  const runSimulation = () => {
    setIsRunning(true);
    setExperimentCount(prev => prev + 1);
    setTime(0);
    setCurrentTemp(initialTemp[0]);
    
    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = prev + 0.1;
        
        // Simple temperature change simulation
        const progress = Math.min(newTime / 5, 1);
        const tempDiff = targetTemp[0] - initialTemp[0];
        const newTemp = initialTemp[0] + tempDiff * progress;
        setCurrentTemp(newTemp);
        
        if (newTime >= 5) {
          clearInterval(interval);
          setIsRunning(false);
          const knowledge = Math.floor(Math.random() * 18) + 12;
          onExperimentComplete(knowledge);
          return 0;
        }
        return newTime;
      });
    }, 100);
  };

  const resetSimulation = () => {
    setInitialTemp([20]);
    setTargetTemp([100]);
    setMaterial('water');
    setProcessType('heating');
    setIsRunning(false);
    setCurrentTemp(20);
    setTime(0);
  };

  const energyRequired = materialProperties[material].specificHeat * 1 * Math.abs(targetTemp[0] - initialTemp[0]);

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-orange flex items-center gap-3">
            <Thermometer className="w-8 h-8" />
            Симулятор Тепловых Процессов
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте процессы нагрева, охлаждения и теплопередачи
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
                Материал
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(materialProperties).map(([key, props]) => (
                  <Button
                    key={key}
                    onClick={() => setMaterial(key as any)}
                    variant={material === key ? 'default' : 'outline'}
                    size="sm"
                  >
                    {props.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Тип процесса
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setProcessType('heating')}
                  variant={processType === 'heating' ? 'default' : 'outline'}
                  size="sm"
                >
                  Нагрев
                </Button>
                <Button
                  onClick={() => setProcessType('cooling')}
                  variant={processType === 'cooling' ? 'default' : 'outline'}
                  size="sm"
                >
                  Охлаждение
                </Button>
                <Button
                  onClick={() => setProcessType('conduction')}
                  variant={processType === 'conduction' ? 'default' : 'outline'}
                  size="sm"
                >
                  Теплопроводность
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Начальная температура: {initialTemp[0]}°C
              </label>
              <Slider
                value={initialTemp}
                onValueChange={setInitialTemp}
                min={-20}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Целевая температура: {targetTemp[0]}°C
              </label>
              <Slider
                value={targetTemp}
                onValueChange={setTargetTemp}
                min={-20}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex-1 bg-quantum-orange hover:bg-quantum-orange/80"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Процесс...' : 'Запустить'}
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
            <CardTitle className="text-lg">Тепловой процесс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Temperature Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {currentTemp < 0 ? '🧊' : 
                   currentTemp < 30 ? '🌡️' : 
                   currentTemp < 70 ? '🔥' : '🌋'}
                </div>
                <div className="text-2xl font-bold">
                  {currentTemp.toFixed(1)}°C
                </div>
                <div className="text-sm text-muted-foreground">
                  {materialProperties[material].name}
                </div>
                
                {isRunning && (
                  <div className="mt-2">
                    <div className="text-quantum-orange">
                      Время: {time.toFixed(1)}с
                    </div>
                    {processType === 'heating' && <Flame className="w-6 h-6 mx-auto text-quantum-orange animate-pulse" />}
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-blue/10 p-3 rounded border border-quantum-blue/20">
                <div className="text-sm text-quantum-blue">Удельная теплоемкость</div>
                <div className="text-lg font-semibold">
                  {materialProperties[material].specificHeat} Дж/(кг·К)
                </div>
              </div>
              <div className="bg-quantum-green/10 p-3 rounded border border-quantum-green/20">
                <div className="text-sm text-quantum-green">Энергия</div>
                <div className="text-lg font-semibold">
                  {(energyRequired / 1000).toFixed(1)} кДж
                </div>
              </div>
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-orange/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-orange" />
                  <span className="text-sm font-semibold">Уравнение теплообмена</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Q = mcΔT</p>
                  <p>Q = 1кг × {materialProperties[material].specificHeat} × {Math.abs(targetTemp[0] - initialTemp[0])} = {(energyRequired / 1000).toFixed(1)} кДж</p>
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
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-orange/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Удельная теплоемкость</h4>
              <p className="text-muted-foreground">
                Количество теплоты, необходимое для нагрева 1 кг вещества на 1°C
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Конвекция</h4>
              <p className="text-muted-foreground">
                Перенос тепла потоками жидкости или газа
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Теплопроводность</h4>
              <p className="text-muted-foreground">
                Металлы - хорошие проводники тепла, воздух - плохой
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Излучение</h4>
              <p className="text-muted-foreground">
                Передача тепла электромагнитными волнами
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThermalProcessSimulator;
