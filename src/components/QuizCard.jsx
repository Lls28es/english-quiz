import { useEffect, useState } from 'react';

export default function QuizCard() {
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [category, setCategory] = useState('');
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    fetch('/english_exercises.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const current = filteredQuestions[currentIndex];
      let opts = filteredQuestions
        .filter((q) => q.spanish !== current.spanish)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((q) => q.spanish);

      opts.push(current.spanish);
      opts = opts.sort(() => 0.5 - Math.random());
      setOptions(opts);
    }
  }, [filteredQuestions, currentIndex]);

  const handleCategorySelect = (selected) => {
    const filtered = questions.filter((q) => q.category === selected);
    setCategory(selected);
    setFilteredQuestions(filtered);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowNext(false);
    setOptions([]);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer === current.spanish) return; // Si ya acertaste, no hagas nada
    setSelectedAnswer(answer);
    if (answer === current.spanish) {
      setShowNext(true);
    }
  };

  const nextQuestion = () => {
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setShowNext(false);
  };

  if (!category) {
    const uniqueCategories = [...new Set(questions.map((q) => q.category))];
    return (
      <div className="p-4">
        <h2 className="text-xl mb-4">Selecciona una categoría:</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className="btnCategory bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const current = filteredQuestions[currentIndex];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{current.english}</h2>
      <div className="flex flex-col gap-2 max-w-md mx-auto">
        {options.map((option) => {
          const isCorrect =
            selectedAnswer === current.spanish && option === current.spanish;
          const isWrong =
            selectedAnswer === option && selectedAnswer !== current.spanish;

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`px-4 py-2 rounded border transition-colors duration-200 text-lg btnOption
        ${isCorrect ? 'bg-green-500 text-white' : ''}
        ${isWrong ? 'bg-red-500 text-white' : ''}
        ${selectedAnswer && !isCorrect && !isWrong ? 'opacity-50' : ''}
      `}
              disabled={selectedAnswer === current.spanish}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showNext && (
        <button
          onClick={nextQuestion}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
        >
          Siguiente
        </button>
      )}

      <div className="mt-5 py-3">
        <button
          onClick={() => setCategory('')}
          className="mb-4 underline text-blue-600 bg-red-500 btnChangeCategory"
        >
          ⬅️ Cambiar categoría
        </button>
      </div>
    </div>
  );
}
