
import React, { useState } from 'react';
import { Zap, Plus, Minus, RotateCcw, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface ElectricalCircuitSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const ElectricalCircuitSimulator: React.FC<ElectricalCircuitSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [voltage, setVoltage] = useState([12]);
  const [resistance, setResistance] = useState([100]);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [isRunning, setIsRunning] = useState(false);
  const [experimentCount, setExperimentCount] = useState(0);

  const current = voltage[0] / resistance[0];
  const power = (voltage[0] * voltage[0]) / resistance[0];

  const runSimulation = () => {
    setIsRunning(true);
    setExperimentCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsRunning(false);
      const knowledge = Math.floor(Math.random() * 15) + 10;
      onExperimentComplete(knowledge);
    }, 2000);
  };

  const resetCircuit = () => {
    setVoltage([12]);
    setResistance([100]);
    setCircuitType('series');
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
            <Zap className="w-8 h-8" />
            Симулятор Электрических Цепей
          </CardTitle>
          <p className="text-muted-foreground">
            Создавайте и исследуйте работу различных электрических схем
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circuit Controls */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Параметры цепи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Напряжение: {voltage[0]} В
              </label>
              <Slider
                value={voltage}
                onValueChange={setVoltage}
                min={1}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Сопротивление: {resistance[0]} Ω
              </label>
              <Slider
                value={resistance}
                onValueChange={setResistance}
                min={10}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Тип цепи
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCircuitType('series')}
                  variant={circuitType === 'series' ? 'default' : 'outline'}
                  size="sm"
                >
                  Последовательная
                </Button>
                <Button
                  onClick={() => setCircuitType('parallel')}
                  variant={circuitType === 'parallel' ? 'default' : 'outline'}
                  size="sm"
                >
                  Параллельная
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex-1 bg-quantum-green hover:bg-quantum-green/80"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Анализ...' : 'Запустить'}
              </Button>
              <Button
                onClick={resetCircuit}
                variant="outline"
                size="icon"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Display & Results */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Результаты измерений</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Circuit Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border">
              <div className="text-center mb-4">
                <div className="text-6xl">⚡</div>
                <div className="text-sm text-muted-foreground">
                  {circuitType === 'series' ? 'Последовательная цепь' : 'Параллельная цепь'}
                </div>
              </div>
              
              {isRunning && (
                <div className="text-center">
                  <div className="text-quantum-orange animate-pulse">
                    Электроны движутся...
                  </div>
                </div>
              )}
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-blue/10 p-3 rounded border border-quantum-blue/20">
                <div className="text-sm text-quantum-blue">Ток</div>
                <div className="text-lg font-semibold">
                  {current.toFixed(3)} А
                </div>
              </div>
              <div className="bg-quantum-orange/10 p-3 rounded border border-quantum-orange/20">
                <div className="text-sm text-quantum-orange">Мощность</div>
                <div className="text-lg font-semibold">
                  {power.toFixed(2)} Вт
                </div>
              </div>
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-blue/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-blue" />
                  <span className="text-sm font-semibold">Закон Ома</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>I = U / R = {voltage[0]} / {resistance[0]} = {current.toFixed(3)} А</p>
                  <p>P = U² / R = {voltage[0]}² / {resistance[0]} = {power.toFixed(2)} Вт</p>
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
      <Card className="bg-gradient-to-r from-lab-surface to-quantum-yellow/5">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Интересные факты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-quantum-yellow mb-1">Закон Ома</h4>
              <p className="text-muted-foreground">
                Ток в цепи прямо пропорционален напряжению и обратно пропорционален сопротивлению
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Мощность</h4>
              <p className="text-muted-foreground">
                Электрическая мощность показывает, сколько энергии потребляет устройство за единицу времени
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-purple mb-1">Последовательное соединение</h4>
              <p className="text-muted-foreground">
                Ток одинаков во всех элементах, напряжения складываются
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Параллельное соединение</h4>
              <p className="text-muted-foreground">
                Напряжение одинаково, токи складываются
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectricalCircuitSimulator;
