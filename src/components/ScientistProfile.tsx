
import React, { useState } from 'react';
import { Book, Award, Calendar, MapPin, Lightbulb, Star, Lock } from 'lucide-react';
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
    // Уровень 1
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
      biography: 'Альберт Эйнштейн — немецко-американский физик-теоретик, один из основателей современной теоретической физики. Лауреат Нобелевской премии по физике 1921 года за объяснение фотоэлектрического эффекта.',
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

    // Уровень 2
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
      id: 'planck',
      name: 'Max Planck',
      nameRu: 'Макс Планк',
      birth: '1858',
      death: '1947',
      nationality: 'Германия',
      field: 'Теоретическая физика',
      discoveries: [
        'Квантование энергии',
        'Формула излучения абсолютно черного тела',
        'Основы квантовой механики',
        'Постоянная Планка'
      ],
      biography: 'Макс Планк — основатель квантовой теории, лауреат Нобелевской премии по физике 1918 года.',
      achievements: [
        'Нобелевская премия по физике (1918)',
        'Медаль Копли (1929)',
        'Основание квантовой теории'
      ],
      quotes: [
        '"Наука не может решить последнюю загадку природы, потому что мы сами являемся частью природы"'
      ],
      unlockLevel: 2,
      image: '⚛️'
    },

    // Уровень 3
    {
      id: 'landau',
      name: 'Lev Landau',
      nameRu: 'Лев Ландау',
      birth: '1908',
      death: '1968',
      nationality: 'СССР/Россия',
      field: 'Теоретическая физика',
      discoveries: [
        'Теория сверхтекучести',
        'Теория фазовых переходов',
        'Ландауово затухание',
        'Курс теоретической физики'
      ],
      biography: 'Лев Давидович Ландау — советский физик-теоретик, академик АН СССР. Лауреат Нобелевской премии по физике 1962 года за пионерские теории конденсированных сред, особенно жидкого гелия.',
      achievements: [
        'Нобелевская премия по физике (1962)',
        'Герой Социалистического Труда (1954)',
        'Орден Ленина (трижды)',
        'Создание школы теоретической физики'
      ],
      quotes: [
        '"Космология — это наука для тех, кто слишком ленив для физики"',
        '"Разделяй и властвуй — хороший принцип, но объединяй и направляй — ещё лучше"'
      ],
      unlockLevel: 3,
      image: '🇷🇺'
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
      biography: 'Нильс Хенрик Давид Бор — датский физик-теоретик, один из создателей современной физики. Лауреат Нобелевской премии по физике 1922 года за исследование структуры атомов.',
      achievements: [
        'Нобелевская премия по физике (1922)',
        'Орден Слона (1947)',
        'Атомы мира в честь Бора (1997)',
        'Основание Института теоретической физики'
      ],
      quotes: [
        '"Противоположность правильного утверждения — ложное утверждение"',
        '"Предсказание очень трудно, особенно о будущем"'
      ],
      unlockLevel: 3,
      image: '🧪'
    },

    // Уровень 4
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
        '"То, что мы наблюдаем, — это не природа сама по себе"',
        '"Первый глоток из чаши наук делает атеистом"'
      ],
      unlockLevel: 4,
      image: '⚛️'
    },
    {
      id: 'schrodinger',
      name: 'Erwin Schrödinger',
      nameRu: 'Эрвин Шрёдингер',
      birth: '1887',
      death: '1961',
      nationality: 'Австрия',
      field: 'Квантовая механика',
      discoveries: [
        'Уравнение Шрёдингера',
        'Волновая механика',
        'Кошка Шрёдингера (парадокс)',
        'Квантовая биология'
      ],
      biography: 'Эрвин Шрёдингер — создатель волновой механики и уравнения Шрёдингера.',
      achievements: [
        'Нобелевская премия по физике (1933)',
        'Медаль Макса Планка (1937)'
      ],
      quotes: [
        '"В науке нет ничего более практичного, чем хорошая теория"'
      ],
      unlockLevel: 4,
      image: '🐱'
    },

    // Уровень 5
    {
      id: 'feynman',
      name: 'Richard Feynman',
      nameRu: 'Ричард Фейнман',
      birth: '1918',
      death: '1988',
      nationality: 'США',
      field: 'Квантовая электродинамика',
      discoveries: [
        'Диаграммы Фейнмана',
        'Квантовая электродинамика',
        'Партонная модель',
        'Квантовые компьютеры'
      ],
      biography: 'Ричард Филлипс Фейнман — американский физик-теоретик, один из создателей квантовой электродинамики. Лауреат Нобелевской премии по физике 1965 года.',
      achievements: [
        'Нобелевская премия по физике (1965)',
        'Медаль Альберта Эйнштейна (1954)',
        'Участие в Манхэттенском проекте',
        'Создание диаграмм Фейнмана'
      ],
      quotes: [
        '"Изучай усердно то, что тебя больше всего интересует"',
        '"Я лучше хочу иметь вопросы, на которые нет ответа"'
      ],
      unlockLevel: 5,
      image: '🎯'
    },
    {
      id: 'dirac',
      name: 'Paul Dirac',
      nameRu: 'Пол Дирак',
      birth: '1902',
      death: '1984',
      nationality: 'Великобритания',
      field: 'Теоретическая физика',
      discoveries: [
        'Уравнение Дирака',
        'Предсказание позитрона',
        'Основы квантовой электродинамики',
        'Дельта-функция Дирака'
      ],
      biography: 'Пол Дирак — один из основателей квантовой механики и квантовой электродинамики.',
      achievements: [
        'Нобелевская премия по физике (1933)',
        'Медаль Копли (1952)'
      ],
      quotes: [
        '"Красота — это критерий истины"'
      ],
      unlockLevel: 5,
      image: '🔮'
    },

    // Уровень 6
    {
      id: 'maxwell',
      name: 'James Clerk Maxwell',
      nameRu: 'Джеймс Клерк Максвелл',
      birth: '1831',
      death: '1879',
      nationality: 'Великобритания',
      field: 'Классическая физика',
      discoveries: [
        'Уравнения Максвелла',
        'Теория электромагнитного поля',
        'Основы теории света как электромагнитной волны',
        'Кинетическая теория газов'
      ],
      biography: 'Максвелл — создатель уравнений Максвелла, объединивших электричество и магнетизм.',
      achievements: [
        'Медаль Копли (1871)',
        'Объединение электричества и магнетизма'
      ],
      quotes: [
        '"Наука — это построение моделей, которые объясняют наблюдаемое"'
      ],
      unlockLevel: 6,
      image: '⚡'
    },
    {
      id: 'galilei',
      name: 'Galileo Galilei',
      nameRu: 'Галилео Галилей',
      birth: '1564',
      death: '1642',
      nationality: 'Италия',
      field: 'Механика, астрономия',
      discoveries: [
        'Законы движения тел',
        'Открытие спутников Юпитера',
        'Подтверждение гелиоцентрической системы',
        'Принцип инерции'
      ],
      biography: 'Галилей — основоположник экспериментальной науки, создатель телескопа и основатель классической механики.',
      achievements: [
        'Почетный профессор Пизанского университета',
        'Отец экспериментальной науки'
      ],
      quotes: [
        '"И всё-таки она вертится"'
      ],
      unlockLevel: 6,
      image: '🔭'
    },

    // Уровень 7
    {
      id: 'newton',
      name: 'Isaac Newton',
      nameRu: 'Исаак Ньютон',
      birth: '1643',
      death: '1727',
      nationality: 'Великобритания',
      field: 'Механика, оптика, математика',
      discoveries: [
        'Законы Ньютона',
        'Закон всемирного тяготения',
        'Исследования света и оптики',
        'Математический анализ'
      ],
      biography: 'Ньютон — создатель классической механики, законов движения и гравитации.',
      achievements: [
        'Президент Королевского общества',
        'Создание классической механики'
      ],
      quotes: [
        '"Если я видел дальше других, то потому, что стоял на плечах гигантов"'
      ],
      unlockLevel: 7,
      image: '🍎'
    },
    {
      id: 'goeppert_mayer',
      name: 'Maria Goeppert-Mayer',
      nameRu: 'Мария Гёпперт-Майер',
      birth: '1906',
      death: '1972',
      nationality: 'США/Германия',
      field: 'Ядерная физика',
      discoveries: [
        'Ядерная оболочечная модель',
        'Магические числа в ядерной физике',
        'Спин-орбитальное взаимодействие',
        'Двухфотонное поглощение'
      ],
      biography: 'Мария Гёпперт-Майер — одна из создателей ядерной оболочечной модели атома, лауреат Нобелевской премии 1963 года.',
      achievements: [
        'Нобелевская премия по физике (1963)',
        'Первая женщина-теоретик с Нобелевской премией по физике'
      ],
      quotes: [
        '"Наука — это не только знание, но и понимание"'
      ],
      unlockLevel: 7,
      image: '👩‍🔬'
    },

    // Уровень 8
    {
      id: 'fermi',
      name: 'Enrico Fermi',
      nameRu: 'Энрико Ферми',
      birth: '1901',
      death: '1954',
      nationality: 'Италия/США',
      field: 'Ядерная физика',
      discoveries: [
        'Теория слабого взаимодействия',
        'Первый управляемый ядерный реактор',
        'Вклад в развитие квантовой статистики',
        'Ферми-резонанс'
      ],
      biography: 'Энрико Ферми — создатель первого ядерного реактора, лауреат Нобелевской премии 1938 года.',
      achievements: [
        'Нобелевская премия по физике (1938)',
        'Манхэттенский проект'
      ],
      quotes: [
        '"Наука — это способ задавать вопросы природе"'
      ],
      unlockLevel: 8,
      image: '⚛️'
    },
    {
      id: 'chadwick',
      name: 'James Chadwick',
      nameRu: 'Джеймс Чедвик',
      birth: '1891',
      death: '1974',
      nationality: 'Великобритания',
      field: 'Ядерная физика',
      discoveries: [
        'Открытие нейтрона',
        'Вклад в развитие ядерной физики',
        'Исследования радиоактивности',
        'Ядерные реакции'
      ],
      biography: 'Чедвик — открыватель нейтрона, лауреат Нобелевской премии 1935 года.',
      achievements: [
        'Нобелевская премия по физике (1935)',
        'Открытие нейтрона (1932)'
      ],
      quotes: [
        '"Истина в науке — это не догма, а результат эксперимента"'
      ],
      unlockLevel: 8,
      image: '⚛️'
    },

    // Уровень 9
    {
      id: 'meitner',
      name: 'Lise Meitner',
      nameRu: 'Лиза Мейтнер',
      birth: '1878',
      death: '1968',
      nationality: 'Австрия/Швеция',
      field: 'Ядерная физика',
      discoveries: [
        'Теоретическое объяснение ядерного деления',
        'Вклад в развитие ядерной физики',
        'Открытие протактиния',
        'Исследования радиоактивности'
      ],
      biography: 'Лиза Мейтнер — одна из первооткрывателей ядерного деления.',
      achievements: [
        'Медаль Макса Планка (1949)',
        'Элемент мейтнерий назван в её честь'
      ],
      quotes: [
        '"Наука — это поиск истины, даже если она непопулярна"'
      ],
      unlockLevel: 9,
      image: '☢️'
    },
    {
      id: 'faraday',
      name: 'Michael Faraday',
      nameRu: 'Майкл Фарадей',
      birth: '1791',
      death: '1867',
      nationality: 'Великобритания',
      field: 'Электромагнетизм',
      discoveries: [
        'Электромагнитная индукция',
        'Закон Фарадея',
        'Исследования электролиза',
        'Понятие электрического поля'
      ],
      biography: 'Фарадей — основатель электромагнетизма, открыл электромагнитную индукцию.',
      achievements: [
        'Медаль Копли (1832)',
        'Основание электрохимии'
      ],
      quotes: [
        '"Величайшее открытие — это осознание того, что мы можем понять природу"'
      ],
      unlockLevel: 9,
      image: '🔌'
    },

    // Уровень 10
    {
      id: 'gauss',
      name: 'Carl Friedrich Gauss',
      nameRu: 'Карл Фридрих Гаусс',
      birth: '1777',
      death: '1855',
      nationality: 'Германия',
      field: 'Математика, физика',
      discoveries: [
        'Закон Гаусса в электростатике',
        'Методы численного анализа',
        'Исследования магнитного поля Земли',
        'Теория чисел'
      ],
      biography: 'Гаусс — один из величайших математиков и физиков, внёс вклад в геометрию, астрономию и магнетизм.',
      achievements: [
        'Медаль Копли (1838)',
        '"Король математики"'
      ],
      quotes: [
        '"Математика — царица наук"'
      ],
      unlockLevel: 10,
      image: '📐'
    },
    {
      id: 'mendeleev',
      name: 'Dmitri Mendeleev',
      nameRu: 'Дмитрий Менделеев',
      birth: '1834',
      death: '1907',
      nationality: 'Россия',
      field: 'Химия',
      discoveries: [
        'Периодический закон и таблица элементов',
        'Исследования в области химии и технологии',
        'Теория растворов',
        'Работы по метрологии'
      ],
      biography: 'Создатель периодической таблицы элементов, основоположник современной химии.',
      achievements: [
        'Орден Святого Станислава',
        'Почётный член многих научных обществ'
      ],
      quotes: [
        '"Периодический закон — основа всей химии"'
      ],
      unlockLevel: 10,
      image: '🧪'
    },

    // Уровень 11
    {
      id: 'kurchatov',
      name: 'Igor Kurchatov',
      nameRu: 'Игорь Курчатов',
      birth: '1903',
      death: '1960',
      nationality: 'СССР',
      field: 'Ядерная физика',
      discoveries: [
        'Руководство созданием первого советского ядерного реактора',
        'Вклад в развитие ядерной энергетики',
        'Создание атомной бомбы',
        'Мирный атом'
      ],
      biography: 'Отец советской атомной бомбы, основатель советской ядерной программы.',
      achievements: [
        'Герой Социалистического Труда',
        'Ленинская премия'
      ],
      quotes: [
        '"Наука — основа мощи государства"'
      ],
      unlockLevel: 11,
      image: '☢️'
    },
    {
      id: 'sakharov',
      name: 'Andrei Sakharov',
      nameRu: 'Андрей Сахаров',
      birth: '1921',
      death: '1989',
      nationality: 'СССР',
      field: 'Физика, общественный деятель',
      discoveries: [
        'Вклад в термоядерный синтез',
        'Исследования в области физики плазмы',
        'Барионная асимметрия Вселенной',
        'Условия Сахарова'
      ],
      biography: 'Создатель советской водородной бомбы, правозащитник.',
      achievements: [
        'Ленинская премия',
        'Нобелевская премия мира (1975)'
      ],
      quotes: [
        '"Свобода — неотъемлемое право человека"'
      ],
      unlockLevel: 11,
      image: '☮️'
    },

    // Уровень 12
    {
      id: 'korolev',
      name: 'Sergei Korolev',
      nameRu: 'Сергей Королёв',
      birth: '1907',
      death: '1966',
      nationality: 'СССР',
      field: 'Ракетостроение, космонавтика',
      discoveries: [
        'Разработка первых советских ракет и космических аппаратов',
        'Запуск первого спутника и полёт Юрия Гагарина',
        'Создание космической программы',
        'Межпланетные станции'
      ],
      biography: 'Главный конструктор советской космической программы.',
      achievements: [
        'Герой Социалистического Труда',
        'Ленинская премия'
      ],
      quotes: [
        '"Космос — новая граница человечества"'
      ],
      unlockLevel: 12,
      image: '🚀'
    },
    {
      id: 'lobachevsky',
      name: 'Nikolai Lobachevsky',
      nameRu: 'Николай Лобачевский',
      birth: '1792',
      death: '1856',
      nationality: 'Россия',
      field: 'Математика',
      discoveries: [
        'Разработка гиперболической геометрии',
        'Вклад в развитие математического анализа',
        'Неевклидова геометрия',
        'Основы современной геометрии'
      ],
      biography: 'Основатель неевклидовой геометрии.',
      achievements: [
        'Почётный член Петербургской академии наук'
      ],
      quotes: [
        '"Геометрия — царица наук"'
      ],
      unlockLevel: 12,
      image: '📐'
    },

    // Уровень 13
    {
      id: 'tsiolkovsky',
      name: 'Konstantin Tsiolkovsky',
      nameRu: 'Константин Циолковский',
      birth: '1857',
      death: '1935',
      nationality: 'Россия',
      field: 'Космонавтика, инженерия',
      discoveries: [
        'Формулы ракетного движения',
        'Идеи многоступенчатых ракет',
        'Теория космических полётов',
        'Концепция космических лифтов'
      ],
      biography: 'Основоположник теоретической космонавтики.',
      achievements: [
        'Заслуженный деятель науки РСФСР'
      ],
      quotes: [
        '"Земля — колыбель разума, но нельзя вечно жить в колыбели"'
      ],
      unlockLevel: 13,
      image: '🚀'
    },
    {
      id: 'cherenkov',
      name: 'Pavel Cherenkov',
      nameRu: 'Павел Черенков',
      birth: '1904',
      death: '1990',
      nationality: 'СССР',
      field: 'Физика',
      discoveries: [
        'Открытие эффекта Черенкова',
        'Вклад в физику элементарных частиц',
        'Черенковское излучение',
        'Детекторы частиц'
      ],
      biography: 'Открытие черенковского излучения.',
      achievements: [
        'Нобелевская премия по физике (1958)'
      ],
      quotes: [
        '"Каждое открытие — шаг к пониманию природы"'
      ],
      unlockLevel: 13,
      image: '💙'
    },

    // Уровень 14
    {
      id: 'friedman',
      name: 'Alexander Friedmann',
      nameRu: 'Александр Фридман',
      birth: '1888',
      death: '1925',
      nationality: 'Россия',
      field: 'Космология, математика',
      discoveries: [
        'Уравнения Фридмана в общей теории относительности',
        'Теория расширяющейся Вселенной',
        'Космологические модели',
        'Основы современной космологии'
      ],
      biography: 'Создатель первых моделей расширяющейся Вселенной.',
      achievements: [
        'Почётный член академий'
      ],
      quotes: [
        '"Вселенная динамична и изменчива"'
      ],
      unlockLevel: 14,
      image: '🌌'
    },
    {
      id: 'basov',
      name: 'Nikolai Basov',
      nameRu: 'Николай Басов',
      birth: '1922',
      death: '2001',
      nationality: 'СССР',
      field: 'Физика',
      discoveries: [
        'Создание первых лазеров и мазеров',
        'Вклад в квантовую электронику',
        'Теория лазеров',
        'Применения лазеров'
      ],
      biography: 'Один из основателей лазерной и квантовой электроники.',
      achievements: [
        'Нобелевская премия по физике (1964)'
      ],
      quotes: [
        '"Наука — ключ к будущему человечества"'
      ],
      unlockLevel: 14,
      image: '🔦'
    },

    // Уровень 15
    {
      id: 'mechnikov',
      name: 'Ilya Mechnikov',
      nameRu: 'Илья Мечников',
      birth: '1845',
      death: '1916',
      nationality: 'Россия',
      field: 'Микробиология, иммунология',
      discoveries: [
        'Теория фагоцитоза',
        'Вклад в иммунологию и микробиологию',
        'Клеточный иммунитет',
        'Геронтология'
      ],
      biography: 'Основатель науки об иммунитете, лауреат Нобелевской премии.',
      achievements: [
        'Нобелевская премия по физиологии и медицине (1908)'
      ],
      quotes: [
        '"Жизнь — борьба, и иммунитет — её оружие"'
      ],
      unlockLevel: 15,
      image: '🦠'
    },
    {
      id: 'popov',
      name: 'Alexander Popov',
      nameRu: 'Александр Попов',
      birth: '1859',
      death: '1906',
      nationality: 'Россия',
      field: 'Радиотехника',
      discoveries: [
        'Изобретение радио-приёмника',
        'Вклад в развитие радиосвязи',
        'Первые радиопередачи',
        'Основы радиотехники'
      ],
      biography: 'Один из изобретателей радио.',
      achievements: [
        'Почётный член академий'
      ],
      quotes: [
        '"Связь — основа прогресса"'
      ],
      unlockLevel: 15,
      image: '📻'
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
            Великие Физики и Ученые
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
            <p className="text-sm text-muted-foreground">
              Разблокируйте новых ученых, повышая уровень
            </p>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {scientists.map((scientist) => {
              const unlocked = isUnlocked(scientist);
              return (
                <Button
                  key={scientist.id}
                  onClick={() => unlocked && setSelectedScientist(scientist.id)}
                  variant={selectedScientist === scientist.id ? "default" : "ghost"}
                  className={`w-full justify-start ${!unlocked ? 'opacity-50' : ''}`}
                  disabled={!unlocked}
                  size="sm"
                >
                  <span className="text-sm mr-2">
                    {unlocked ? scientist.image : <Lock className="w-3 h-3" />}
                  </span>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">
                      {unlocked ? scientist.nameRu : '???'}
                    </div>
                    {unlocked ? (
                      <div className="text-xs text-muted-foreground">
                        {scientist.field}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
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
                <p className="text-muted-foreground mb-4">
                  Достигните {currentScientist.unlockLevel} уровня, чтобы изучить биографию этого ученого
                </p>
                <Badge variant="outline">
                  Текущий уровень: {playerLevel}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScientistProfile;
