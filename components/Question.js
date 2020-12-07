function Question(props) {
  const { question, submitAnswer, loading, score, setScore } = props;

  return (
    <div key={question.questionText}>
      <div>{question.questionText}</div>
      <div className="input-container">
        <label>
          <input
            type="radio"
            name="rating"
            id="1"
            value={1}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 1}
            disabled={loading}
          />
          <div>1</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="2"
            value={2}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 2}
            disabled={loading}
          />
          <div>2</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="3"
            value={3}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 3}
            disabled={loading}
          />
          <div>3</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="4"
            value={4}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 4}
            disabled={loading}
          />
          <div>4</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="5"
            value={5}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 5}
            disabled={loading}
          />
          <div>5</div>
        </label>
      </div>

      <button
        onClick={() => submitAnswer(question.questionId, score)}
        disabled={score === ''}
      >
        Submit Answer
      </button>
    </div>
  );
}

export default Question;
