import { useEffect, useState } from 'react';
import Score from './Score';

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function QuizCard() {
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [category, setCategory] = useState('');
  const [score, setScore] = useState(0);
  const [scoreByCategory, setScoreByCategory] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [questionsWrong, setQuestionsWrong] = useState(0);

  useEffect(() => {
    fetch('/english_exercises.json')
      .then((res) => res.json())
      .then((data) => {
        const shuffledArray = shuffle(data);
        const uniqueCategories = [
          ...new Set(shuffledArray.map((q) => q.category)),
        ];
        setCategories(uniqueCategories);

        let scoresCategories = uniqueCategories.map((cat) => {
          return { category: cat, score: 0 };
        });
        setScoreByCategory(scoresCategories);
        setQuestions(shuffledArray);
      });
  }, []);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const current = filteredQuestions[currentIndex];
      let opts = filteredQuestions
        .filter((q) => q.correct !== current.correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((q) => q.correct);

      opts.push(current.correct);
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

  const handleAnswer = (answer, currentCategory, result) => {
    if (selectedAnswer === current.correct) return; // Si ya acertaste, no hagas nada
    setSelectedAnswer(answer);
    if (answer === current.correct) {
      setShowNext(true);
      setQuestionsAnswered((prev) => prev + 1);
    }

    if (result) {
      setQuestionsCorrect((prev) => prev + 1);
      setScore((prev) => prev + 1);
      setScoreByCategory((prev) =>
        prev.map((cat) =>
          cat.category === currentCategory
            ? { ...cat, score: cat.score + 1 }
            : cat
        )
      );
    } else {
      setQuestionsWrong((prev) => prev + 1);
      setScore((prev) => prev - 1);
      setScoreByCategory((prev) =>
        prev.map((cat) =>
          cat.category === currentCategory
            ? { ...cat, score: cat.score - 1 }
            : cat
        )
      );
    }
  };

  const nextQuestion = () => {
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setShowNext(false);
  };

  if (!category) {
    return (
      <div className="py-4">
        <Score
          questionsAnswered={questionsAnswered}
          questionsCorrect={questionsCorrect}
          questionsWrong={questionsWrong}
        />
        <div className="my-1 mb-4">
          <button className="btnScore btnTotalScore  fs-14">
            {' '}
            Score: {score}
          </button>
        </div>
        <div className="">
          <h2 className="text-xl fs-30">Selecciona una categoría:</h2>
          <div className=" flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="btnCategory bg-blue-500 text-white rounded hover:bg-blue-600 transition fs-18"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5">
          <div className="my-3">
            <hr className="pb-4" />
            <p className=" fw-semibold"> Score by Category</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {scoreByCategory.map((cat) => (
                <button
                  key={cat.category}
                  className="btnScore btnScoreByCategory fs-14"
                >
                  {' '}
                  {cat.category}: {cat.score}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = filteredQuestions[currentIndex];

  return (
    <div className="contentQuiz p-4 mt-5">
      <div className="chosenCategory">
        <h3 className=" text-start fs-16">{current.category} category</h3>
      </div>

      <div className="contentQuest flex-col gap-2 max-w-md mx-auto pt-3 pb-4 mb-3">
        <h2 className="text-green-500 text-2xl mb-4 fs-34">
          {current.english}
        </h2>
        {options.map((option) => {
          const isCorrect =
            selectedAnswer === current.correct && option === current.correct;
          const isWrong =
            selectedAnswer === option && selectedAnswer !== current.correct;
          return (
            <button
              key={option}
              onClick={() =>
                handleAnswer(
                  option,
                  current.category,
                  option === current.correct
                )
              }
              className={`rounded border transition-colors duration-200 text-lg btnOption fs-16
        ${isCorrect ? 'bg-green-500 text-white' : ''}
        ${isWrong ? 'bg-red-500 text-white' : ''}
        ${selectedAnswer && !isCorrect && !isWrong ? 'opacity-50' : ''}
      `}
              disabled={selectedAnswer === current.correct}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showNext && current.translation && <p>{current.translation}</p>}

      {showNext && (
        <button
          onClick={nextQuestion}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
        >
          Siguiente
        </button>
      )}

      <div className="py-2">
        <button
          onClick={() => setCategory('')}
          className="underline text-blue-600 bg-red-500 btnChangeCategory fs-14"
        >
          ⬅️ Cambiar categoría
        </button>
      </div>

      <hr className="pb-3" />

      <div className="">
        <div className="mb-2">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button className="btnScore btnScoreByCategory fs-14">
              Score by {current.category}:{' '}
              {
                scoreByCategory.filter(
                  (cat) => cat.category === current.category
                )[0].score
              }
            </button>
          </div>
        </div>
      </div>

      <Score
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect}
        questionsWrong={questionsWrong}
        score={score}
      />

      <div className="my-2">
        <button className="btnScore btnTotalScore fs-14">
          {' '}
          Score: {score}
        </button>
      </div>
    </div>
  );
}
