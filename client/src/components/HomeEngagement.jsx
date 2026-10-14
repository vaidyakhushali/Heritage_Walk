import { useState } from 'react'
import { Link } from 'react-router-dom'
import './HomeEngagement.css'

const heritageCategories = [
  {
    title: 'Stepwells',
    type: 'Stepwell',
    location: 'Patan, Gujarat',
    description: 'Descend into ingenious, sculpted worlds built around water.',
    image: 'https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Temples',
    type: 'Temple',
    location: 'Modhera, Gujarat',
    description: 'Explore sacred spaces shaped by devotion and fine stonework.',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00db976d0?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Havelis',
    type: 'Haveli',
    location: 'Jaisalmer, Rajasthan',
    description: 'Find carved facades and courtyards rich with local stories.',
    image: 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Forts',
    type: 'Fort',
    location: 'Jodhpur, Rajasthan',
    description: 'Walk the ramparts of strongholds that watched over a changing land.',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Colonial Buildings',
    type: 'Colonial Building',
    location: 'Across India',
    description: 'Trace the layered architectural influences of the colonial era.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Traditional Architecture',
    type: 'Monument',
    location: 'Across India',
    description: 'Discover the details, materials, and craft of historic places.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85'
  }
]

const questions = [
  {
    question: 'Which architectural structure is commonly associated with Rajasthan and Gujarat?',
    answers: ['Stepwell', 'Skyscraper', 'Lighthouse', 'Metro Station'],
    correct: 0
  },
  {
    question: 'What is a Haveli?',
    answers: ['Traditional mansion', 'Ancient weapon', 'Temple bell', 'River'],
    correct: 0
  },
  {
    question: 'Which structure was historically used for storing and accessing water?',
    answers: ['Stepwell', 'Fort', 'Palace', 'Gateway'],
    correct: 0
  },
  {
    question: 'Heritage documentation mainly helps communities to:',
    answers: ['Preserve knowledge and awareness', 'Delete historical records', 'Replace old buildings', 'Remove local culture'],
    correct: 0
  },
  {
    question: 'What can a community member contribute to HeritageWalk?',
    answers: ['Historical information', 'Photographs', 'Local stories', 'All of the above'],
    correct: 3
  }
]

const heritageFacts = [
  'Stepwells were designed to provide access to groundwater through changing seasons.',
  'Many havelis feature intricate carvings, frescoes, and shaded courtyards.',
  'Community stories can preserve knowledge that may never appear in formal records.',
  'Traditional architecture often responds to local climate, materials, and ways of life.',
  'A photograph shared today can help future generations understand a place as it is now.'
]

function getScoreMessage(percentage) {
  if (percentage === 100) return 'Outstanding! You are a true champion of heritage.'
  if (percentage >= 80) return 'Excellent! You have a strong knowledge of Indian heritage.'
  if (percentage >= 60) return 'Well done! You know your heritage and there is more to discover.'
  if (percentage >= 40) return 'A lovely start. Explore a few more stories and try again.'
  return 'Every journey starts with curiosity. Explore the collection and give it another go.'
}

function HeritageQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[questionIndex]
  const percentage = Math.round((score / questions.length) * 100)

  const chooseAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    if (answerIndex === currentQuestion.correct) setScore(value => value + 1)
  }

  const goNext = () => {
    if (questionIndex === questions.length - 1) {
      setFinished(true)
      return
    }
    setQuestionIndex(index => index + 1)
    setSelectedAnswer(null)
  }

  const tryAgain = () => {
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <section className="quiz-card" aria-labelledby="quiz-title">
      <div className="quiz-card-topline">
        <span className="engagement-eyebrow">A little local knowledge</span>
        {!finished && <span className="quiz-counter">Question {questionIndex + 1} of {questions.length}</span>}
      </div>
      <h2 id="quiz-title">Test Your Heritage Knowledge</h2>
      <p className="quiz-intro">Five quick questions. How much of India’s architectural story do you know?</p>

      {finished ? (
        <div className="quiz-result" aria-live="polite">
          <span className="quiz-result-label">Your Heritage Score</span>
          <strong className="quiz-result-score">{score} <span>/ {questions.length}</span></strong>
          <span className="quiz-result-percent">{percentage}% correct</span>
          <p>{getScoreMessage(percentage)}</p>
          <button type="button" className="btn btn-primary" onClick={tryAgain}>Try Again</button>
        </div>
      ) : (
        <>
          <div
            className="quiz-progress-track"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin="0"
            aria-valuemax={questions.length}
            aria-valuenow={questionIndex + (selectedAnswer !== null ? 1 : 0)}
          >
            <span style={{ width: `${((questionIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <h3 className="quiz-question">{currentQuestion.question}</h3>
          <div className="quiz-answers">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correct
              let stateClass = ''
              if (selectedAnswer !== null && isCorrect) stateClass = ' is-correct'
              else if (isSelected) stateClass = ' is-incorrect'

              return (
                <button
                  type="button"
                  key={answer}
                  className={`quiz-answer${stateClass}${isSelected ? ' is-selected' : ''}`}
                  onClick={() => chooseAnswer(index)}
                  disabled={selectedAnswer !== null}
                  aria-pressed={isSelected}
                >
                  <span className="quiz-answer-marker">{String.fromCharCode(65 + index)}</span>
                  {answer}
                  {selectedAnswer !== null && isCorrect && <span className="quiz-answer-feedback">Correct</span>}
                  {isSelected && !isCorrect && <span className="quiz-answer-feedback">Not quite</span>}
                </button>
              )
            })}
          </div>
          <div className="quiz-footer">
            <span className="quiz-score-live" aria-live="polite">Score: {score} / {questionIndex + (selectedAnswer !== null ? 1 : 0)}</span>
            <button type="button" className="btn btn-primary quiz-next" onClick={goNext} disabled={selectedAnswer === null}>
              {questionIndex === questions.length - 1 ? 'See my score' : 'Next question'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function DailyFact() {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * heritageFacts.length))

  const nextFact = () => {
    setFactIndex(current => {
      const offset = 1 + Math.floor(Math.random() * (heritageFacts.length - 1))
      return (current + offset) % heritageFacts.length
    })
  }

  return (
    <aside className="daily-fact-card" aria-labelledby="daily-fact-title">
      <span className="fact-sun-mark" aria-hidden="true">✳</span>
      <span className="engagement-eyebrow">A story in every stone</span>
      <h2 id="daily-fact-title">Did You Know?</h2>
      <p className="daily-fact-text" key={factIndex} aria-live="polite">{heritageFacts[factIndex]}</p>
      <button type="button" className="fact-next-button" onClick={nextFact}>
        Next Fact <span aria-hidden="true">→</span>
      </button>
      <Link to="/explore" className="fact-explore-link">Explore the collection</Link>
    </aside>
  )
}

function HomeEngagement() {
  return (
    <>
      <section className="discovery-section section-padding" aria-labelledby="discovery-title">
        <div className="container">
          <div className="discovery-heading">
            <div>
              <span className="section-pill">Explore by tradition</span>
              <h2 className="section-title" id="discovery-title">Find a story that speaks to you</h2>
            </div>
            <p>From monumental forts to details close to home, every place holds a piece of our shared past.</p>
          </div>
          <div className="discovery-grid">
            {heritageCategories.map((category, index) => (
              <Link
                to={`/explore?type=${encodeURIComponent(category.type)}`}
                className="discovery-card"
                key={category.title}
                style={{ '--card-index': index }}
              >
                <div className="discovery-card-image">
                  <img src={category.image} alt="" loading="lazy" />
                  <span className="discovery-card-count">0{index + 1}</span>
                </div>
                <div className="discovery-card-content">
                  <span className="discovery-card-location">{category.location}</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="discovery-card-link">Explore <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="engagement-section section-padding" aria-label="Heritage quiz and fact">
        <div className="container engagement-grid">
          <HeritageQuiz />
          <DailyFact />
        </div>
      </section>
    </>
  )
}

export default HomeEngagement
