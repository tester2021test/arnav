import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Calculator, Globe, Star, ChevronLeft, 
  Trophy, RotateCcw, Home, Languages, Zap, 
  CheckCircle, XCircle, RefreshCcw 
} from 'lucide-react';

/** * CONSTANTS
 */
const GRADES = [
  { id: 1, name: 'Class 1', color: 'bg-rose-400' },
  { id: 2, name: 'Class 2', color: 'bg-amber-400' },
  { id: 3, name: 'Class 3', color: 'bg-emerald-400' },
  { id: 4, name: 'Class 4', color: 'bg-sky-400' },
];

const SUBJECTS = [
  { id: 'Maths', name: 'Mathematics', icon: Calculator, color: 'text-blue-600' },
  { id: 'English', name: 'English', icon: BookOpen, color: 'text-purple-600' },
  { id: 'EVS', name: 'Env. Studies', icon: Globe, color: 'text-green-600' },
  { id: 'Hindi', name: 'Hindi', icon: Languages, color: 'text-orange-600' },
];

const STATIC_DATA = {
  hindi: [
    { q: "आम क्या है?", a: ["सब्जी", "फल", "फूल", "पेड़"], correct: 1 },
    { q: "वर्णमाला का पहला अक्षर?", a: ["क", "अ", "म", "र"], correct: 1 },
    { q: "सब्जी का नाम चुनें:", a: ["सेब", "केला", "आलू", "आम"], correct: 2 },
    { q: "आकाश का रंग कैसा होता है?", a: ["लाल", "पीला", "नीला", "हरा"], correct: 2 },
    { q: "विलोम शब्द: 'अमीर'", a: ["गरीब", "धनवान", "सुखी", "दुखी"], correct: 0 }
  ],
  vocab: {
    opposites: [['Hot', 'Cold'], ['Big', 'Small'], ['Happy', 'Sad'], ['Up', 'Down'], ['In', 'Out']],
    plurals: [['Cat', 'Cats'], ['Dog', 'Dogs'], ['Book', 'Books'], ['Pen', 'Pens'], ['Boy', 'Boys']]
  }
};

/**
 * GENERATORS
 */
const generateQuestions = (grade, subject) => {
  const qs = [];
  for (let i = 0; i < 20; i++) {
    if (subject === 'Maths') {
      let a = Math.floor(Math.random() * (grade * 15)) + 5;
      let b = Math.floor(Math.random() * (grade * 10)) + 1;
      let op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && a < b) [a, b] = [b, a];
      let ans = op === '+' ? a + b : a - b;
      let options = [ans.toString(), (ans+2).toString(), (ans-1).toString(), (ans+5).toString()].sort(() => Math.random() - 0.5);
      qs.push({ q: `${a} ${op} ${b} = ?`, a: options, correct: options.indexOf(ans.toString()) });
    } else if (subject === 'English') {
      const type = Math.random() > 0.5 ? 'opposite' : 'plural';
      const bank = type === 'opposite' ? STATIC_DATA.vocab.opposites : STATIC_DATA.vocab.plurals;
      const pair = bank[Math.floor(Math.random() * bank.length)];
      let q = `${type === 'opposite' ? 'Opposite' : 'Plural'} of '${pair[0]}'?`;
      let ans = pair[1];
      let options = [ans, 'Happy', 'Table', 'Sun'].sort(() => Math.random() - 0.5);
      qs.push({ q, a: options, correct: options.indexOf(ans) });
    } else {
      const pool = STATIC_DATA.hindi;
      qs.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }
  return qs;
};

export default function App() {
  const [view, setView] = useState('landing');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null); 
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Clear feedback and reset attempts when moving to the next question
  const nextQuestion = () => {
    setShowFeedback(null);
    setAttempts(0);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('result');
    }
  };

  const startQuiz = (grade, subject) => {
    const qSet = generateQuestions(grade, subject);
    setQuestions(qSet);
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setShowFeedback(null);
    setView('quiz');
  };

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    const isCorrect = idx === questions[currentIndex].correct;
    
    if (isCorrect) {
      setShowFeedback('correct');
      setScore(prev => prev + 1);
      setTimeout(nextQuestion, 1200);
    } else {
      const currentAttempts = attempts + 1;
      setAttempts(currentAttempts);
      if (currentAttempts < 2) {
        setShowFeedback('retry');
        setTimeout(() => setShowFeedback(null), 1500);
      } else {
        setShowFeedback('wrong');
        setTimeout(nextQuestion, 2500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-5 bg-white border-b flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {view !== 'landing' && (
              <button onClick={() => setView(view === 'quiz' ? 'subjects' : 'grades')} className="p-2 rounded-xl bg-slate-100">
                <ChevronLeft size={20} />
              </button>
            )}
            <h1 className="font-black text-lg text-indigo-700 uppercase italic">Arnav Narkhede Game</h1>
          </div>
          <div className="bg-amber-400 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={14} className="text-white fill-white" />
            <span className="font-black text-white text-sm">{score}</span>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col">
          {view === 'landing' && (
            <div className="flex flex-col items-center text-center pt-10">
              <div className="w-36 h-36 bg-indigo-600 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl rotate-3">
                <Zap size={70} className="text-white animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Start Learning!</h2>
              <button onClick={() => setView('grades')} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all">
                PLAY NOW
              </button>
            </div>
          )}

          {view === 'grades' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black mb-2 text-slate-800">Select Class</h2>
              {GRADES.map((g) => (
                <button key={g.id} onClick={() => { setSelectedGrade(g.id); setView('subjects'); }} className={`${g.color} p-6 rounded-3xl text-white flex items-center justify-between shadow-lg active:scale-95 transition-all`}>
                  <span className="text-3xl font-black">{g.name}</span>
                  <Trophy size={30} className="opacity-40" />
                </button>
              ))}
            </div>
          )}

          {view === 'subjects' && (
            <div className="grid grid-cols-2 gap-4">
              {SUBJECTS.map((s) => (
                <button key={s.id} onClick={() => { setSelectedSubject(s.id); startQuiz(selectedGrade, s.id); }} className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-indigo-400 transition-all active:scale-95">
                  <div className={`p-4 rounded-3xl bg-slate-50 ${s.color}`}><s.icon size={40} /></div>
                  <span className="font-black text-slate-700">{s.name}</span>
                </button>
              ))}
            </div>
          )}

          {view === 'quiz' && (
            <div className="flex flex-col flex-1 relative">
              <div className="bg-indigo-50 p-8 rounded-[3rem] mb-8 relative border-2 border-indigo-100 min-h-[180px] flex items-center justify-center">
                <h3 className="text-2xl font-black text-indigo-900 text-center">
                  {questions[currentIndex]?.q || "Loading..."}
                </h3>
                
                {showFeedback === 'correct' && (
                  <div className="absolute inset-0 bg-green-500 flex items-center justify-center rounded-[3rem] text-white z-10 animate-in-zoom">
                    <div className="text-center">
                      <Trophy size={60} className="mx-auto mb-2" />
                      <span className="text-4xl font-black block uppercase tracking-tight">Brilliant Arnav!</span>
                    </div>
                  </div>
                )}

                {showFeedback === 'retry' && (
                  <div className="absolute inset-0 bg-amber-400 flex flex-col items-center justify-center rounded-[3rem] text-white z-10 animate-in-zoom">
                    <RefreshCcw size={60} className="mb-2 animate-spin-slow" />
                    <span className="text-3xl font-black uppercase">Try Again!</span>
                  </div>
                )}

                {showFeedback === 'wrong' && (
                  <div className="absolute inset-0 bg-rose-500 flex flex-col items-center justify-center rounded-[3rem] text-white z-10 p-6 text-center animate-in-zoom">
                    <XCircle size={60} className="mb-2" />
                    <span className="text-xl font-black mb-2 uppercase opacity-80">Correct Answer:</span>
                    <div className="bg-white/20 p-4 rounded-2xl w-full">
                      <p className="text-3xl font-black">{questions[currentIndex]?.a[questions[currentIndex]?.correct]}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentIndex]?.a.map((opt, i) => (
                  <button key={i} disabled={showFeedback !== null} onClick={() => handleAnswer(i)} 
                    className={`w-full text-left p-5 rounded-3xl border-2 font-black transition-all shadow-sm flex items-center 
                    ${showFeedback === 'wrong' && i === questions[currentIndex].correct ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 bg-white'}`}>
                    <span className="inline-block w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-center leading-8 mr-4 text-sm font-bold">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt}</span>
                    {showFeedback === 'wrong' && i === questions[currentIndex].correct && <CheckCircle size={20} className="ml-2" />}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 flex justify-center gap-2">
                {[1, 2].map(n => <div key={n} className={`w-3 h-3 rounded-full transition-all duration-300 ${attempts >= n ? 'bg-rose-400' : 'bg-slate-200'}`} />)}
              </div>
            </div>
          )}

          {view === 'result' && (
            <div className="flex flex-col items-center text-center pt-10">
              <Trophy size={100} className="text-amber-400 mb-6 animate-bounce" />
              <h2 className="text-4xl font-black mb-4">Winner, Arnav!</h2>
              <p className="text-slate-500 mb-10 text-xl font-bold">You scored {score} points!</p>
              <button onClick={() => setView('landing')} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all">
                PLAY AGAIN
              </button>
            </div>
          )}
        </main>
      </div>

      <style>
        {`
        .animate-in-zoom { animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes zoom { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}
