export default function Score(props) {
  const { questionsAnswered, questionsCorrect, questionsWrong } = props;
  return (
    <div className="">
      <div className="mt-2">
        <button className="my-1 btnScore btnScoreAnswered fs-14">
          Preguntas Respondidas: {questionsAnswered}
        </button>
        <button className="my-1 btnScore btnScoreCorrect fs-14">
          Preguntas Correctas:
          {questionsCorrect}
        </button>
        <button className="my-1 btnScore btnScoreWrong fs-14">
          Preguntas Incorrectas:{questionsWrong}
        </button>
      </div>
    </div>
  );
}
