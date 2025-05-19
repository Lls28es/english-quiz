export default function Score(props) {
  const { questionsAnswered, questionsCorrect, questionsWrong } = props;
  return (
    <div className="px-5">
      <div className=" my-3">
        <button className="btnScore btnScoreAnswered">
          Preguntas Respondidas: {questionsAnswered}
        </button>
        <button className="btnScore btnScoreCorrect">
          Preguntas Correctas:
          {questionsCorrect}
        </button>
        <button className="btnScore btnScoreWrong">
          Preguntas Incorrectas:{questionsWrong}
        </button>
      </div>
    </div>
  );
}
