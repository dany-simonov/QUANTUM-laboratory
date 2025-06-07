
import React, { useState } from 'react';
import { Book, Award, Calendar, MapPin, Lightbulb, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ScientistProfileProps {
  unlockedScientists: string[];
  playerLevel: number;
}

interface Scientist {
  id: string;
  name: string;
  nameRu: string;
  birth: string;
  death?: string;
  nationality: string;
  field: string;
  discoveries: string[];
  biography: string;
  achievements: string[];
  quotes: string[];
  unlockLevel: number;
  image: string;
}

const ScientistProfile: React.FC<ScientistProfileProps> = ({ unlockedScientists, playerLevel }) => {
  const [selectedScientist, setSelectedScientist] = useState<string>('einstein');

  const scientists: Scientist[] = [
    {
      id: 'einstein',
      name: 'Albert Einstein',
      nameRu: 'Альберт Эйнштейн',
      birth: '1879',
      death: '1955',
      nationality: 'Германия/США',
      field: 'Теоретическая физика',
      discoveries: [
        'Теория относительности',
        'Фотоэлектрический эффект',
        'Броуновское движение',
        'Квантовая теория света'
      ],
      biography: 'Альберт Эйнштейн — немецко-американский физик-теоретик, один из основателей современной теоретической физики. Лауреат Нобелевской премии по физике 1921 года.',
      achievements: [
        'Нобелевская премия по физике (1921)',
        'Копли медаль (1925)',
        'Медаль Франклина (1935)',
        'Создание теории относительности'
      ],
      quotes: [
        '"Воображение важнее знания"',
        '"Бог не играет в кости"',
        '"Стремись не к тому, чтобы добиться успеха, а к тому, чтобы твоя жизнь имела смысл"'
      ],
      unlockLevel: 1,
      image: '🧑‍🔬'
    },
    {
      id: 'curie',
      name: 'Marie Curie',
      nameRu: 'Мария Кюри',
      birth: '1867',
      death: '1934',
      nationality: 'Польша/Франция',
      field: 'Физика и химия',
      discoveries: [
        'Радиоактивность',
        'Открытие полония',
        'Открытие радия',
        'Изоляция чистого радия'
      ],
      biography: 'Мария Склодовская-Кюри — польско-французский физик и химик, первая женщина, получившая Нобелевскую премию, и единственная, кто получил её в двух разных науках.',
      achievements: [
        'Нобелевская премия по физике (1903)',
        'Нобелевская премия по химии (1911)',
        'Первая женщина-профессор в Сорбонне',
        'Основание Института радия'
      ],
      quotes: [
        '"Ничто в жизни не следует бояться, это нужно только понимать"',
        '"Я принадлежу к тем, кто думает, что наука обладает великой красотой"'
      ],
      unlockLevel: 2,
      image: '👩‍🔬'
    },
    {
      id: 'bohr',
      name: 'Niels Bohr',
      nameRu: 'Нильс Бор',
      birth: '1885',
      death: '1962',
      nationality: 'Дания',
      field: 'Атомная физика',
      discoveries: [
        'Модель атома Бора',
        'Принцип дополнительности',
        'Копенгагенская интерпретация',
        'Теория атомного ядра'
      ],
      biography: 'Нильс Хенрик Давид Бор — датский физик-теоретик, один из создателей современной физики. Лауреат Нобелевской премии по физике 1922 года.',
      achievements: [
        'Нобелевская премия по физике (1922)',
        'Орден Слона (1947)',
        'Атомы мира в честь Бора (1997)',
        'Основание Института теоретической физики'
      ],
      quotes: [
        '"Противоположность правильного утверждения — ложное утверждение. Но противоположность глубокой истины может быть другой глубокой истиной"',
        '"Предсказание очень трудно, особенно о будущем"'
      ],
      unlockLevel: 3,
      image: '🧪'
    },
    {
      id: 'heisenberg',
      name: 'Werner Heisenberg',
      nameRu: 'Вернер Гейзенберг',
      birth: '1901',
      death: '1976',
      nationality: 'Германия',
      field: 'Квантовая механика',
      discoveries: [
        'Принцип неопределённости',
        'Матричная механика',
        'Квантовая теория поля',
        'Изоспин'
      ],
      biography: 'Вернер Карл Гейзенберг — немецкий физик-теоретик, один из создателей квантовой механики. Лауреат Нобелевской премии по физике 1932 года.',
      achievements: [
        'Нобелевская премия по физике (1932)',
        'Медаль Макса Планка (1933)',
        'Орден За заслуги (1959)',
        'Формулировка принципа неопределённости'
      ],
      quotes: [
        '"То, что мы наблюдаем, — это не природа сама по себе, а природа, открытая нашему способу постановки вопросов"',
        '"Первый глоток из чаши естественных наук делает атеистом, но на дне чаши ждёт Бог"'
      ],
      unlockLevel: 4,
      image: '⚛️'
    }
  ];

  const currentScientist = scientists.find(s => s.id === selectedScientist);
  const isUnlocked = (scientist: Scientist) => 
    playerLevel >= scientist.unlockLevel || unlockedScientists.includes(scientist.id);

  return (
    <div className="space-y-6">
      <Card className="energy-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-quantum-green flex items-center gap-3">
            <Book className="w-8 h-8" />
            Великие Физики
          </CardTitle>
          <p className="text-muted-foreground">
            Изучайте биографии выдающихся ученых и их открытия
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scientists List */}
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Ученые</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scientists.map((scientist) => {
              const unlocked = isUnlocked(scientist);
              return (
                <Button
                  key={scientist.id}
                  onClick={() => unlocked && setSelectedScientist(scientist.id)}
                  variant={selectedScientist === scientist.id ? "default" : "ghost"}
                  className={`w-full justify-start ${!unlocked ? 'opacity-50' : ''}`}
                  disabled={!unlocked}
                >
                  <span className="text-lg mr-3">{scientist.image}</span>
                  <div className="text-left">
                    <div className="font-medium">
                      {unlocked ? scientist.nameRu : '???'}
                    </div>
                    {unlocked ? (
                      <div className="text-sm text-muted-foreground">
                        {scientist.field}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Уровень {scientist.unlockLevel}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Scientist Profile */}
        <div className="lg:col-span-2">
          {currentScientist && isUnlocked(currentScientist) && (
            <div className="space-y-6">
              {/* Main Info */}
              <Card className="energy-border bg-card/90">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{currentScientist.image}</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-glow text-quantum-blue">
                        {currentScientist.nameRu}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground mb-2">
                        {currentScientist.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-quantum-purple/20 text-quantum-purple">
                          <Calendar className="w-3 h-3 mr-1" />
                          {currentScientist.birth}
                          {currentScientist.death && ` - ${currentScientist.death}`}
                        </Badge>
                        <Badge className="bg-quantum-green/20 text-quantum-green">
                          <MapPin className="w-3 h-3 mr-1" />
                          {currentScientist.nationality}
                        </Badge>
                        <Badge className="bg-quantum-orange/20 text-quantum-orange">
                          {currentScientist.field}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentScientist.biography}
                  </p>
                </CardContent>
              </Card>

              {/* Discoveries */}
              <Card className="bg-card/90">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-quantum-yellow" />
                    Открытия и вклад в науку
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentScientist.discoveries.map((discovery, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-lg bg-lab-surface/50 border border-lab-border"
                      >
                        <Star className="w-4 h-4 text-quantum-yellow" />
                        <span className="text-sm">{discovery}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-card/90">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-quantum-orange" />
                    Награды и достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentScientist.achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-quantum-orange rounded-full" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quotes */}
              <Card className="bg-gradient-to-r from-lab-surface to-quantum-blue/5">
                <CardHeader>
                  <CardTitle className="text-lg">Знаменитые цитаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentScientist.quotes.map((quote, index) => (
                      <blockquote 
                        key={index}
                        className="border-l-4 border-quantum-blue pl-4 italic text-muted-foreground"
                      >
                        {quote}
                      </blockquote>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentScientist && !isUnlocked(currentScientist) && (
            <Card className="energy-border bg-card/90">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Ученый заблокирован</h3>
                <p className="text-muted-foreground">
                  Достигните {currentScientist.unlockLevel} уровня, чтобы изучить биографию этого ученого
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScientistProfile;
