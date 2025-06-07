
import React, { useState } from 'react';
import { User, ArrowLeft, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  const famousPhysicists = [
    'Альберт Эйнштейн',
    'Мария Кюри',
    'Нильс Бор',
    'Вернер Гейзенберг',
    'Ричард Фейнман',
    'Стивен Хокинг'
  ];

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-quantum-blue hover:text-quantum-blue/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад в главное меню
        </Button>

        <Card className="energy-border bg-card/90">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Atom className="w-16 h-16 text-quantum-blue animate-energy-pulse" />
                <div className="absolute inset-0 animate-spin">
                  <div className="w-16 h-16 border-2 border-transparent border-t-quantum-purple rounded-full" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-glow text-quantum-blue">
              Регистрация в Лаборатории
            </CardTitle>
            <p className="text-muted-foreground">
              Введите имя вашего исследователя
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-quantum-green mb-2 block">
                  Имя исследователя
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-lab-surface border-lab-border text-foreground placeholder:text-muted-foreground"
                  maxLength={20}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-quantum-blue hover:bg-quantum-blue/80 text-black font-semibold"
                disabled={!name.trim()}
              >
                <User className="w-4 h-4 mr-2" />
                Войти в Лабораторию
              </Button>
            </form>

            {/* Famous Physicists for inspiration */}
            <div className="mt-6 pt-6 border-t border-lab-border">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Или выберите имя знаменитого физика:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {famousPhysicists.map((physicist) => (
                  <Button
                    key={physicist}
                    variant="ghost"
                    size="sm"
                    onClick={() => setName(physicist)}
                    className="text-xs hover:text-quantum-purple hover:bg-quantum-purple/10"
                  >
                    {physicist}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
