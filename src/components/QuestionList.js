import React, {useState, useEffect} from "react";

function QuestionList() {
  const [questionList, setQuestionList] = useState([])

  useEffect(() => {
    fetch('http://localhost:4000/questions')
    .then(response => response.json())
    .then((data) =>{
      setQuestionList(data.map((q) => {
        return {
          id: q.id,
          prompt: q.prompt,
          answers: q.answers,
          correctIndex: q.correctIndex
        }
      }))
    })
  },[])

  function handleDelete(id){
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    })
    .then(() => {setQuestionList(questionList.filter(q => q.id !== id))})
  }

  function handleSelect(question, newIndex) {
    const newQuestionList = questionList.map((q) => q.id === question.id ? {...q, correctIndex: newIndex} : q)
    setQuestionList(newQuestionList)
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({correctIndex: newIndex})
    })
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questionList.map((question) => <li key={question.id}>{question.prompt}
          <label htmlFor="answers">Correct Answer:</label>
            <select id="answers" name="answers" value={question.correctIndex} onChange={(event) => handleSelect(question, parseInt(event.target.value))}>
              {question.answers.map((a, index) => <option key={index} value={index}>{a}</option>)}
            </select>
          <button onClick={() => handleDelete(question.id)}>Delete Question</button>
        </li>)}
      </ul>
    </section>
  );
}

export default QuestionList;