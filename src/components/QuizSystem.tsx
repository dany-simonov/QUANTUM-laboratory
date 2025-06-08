
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  category: 'celebrities' | 'physics';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  description: string;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Русские учёные и изобретатели",
    category: "celebrities",
    difficulty: "easy",
    description: "Проверьте знания о великих российских учёных",
    questions: [
      {
        id: 1,
        question: "Кто создал периодическую таблицу элементов?",
        options: ["Менделеев", "Ландау", "Королёв"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Кто считается основателем советской ядерной программы?",
        options: ["Курчатов", "Черенков", "Фридман"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Кто был главным конструктором советской космической программы?",
        options: ["Королёв", "Гейм", "Новосёлов"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Кто доказал гипотезу Пуанкаре?",
        options: ["Перельман", "Оганов", "Басов"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Кто открыл черенковское излучение?",
        options: ["Черенков", "Ландау", "Вернадский"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    title: "Мировые знаменитости науки",
    category: "celebrities",
    difficulty: "easy",
    description: "Тест о всемирно известных учёных",
    questions: [
      {
        id: 1,
        question: "Кто сформулировал закон всемирного тяготения?",
        options: ["Ньютон", "Эйнштейн", "Фейнман"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Кто создал уравнение Шрёдингера?",
        options: ["Шрёдингер", "Дирак", "Бор"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Кто открыл радиоактивность?",
        options: ["Кюри", "Планк", "Фарадей"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Кто является основателем теории относительности?",
        options: ["Эйнштейн", "Ньютон", "Максвелл"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Кто разработал диаграммы для квантовой электродинамики?",
        options: ["Фейнман", "Дирак", "Бор"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 3,
    title: "Механика и движение",
    category: "physics",
    difficulty: "easy",
    description: "Основы механики для 6-7 классов",
    questions: [
      {
        id: 1,
        question: "Что такое скорость?",
        options: ["Путь, пройденный за единицу времени", "Время движения", "Ускорение тела"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Если тело движется с постоянным ускорением, то его скорость:",
        options: ["Увеличивается равномерно", "Остаётся постоянной", "Уменьшается"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Как называется сила, которая притягивает тела друг к другу?",
        options: ["Сила тяжести", "Сила трения", "Сила упругости"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Что происходит с телом, если на него не действуют силы?",
        options: ["Оно движется равномерно и прямолинейно", "Останавливается", "Ускоряется"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Единица измерения силы в системе СИ:",
        options: ["Ньютон", "Джоуль", "Паскаль"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 4,
    title: "Электричество",
    category: "physics",
    difficulty: "medium",
    description: "Основы электричества для 8 класса",
    questions: [
      {
        id: 1,
        question: "Что измеряет амперметр?",
        options: ["Силу тока", "Напряжение", "Сопротивление"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Как соединяются резисторы, если нужно увеличить общее сопротивление?",
        options: ["Последовательно", "Параллельно", "Любым способом"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Единица измерения электрического сопротивления:",
        options: ["Ом", "Вольт", "Ампер"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Что происходит с током при последовательном соединении проводников?",
        options: ["Ток одинаков во всех проводниках", "Ток уменьшается", "Ток увеличивается"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Какой прибор измеряет напряжение?",
        options: ["Вольтметр", "Амперметр", "Омметр"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 5,
    title: "Оптика",
    category: "physics",
    difficulty: "medium",
    description: "Световые явления для 8 класса",
    questions: [
      {
        id: 1,
        question: "Как называется явление изменения направления света при переходе из одной среды в другую?",
        options: ["Преломление", "Отражение", "Диффракция"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Какая линза собирает световые лучи?",
        options: ["Собирающая", "Рассеивающая", "Плоская"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Что происходит при полном внутреннем отражении?",
        options: ["Свет полностью отражается внутри среды", "Свет проходит сквозь границу", "Свет рассеивается"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Какая часть спектра видна человеческому глазу?",
        options: ["Видимый свет", "Ультрафиолет", "Инфракрасный"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Что такое фокусное расстояние линзы?",
        options: ["Расстояние от центра линзы до точки фокуса", "Толщина линзы", "Длина волны света"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 6,
    title: "Тепловые явления",
    category: "physics",
    difficulty: "medium",
    description: "Тепловые процессы для 8 класса",
    questions: [
      {
        id: 1,
        question: "Как называется процесс передачи тепла через прямой контакт тел?",
        options: ["Теплопроводность", "Конвекция", "Излучение"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Что происходит при испарении?",
        options: ["Жидкость превращается в пар при любой температуре", "Жидкость кипит", "Пар превращается в жидкость"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Единица измерения температуры в системе СИ:",
        options: ["Кельвин", "Цельсий", "Фаренгейт"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Что такое удельная теплоёмкость?",
        options: ["Количество тепла, необходимое для нагрева 1 кг вещества на 1 градус", "Температура кипения вещества", "Количество тепла, выделяемое при сгорании"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Какой способ передачи тепла не требует вещества?",
        options: ["Излучение", "Конвекция", "Теплопроводность"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 7,
    title: "Звук и волны",
    category: "physics",
    difficulty: "medium",
    description: "Акустика для 9 класса",
    questions: [
      {
        id: 1,
        question: "Что такое звук?",
        options: ["Механическая волна, распространяющаяся в среде", "Электромагнитная волна", "Световая волна"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Скорость звука в воздухе примерно равна:",
        options: ["340 м/с", "3000 м/с", "150 м/с"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Что такое частота звука?",
        options: ["Количество колебаний в секунду", "Амплитуда волны", "Длина волны"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Как называется явление, когда звуковые волны накладываются друг на друга?",
        options: ["Интерференция", "Рефракция", "Дифракция"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Чем выше частота звука, тем:",
        options: ["Выше тон", "Ниже тон", "Громче звук"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 8,
    title: "Электромагнетизм",
    category: "physics",
    difficulty: "hard",
    description: "Электромагнитные явления для 9 класса",
    questions: [
      {
        id: 1,
        question: "Что создаёт магнитное поле?",
        options: ["Движущийся электрический заряд", "Стационарный заряд", "Тепло"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Как называется явление возникновения тока в проводнике при изменении магнитного поля?",
        options: ["Электромагнитная индукция", "Электролиз", "Конвекция"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Единица измерения магнитного поля:",
        options: ["Тесла", "Вольт", "Ом"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Что происходит с током при увеличении сопротивления при постоянном напряжении?",
        options: ["Ток уменьшается", "Ток увеличивается", "Ток не меняется"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Что такое электродвижущая сила (ЭДС)?",
        options: ["Работа по перемещению заряда в цепи", "Сопротивление проводника", "Сила тока"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 9,
    title: "Атомная физика",
    category: "physics",
    difficulty: "hard",
    description: "Строение атома для 9 класса",
    questions: [
      {
        id: 1,
        question: "Из чего состоит атом?",
        options: ["Ядро и электроны", "Протоны и нейтроны только", "Электроны и фотоны"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Как называется заряд ядра атома?",
        options: ["Положительный", "Отрицательный", "Нейтральный"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Что такое радиоактивность?",
        options: ["Спонтанное распадение нестабильных ядер", "Испарение вещества", "Электрический ток"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Какие частицы входят в состав ядра?",
        options: ["Протоны и нейтроны", "Электроны и протоны", "Нейтроны и электроны"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Что такое периодический закон Менделеева?",
        options: ["Свойства элементов повторяются с увеличением атомного номера", "Все элементы радиоактивны", "Все элементы имеют одинаковые свойства"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 10,
    title: "Энергия и работа",
    category: "physics",
    difficulty: "medium",
    description: "Механическая работа и энергия для 7-8 классов",
    questions: [
      {
        id: 1,
        question: "Что такое работа в физике?",
        options: ["Произведение силы на перемещение в направлении силы", "Сила, приложенная к телу", "Скорость тела"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Единица измерения работы:",
        options: ["Джоуль", "Ньютон", "Ватт"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Что такое кинетическая энергия?",
        options: ["Энергия тела, связанная с его движением", "Энергия тела, связанная с его положением", "Энергия света"],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Что происходит с энергией при падении тела?",
        options: ["Потенциальная энергия превращается в кинетическую", "Кинетическая энергия исчезает", "Энергия не меняется"],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Что такое мощность?",
        options: ["Работа, выполненная за единицу времени", "Сила, приложенная к телу", "Скорость тела"],
        correctAnswer: 0
      }
    ]
  }
];

interface QuizSystemProps {
  playerName: string;
  onEarnKnowledge: (amount: number) => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ playerName, onEarnKnowledge }) => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'menu' | 'quiz'>('menu');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут
  const [quizStarted, setQuizStarted] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`quizProgress_${playerName}`);
    if (saved) {
      setCompletedQuizzes(JSON.parse(saved));
    }
  }, [playerName]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      finishQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, timeLeft, quizCompleted]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(300);
    setQuizStarted(true);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers?: number[]) => {
    setQuizStarted(false);
    setQuizCompleted(true);

    const answersToCheck = finalAnswers || answers;
    let correctCount = 0;

    selectedQuiz!.questions.forEach((question, index) => {
      if (answersToCheck[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);

    // Начисляем знания за квиз
    const knowledgeReward = correctCount * 20; // 20 знаний за правильный ответ
    if (knowledgeReward > 0) {
      onEarnKnowledge(knowledgeReward);
    }

    // Сохраняем прогресс если квиз пройден успешно (больше 60%)
    if (correctCount >= 3) {
      const newCompleted = [...completedQuizzes, selectedQuiz!.id];
      setCompletedQuizzes(newCompleted);
      localStorage.setItem(`quizProgress_${playerName}`, JSON.stringify(newCompleted));
    }

    toast({
      title: correctCount >= 3 ? "Квиз пройден! 🎉" : "Попробуйте ещё раз",
      description: `Правильных ответов: ${correctCount}/${selectedQuiz!.questions.length}. Получено знаний: ${knowledgeReward}`,
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(300);
    setQuizStarted(true);
  };

  const backToMenu = () => {
    setCurrentView('menu');
    setSelectedQuiz(null);
    setQuizStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-quantum-green';
      case 'medium': return 'text-quantum-yellow';
      case 'hard': return 'text-quantum-orange';
      default: return 'text-quantum-blue';
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'celebrities' ? 'text-quantum-purple' : 'text-quantum-blue';
  };

  if (currentView === 'menu') {
    const celebrityQuizzes = quizzes.filter(q => q.category === 'celebrities');
    const physicsQuizzes = quizzes.filter(q => q.category === 'physics');

    return (
      <div className="min-h-screen bg-lab-dark quantum-bg p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-glow text-quantum-blue mb-4">
              Квантовые Квизы
            </h1>
            <p className="text-xl text-muted-foreground">
              Проверьте свои знания в науке и физике
            </p>
            <div className="mt-4 flex justify-center items-center gap-4">
              <Badge variant="outline" className="text-quantum-green border-quantum-green">
                Пройдено: {completedQuizzes.length}/{quizzes.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-quantum-yellow" />
                <span className="text-quantum-yellow">
                  {completedQuizzes.length * 100} очков
                </span>
              </div>
            </div>
          </div>

          {/* Квизы про знаменитостей */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-quantum-purple mb-4 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Знаменитости науки
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {celebrityQuizzes.map((quiz) => (
                <Card key={quiz.id} className="energy-border bg-card/90 hover:bg-card/100 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{quiz.title}</CardTitle>
                      {completedQuizzes.includes(quiz.id) && (
                        <Trophy className="w-5 h-5 text-quantum-yellow" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getCategoryColor(quiz.category)}>
                        Знаменитости
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty === 'easy' ? 'Легко' : quiz.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {quiz.questions.length} вопросов • 5 минут
                      </span>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        size="sm"
                        className="bg-quantum-purple hover:bg-quantum-purple/80"
                      >
                        Начать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Квизы по физике */}
          <div>
            <h2 className="text-2xl font-bold text-quantum-blue mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Физика (6-9 класс)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicsQuizzes.map((quiz) => (
                <Card key={quiz.id} className="energy-border bg-card/90 hover:bg-card/100 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{quiz.title}</CardTitle>
                      {completedQuizzes.includes(quiz.id) && (
                        <Trophy className="w-5 h-5 text-quantum-yellow" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getCategoryColor(quiz.category)}>
                        Физика
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty === 'easy' ? 'Легко' : quiz.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {quiz.questions.length} вопросов • 5 минут
                      </span>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        size="sm"
                        className="bg-quantum-blue hover:bg-quantum-blue/80"
                      >
                        Начать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if (!selectedQuiz) return null;

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-lab-dark quantum-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={backToMenu}
            variant="ghost"
            className="text-quantum-blue hover:text-quantum-blue/80"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад к квизам
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-quantum-green" />
              <span className={`font-mono ${timeLeft < 60 ? 'text-quantum-orange' : 'text-quantum-green'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="outline" className="text-quantum-blue border-quantum-blue">
              {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
            </Badge>
          </div>
        </div>

        {!quizCompleted ? (
          <Card className="energy-border bg-card/90">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-xl text-white">{selectedQuiz.title}</CardTitle>
                <Badge variant="outline" className={getCategoryColor(selectedQuiz.category)}>
                  {selectedQuiz.category === 'celebrities' ? 'Знаменитости' : 'Физика'}
                </Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        selectedAnswer === index
                          ? 'border-quantum-blue bg-quantum-blue/20 text-quantum-blue'
                          : 'border-lab-border bg-lab-surface/50 text-white hover:border-quantum-blue/50'
                      }`}
                    >
                      <span className="font-semibold mr-3">
                        {String.fromCharCode(65 + index)})
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                
                <Button
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                  className="bg-quantum-blue hover:bg-quantum-blue/80"
                >
                  {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Завершить' : 'Далее'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="energy-border bg-card/90">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-4">
                Квиз завершён!
              </CardTitle>
              <div className="flex justify-center mb-4">
                {score >= selectedQuiz.questions.length * 0.6 ? (
                  <Trophy className="w-16 h-16 text-quantum-yellow" />
                ) : (
                  <RotateCcw className="w-16 h-16 text-quantum-orange" />
                )}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-3xl font-bold text-quantum-blue mb-2">
                  {score} / {selectedQuiz.questions.length}
                </div>
                <div className="text-lg text-muted-foreground">
                  {Math.round((score / selectedQuiz.questions.length) * 100)}% правильных ответов
                </div>
                <div className="text-sm text-quantum-green mt-2">
                  Получено знаний: {score * 20}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedQuiz.questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-lab-surface/30 rounded-lg">
                    <span className="text-sm">Вопрос {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {answers[index] === question.correctAnswer ? (
                        <Star className="w-4 h-4 text-quantum-green" />
                      ) : (
                        <span className="text-quantum-orange">✗</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={restartQuiz} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Пройти снова
                </Button>
                <Button onClick={backToMenu} className="bg-quantum-blue hover:bg-quantum-blue/80">
                  Выбрать другой квиз
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizSystem;
