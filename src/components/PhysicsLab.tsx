
import React, { useState } from 'react';
import { Beaker, Zap, Eye, Waves, Settings, Play, RotateCcw, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  properties: any;
}

const PhysicsLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('electrical');
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gridSize] = useState(20);

  const electricalComponents = [
    { id: 'battery', name: 'Батарейка', icon: '🔋', color: 'quantum-green' },
    { id: 'resistor', name: 'Резистор', icon: '⚡', color: 'quantum-orange' },
    { id: 'capacitor', name: 'Конденсатор', icon: '⚪', color: 'quantum-blue' },
    { id: 'led', name: 'Светодиод', icon: '💡', color: 'quantum-yellow' },
    { id: 'switch', name: 'Переключатель', icon: '🔘', color: 'quantum-purple' },
    { id: 'wire', name: 'Провод', icon: '➖', color: 'quantum-gray' }
  ];

  const opticalComponents = [
    { id: 'lens_converging', name: 'Собирающая линза', icon: '🔍', color: 'quantum-blue' },
    { id: 'lens_diverging', name: 'Рассеивающая линза', icon: '🔍', color: 'quantum-orange' },
    { id: 'mirror', name: 'Зеркало', icon: '🪞', color: 'quantum-silver' },
    { id: 'prism', name: 'Призма', icon: '🔺', color: 'quantum-purple' },
    { id: 'light_source', name: 'Источник света', icon: '💡', color: 'quantum-yellow' },
    { id: 'screen', name: 'Экран', icon: '⬜', color: 'quantum-gray' }
  ];

  const waveComponents = [
    { id: 'wave_source', name: 'Источник волн', icon: '〰️', color: 'quantum-blue' },
    { id: 'barrier', name: 'Препятствие', icon: '⬛', color: 'quantum-gray' },
    { id: 'slit', name: 'Щель', icon: '||', color: 'quantum-orange' },
    { id: 'detector', name: 'Детектор', icon: '📡', color: 'quantum-green' }
  ];

  const addComponent = (componentType: string) => {
    const newComponent: Component = {
      id: `${componentType}_${Date.now()}`,
      type: componentType,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: 0,
      properties: getDefaultProperties(componentType)
    };
    setComponents([...components, newComponent]);
  };

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'battery':
        return { voltage: 9 };
      case 'resistor':
        return { resistance: 100 };
      case 'capacitor':
        return { capacitance: 1000 };
      case 'lens_converging':
        return { focalLength: 50 };
      case 'lens_diverging':
        return { focalLength: -50 };
      case 'light_source':
        return { wavelength: 550, intensity: 100 };
      case 'wave_source':
        return { frequency: 440, amplitude: 1 };
      default:
        return {};
    }
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const updateComponentProperty = (id: string, property: string, value: any) => {
    setComponents(components.map(c => 
      c.id === id 
        ? { ...c, properties: { ...c.properties, [property]: value } }
        : c
    ));
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 3000);
  };

  const clearLab = () => {
    setComponents([]);
    setSelectedComponent(null);
  };

  const getComponentIcon = (type: string) => {
    const allComponents = [...electricalComponents, ...opticalComponents, ...waveComponents];
    return allComponents.find(c => c.id === type)?.icon || '⚪';
  };

  const renderComponentProperties = () => {
    if (!selectedComponent) return null;
    
    const component = components.find(c => c.id === selectedComponent);
    if (!component) return null;

    return (
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-lg">Свойства компонента</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <strong>Тип:</strong> {component.type}
          </div>
          
          {component.type === 'battery' && (
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Напряжение: {component.properties.voltage} В
              </label>
              <Slider
                value={[component.properties.voltage]}
                onValueChange={([value]) => updateComponentProperty(component.id, 'voltage', value)}
                min={1}
                max={24}
                step={1}
              />
            </div>
          )}
          
          {component.type === 'resistor' && (
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Сопротивление: {component.properties.resistance} Ω
              </label>
              <Slider
                value={[component.properties.resistance]}
                onValueChange={([value]) => updateComponentProperty(component.id, 'resistance', value)}
                min={10}
                max={1000}
                step={10}
              />
            </div>
          )}
          
          {component.type === 'light_source' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Длина волны: {component.properties.wavelength} нм
                </label>
                <Slider
                  value={[component.properties.wavelength]}
                  onValueChange={([value]) => updateComponentProperty(component.id, 'wavelength', value)}
                  min={400}
                  max={700}
                  step={10}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Интенсивность: {component.properties.intensity}%
                </label>
                <Slider
                  value={[component.properties.intensity]}
                  onValueChange={([value]) => updateComponentProperty(component.id, 'intensity', value)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          )}
          
          <Button
            onClick={() => removeComponent(component.id)}
            variant="destructive"
            size="sm"
          >
            Удалить компонент
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-blue flex items-center gap-3">
            <Beaker className="w-8 h-8" />
            Интерактивная Физическая Лаборатория
          </CardTitle>
          <p className="text-muted-foreground">
            Создавайте собственные физические эксперименты и изучайте различные явления
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Component Library */}
        <div className="space-y-4">
          <Card className="bg-card/90">
            <CardHeader>
              <CardTitle className="text-lg">Компоненты</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="electrical" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Электро
                  </TabsTrigger>
                  <TabsTrigger value="optical" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Оптика
                  </TabsTrigger>
                  <TabsTrigger value="waves" className="text-xs">
                    <Waves className="w-3 h-3 mr-1" />
                    Волны
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="electrical" className="space-y-2 mt-4">
                  {electricalComponents.map((component) => (
                    <Button
                      key={component.id}
                      onClick={() => addComponent(component.id)}
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <span className="mr-2">{component.icon}</span>
                      {component.name}
                    </Button>
                  ))}
                </TabsContent>
                
                <TabsContent value="optical" className="space-y-2 mt-4">
                  {opticalComponents.map((component) => (
                    <Button
                      key={component.id}
                      onClick={() => addComponent(component.id)}
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <span className="mr-2">{component.icon}</span>
                      {component.name}
                    </Button>
                  ))}
                </TabsContent>
                
                <TabsContent value="waves" className="space-y-2 mt-4">
                  {waveComponents.map((component) => (
                    <Button
                      key={component.id}
                      onClick={() => addComponent(component.id)}
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <span className="mr-2">{component.icon}</span>
                      {component.name}
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-card/90">
            <CardHeader>
              <CardTitle className="text-lg">Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={runSimulation}
                disabled={isSimulating || components.length === 0}
                className="w-full bg-quantum-green hover:bg-quantum-green/80"
              >
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Симуляция...' : 'Запустить'}
              </Button>
              
              <Button
                onClick={clearLab}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Очистить
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Save className="w-3 h-3 mr-1" />
                  Сохранить
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-3 h-3 mr-1" />
                  Поделиться
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Component Properties */}
          {renderComponentProperties()}
        </div>

        {/* Main Lab Area */}
        <div className="lg:col-span-3">
          <Card className="bg-card/90 h-[600px]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Рабочая область</span>
                <Badge>{components.length} компонентов</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div 
                className="relative w-full h-full bg-lab-dark overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px ${gridSize}px`
                }}
              >
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {isSimulating && (
                    <div className="absolute inset-0 bg-quantum-blue/5 animate-pulse" />
                  )}
                </div>

                {/* Components */}
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`absolute cursor-pointer transform hover:scale-110 transition-all duration-200 ${
                      selectedComponent === component.id ? 'ring-2 ring-quantum-blue' : ''
                    }`}
                    style={{
                      left: component.x,
                      top: component.y,
                      transform: `rotate(${component.rotation}deg)`
                    }}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <div className="bg-lab-surface/80 backdrop-blur-sm border border-lab-border rounded-lg p-3 min-w-[60px] text-center">
                      <div className="text-2xl mb-1">{getComponentIcon(component.type)}</div>
                      <div className="text-xs text-muted-foreground">
                        {component.type.replace('_', ' ')}
                      </div>
                      {isSimulating && (
                        <div className="absolute -inset-2 border-2 border-quantum-orange rounded-lg animate-ping" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Instructions */}
                {components.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Beaker className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Добро пожаловать в интерактивную лабораторию!</p>
                      <p className="text-sm">Выберите компоненты слева, чтобы начать эксперимент</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Educational Info */}
          <Card className="bg-gradient-to-r from-lab-surface to-quantum-blue/5 mt-4">
            <CardHeader>
              <CardTitle className="text-lg">💡 Подсказки по экспериментам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-quantum-yellow mb-1">Электрические цепи</h4>
                  <p className="text-muted-foreground">
                    Соединяйте батарейки, резисторы и светодиоды для изучения законов Ома
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-quantum-blue mb-1">Оптические схемы</h4>
                  <p className="text-muted-foreground">
                    Используйте линзы и призмы для изучения преломления и фокусировки света
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-quantum-purple mb-1">Волновые явления</h4>
                  <p className="text-muted-foreground">
                    Создавайте источники волн и наблюдайте интерференцию и дифракцию
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhysicsLab;
