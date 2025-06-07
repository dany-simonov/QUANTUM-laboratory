
import React, { useState } from 'react';
import { Magnet, RotateCcw, Play, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface MagneticFieldSimulatorProps {
  gameState: any;
  onExperimentComplete: (knowledge: number) => void;
}

const MagneticFieldSimulator: React.FC<MagneticFieldSimulatorProps> = ({ 
  gameState, 
  onExperimentComplete 
}) => {
  const [magnetStrength, setMagnetStrength] = useState([50]);
  const [current, setCurrent] = useState([10]);
  const [experimentType, setExperimentType] = useState<'field_lines' | 'force' | 'induction'>('field_lines');
  const [isRunning, setIsRunning] = useState(false);
  const [experimentCount, setExperimentCount] = useState(0);
  const [time, setTime] = useState(0);

  const magneticField = magnetStrength[0] / 100 * 0.5; // Tesla
  const force = magneticField * current[0] / 10 * 0.1; // Newton

  const runSimulation = () => {
    setIsRunning(true);
    setExperimentCount(prev => prev + 1);
    setTime(0);
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsRunning(false);
          const knowledge = Math.floor(Math.random() * 16) + 12;
          onExperimentComplete(knowledge);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const resetSimulation = () => {
    setMagnetStrength([50]);
    setCurrent([10]);
    setExperimentType('field_lines');
    setIsRunning(false);
    setTime(0);
  };

  const getExperimentName = (type: string) => {
    switch (type) {
      case 'field_lines': return 'Силовые линии';
      case 'force': return 'Сила Лоренца';
      case 'induction': return 'Индукция';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-purple flex items-center gap-3">
            <Magnet className="w-8 h-8" />
            Симулятор Магнитных Полей
          </CardTitle>
          <p className="text-muted-foreground">
            Моделируйте взаимодействие магнитных полей с токами и частицами
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
                Тип эксперимента
              </label>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setExperimentType('field_lines')}
                  variant={experimentType === 'field_lines' ? 'default' : 'outline'}
                  size="sm"
                >
                  Силовые линии поля
                </Button>
                <Button
                  onClick={() => setExperimentType('force')}
                  variant={experimentType === 'force' ? 'default' : 'outline'}
                  size="sm"
                >
                  Сила Лоренца
                </Button>
                <Button
                  onClick={() => setExperimentType('induction')}
                  variant={experimentType === 'induction' ? 'default' : 'outline'}
                  size="sm"
                >
                  Электромагнитная индукция
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Сила магнита: {magnetStrength[0]}%
              </label>
              <Slider
                value={magnetStrength}
                onValueChange={setMagnetStrength}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {(experimentType === 'force' || experimentType === 'induction') && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Сила тока: {current[0]} А
                </label>
                <Slider
                  value={current}
                  onValueChange={setCurrent}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex-1 bg-quantum-purple hover:bg-quantum-purple/80"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Анализ...' : 'Запустить'}
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
            <CardTitle className="text-lg">{getExperimentName(experimentType)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Magnetic Field Visualization */}
            <div className="bg-lab-surface/50 p-6 rounded-lg border h-48 flex items-center justify-center">
              <div className="text-center">
                {experimentType === 'field_lines' && (
                  <div>
                    <div className="text-6xl mb-2">🧲</div>
                    <div className="text-sm">N ⟵ ⟶ S</div>
                    {isRunning && (
                      <div className="mt-2 text-quantum-purple animate-pulse">
                        Силовые линии видимы...
                      </div>
                    )}
                  </div>
                )}
                
                {experimentType === 'force' && (
                  <div>
                    <div className="text-6xl mb-2">⚡</div>
                    <div className="text-sm">Частица в поле</div>
                    {isRunning && (
                      <div className="mt-2 text-quantum-blue">
                        <Zap className="w-6 h-6 mx-auto animate-bounce" />
                        Сила: {force.toFixed(3)} Н
                      </div>
                    )}
                  </div>
                )}
                
                {experimentType === 'induction' && (
                  <div>
                    <div className="text-6xl mb-2">🔄</div>
                    <div className="text-sm">Проводник движется</div>
                    {isRunning && (
                      <div className="mt-2 text-quantum-green animate-pulse">
                        ЭДС индукции возникает...
                      </div>
                    )}
                  </div>
                )}
                
                {isRunning && (
                  <div className="mt-2 text-sm">
                    Время: {time.toFixed(1)}с
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quantum-purple/10 p-3 rounded border border-quantum-purple/20">
                <div className="text-sm text-quantum-purple">Магнитное поле</div>
                <div className="text-lg font-semibold">
                  {magneticField.toFixed(3)} Тл
                </div>
              </div>
              {(experimentType === 'force' || experimentType === 'induction') && (
                <div className="bg-quantum-blue/10 p-3 rounded border border-quantum-blue/20">
                  <div className="text-sm text-quantum-blue">
                    {experimentType === 'force' ? 'Сила' : 'ЭДС'}
                  </div>
                  <div className="text-lg font-semibold">
                    {experimentType === 'force' 
                      ? `${force.toFixed(3)} Н`
                      : `${(magneticField * current[0] / 10).toFixed(2)} В`
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Physics Info */}
            <Card className="bg-gradient-to-r from-lab-surface to-quantum-purple/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-quantum-purple" />
                  <span className="text-sm font-semibold">Формулы</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {experimentType === 'force' && (
                    <>
                      <p>F = BIL (сила Ампера)</p>
                      <p>F = {magneticField.toFixed(3)} × {current[0]} × 0.1 = {force.toFixed(3)} Н</p>
                    </>
                  )}
                  {experimentType === 'induction' && (
                    <>
                      <p>ε = -dΦ/dt (закон Фарадея)</p>
                      <p>ε = BLv ≈ {(magneticField * current[0] / 10).toFixed(2)} В</p>
                    </>
                  )}
                  {experimentType === 'field_lines' && (
                    <p>B = {magneticField.toFixed(3)} Тл</p>
                  )}
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
              <h4 className="font-semibold text-quantum-purple mb-1">Правило правой руки</h4>
              <p className="text-muted-foreground">
                Определяет направление магнитного поля вокруг проводника с током
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-blue mb-1">Сила Лоренца</h4>
              <p className="text-muted-foreground">
                Действует на движущиеся заряженные частицы в магнитном поле
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-green mb-1">Закон Фарадея</h4>
              <p className="text-muted-foreground">
                Изменяющееся магнитное поле создает электрическое поле
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-quantum-orange mb-1">Магнитное поле Земли</h4>
              <p className="text-muted-foreground">
                Защищает нас от космического излучения, сила ≈ 0.00005 Тл
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagneticFieldSimulator;
