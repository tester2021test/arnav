import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Star, 
  ChevronLeft, 
  Trophy, 
  RotateCcw, 
  Home,
  Languages,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCcw
} from 'lucide-react';

/** * DATA BANKS FOR GENERATORS
 * These provide the "DNA" for generating hundreds of questions.
 */
const WORD_BANK = {
  opposites: [
    ['Hot', 'Cold'], ['Big', 'Small'], ['Happy', 'Sad'], ['Up', 'Down'], ['In', 'Out'],
    ['Fast', 'Slow'], ['Tall', 'Short'], ['Hard', 'Soft'], ['Day', 'Night'], ['Left', 'Right'],
    ['Full', 'Empty'], ['Clean', 'Dirty'], ['Old', 'New'], ['Thin', 'Thick'], ['Wet', 'Dry'],
    ['Dark', 'Light'], ['Heavy', 'Light'], ['Near', 'Far'], ['Rich', 'Poor'], ['Brave', 'Coward'],
    ['Sharp', 'Blunt'], ['Sweet', 'Sour'], ['True', 'False'], ['Win', 'Lose'], ['Top', 'Bottom']
  ],
  plurals: [
    ['Cat', 'Cats'], ['Dog', 'Dogs'], ['Book', 'Books'], ['Pen', 'Pens'], ['Boy', 'Boys'],
    ['Girl', 'Girls'], ['Tree', 'Trees'], ['Car', 'Cars'], ['Ball', 'Balls'], ['Box', 'Boxes'],
    ['Apple', 'Apples'], ['Chair', 'Chairs'], ['Glass', 'Glasses'], ['Bus', 'Buses'], ['Brush', 'Brushes'],
    ['Watch', 'Watches'], ['Mango', 'Mangoes'], ['Potato', 'Potatoes'], ['Child', 'Children'], ['Man', 'Men']
  ],
  nouns: ['Delhi', 'Arnav', 'India', 'Taj Mahal', 'Elephant', 'Computer', 'School', 'Mumbai', 'Lion', 'Table'],
  verbs: ['Running', 'Eating', 'Swimming', 'Writing', 'Playing', 'Sleeping', 'Dancing', 'Singing', 'Jumping', 'Laughing'],
  adjectives: ['Beautiful', 'Large', 'Blue', 'Shiny', 'Scary', 'Brave', 'Kind', 'Smart', 'Funny', 'Sweet']
};

const EVS_BANK = {
  animals: ['Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Dog', 'Cat', 'Cow', 'Sheep', 'Goat', 'Horse'],
  birds: ['Peacock', 'Parrot', 'Pigeon', 'Crow', 'Sparrow', 'Eagle', 'Owl', 'Ostrich', 'Penguin'],
  fruits: ['Mango', 'Apple', 'Banana', 'Orange', 'Grape', 'Papaya', 'Guava', 'Watermelon', 'Pineapple'],
  vegetables: ['Potato', 'Onion', 'Tomato', 'Carrot', 'Spinach', 'Brinjal', 'Pumpkin', 'Cabbage', 'Peas'],
  organs: ['Eyes', 'Ears', 'Nose', 'Tongue', 'Skin', 'Heart', 'Brain', 'Lungs', 'Stomach', 'Bones'],
  transport: ['Car', 'Bus', 'Train', 'Aeroplane', 'Ship', 'Bicycle', 'Boat', 'Helicopter', 'Rocket'],
  seasons: ['Summer', 'Winter', 'Monsoon', 'Spring', 'Autumn']
};

/**
 * ENGINES: Dynamic Question Generators
 */
const generateMathQuestions = (grade, count = 30) => {
  const qs = [];
  for (let i = 0; i < count; i++) {
    let a, b, op, q, ans;
    if (grade === 1) {
      a = Math.floor(Math.random() * 15) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && a < b) [a, b] = [b, a];
      q = `What is ${a} ${op} ${b}?`;
      ans = op === '+' ? a + b : a - b;
    } else if (grade === 2) {
      a = Math.floor(Math.random() * 80) + 10;
      b = Math.floor(Math.random() * 50) + 5;
      op = Math.random() > 0.5 ? '+' : '-';
      q = `Calculate: ${a} ${op} ${b}`;
      ans = op === '+' ? a + b : a - b;
    } else if (grade === 3) {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      q = `Multiply: ${a} x ${b}`;
      ans = a * b;
    } else {
      a = Math.floor(Math.random() * 100) + 50;
      b = Math.floor(Math.random() * 40) + 1;
      q = `Solve: ${a} - ${b}`;
      ans = a - b;
    }
    const dist = new Set();
    while(dist.size < 3) {
      let d = ans + (Math.floor(Math.random() * 20) - 10);
      if (d !== ans && d >= 0) dist.add(d.toString());
    }
    const options = [ans.toString(), ...Array.from(dist)].sort(() => Math.random() - 0.5);
    qs.push({ q, a: options, correct: options.indexOf(ans.toString()) });
  }
  return qs;
};

const generateEnglishQuestions = (grade, count = 30) => {
  const qs = [];
  for (let i = 0; i < count; i++) {
    const type = Math.floor(Math.random() * 4);
    let q, ans, options;
    
    if (type === 0) { // Opposites
      const pair = WORD_BANK.opposites[Math.floor(Math.random() * WORD_BANK.opposites.length)];
      q = `What is the opposite of '${pair[0]}'?`;
      ans = pair[1];
      const dist = WORD_BANK.opposites.map(p => p[1]).filter(o => o !== ans).sort(() => Math.random() - 0.5).slice(0, 3);
      options = [ans, ...dist].sort(() => Math.random() - 0.5);
    } else if (type === 1) { // Plurals
      const pair = WORD_BANK.plurals[Math.floor(Math.random() * WORD_BANK.plurals.length)];
      q = `What is the plural of '${pair[0]}'?`;
      ans = pair[1];
      const dist = [ans + 'es', ans.slice(0, -1) + 'ies', ans + 's'].filter(o => o !== ans).slice(0, 3);
      options = [ans, ...dist].sort(() => Math.random() - 0.5);
    } else { // Parts of Speech
      const word = WORD_BANK.nouns[Math.floor(Math.random() * WORD_BANK.nouns.length)];
      q = `Is '${word}' a Noun or a Verb?`;
      ans = 'Noun';
      options = ['Noun', 'Verb', 'Adjective', 'Adverb'].sort(() => Math.random() - 0.5);
    }
    qs.push({ q, a: options, correct: options.indexOf(ans) });
  }
  return qs;
};

const generateEVSQuestions = (grade, count = 30) => {
  const qs = [];
  for (let i = 0; i < count; i++) {
    const type = Math.floor(Math.random() * 3);
    let q, ans, options;
    if (type === 0) {
      const item = EVS_BANK.fruits[Math.floor(Math.random() * EVS_BANK.fruits.length)];
      q = `Which of these is '${item}'?`;
      ans = 'Fruit';
      options = ['Fruit', 'Vegetable', 'Animal', 'Bird'].sort(() => Math.random() - 0.5);
    } else if (type === 1) {
      const item = EVS_BANK.organs[Math.floor(Math.random() * EVS_BANK.organs.length)];
      q = `Which organ helps with '${item.toLowerCase()}'?`;
      ans = item;
      const dist = EVS_BANK.organs.filter(o => o !== ans).sort(() => Math.random() - 0.5).slice(0, 3);
      options = [ans, ...dist].sort(() => Math.random() - 0.5);
    } else {
      const item = EVS_BANK.transport[Math.floor(Math.random() * EVS_BANK.transport.length)];
      q = `Is '${item}' a mode of transport?`;
      ans = 'Yes';
      options = ['Yes', 'No', 'Maybe', 'Only in space'].sort(() => Math.random() - 0.5);
    }
    qs.push({ q, a: options, correct: options.indexOf(ans) });
  }
  return qs;
};

const STATIC_HINDI_POOL = [
  { q: "आम क्या है?", a: ["सब्जी", "फल", "फूल", "पेड़"], correct: 1 },
  { q: "वर्णमाला का पहला अक्षर?", a: ["क", "अ", "म", "र"], correct: 1 },
  { q: "लिंग बदलें: 'बैल'", a: ["गाय", "बकरी", "शेरनी", "मुर्गी"], correct: 0 },
  { q: "सब्जी का नाम चुनें:", a: ["सेब", "केला", "आलू", "आम"], correct: 2 },
  { q: "आकाश का रंग कैसा होता है?", a: ["लाल", "पीला", "नीला", "हरा"], correct: 2 },
  { q: "विलोम शब्द: 'अमीर'", a: ["गरीब", "धनवान", "सुखी", "दुखी"], correct: 0 },
  { q: "सूरज कब निकलता है?", a: ["रात में", "दोपहर में", "सुबह", "शाम"], correct: 2 },
  { q: "एक साल में कितने महीने होते हैं?", a: ["10", "12", "7", "30"], correct: 1 },
  { q: "पक्षी कहाँ उड़ते हैं?", a: ["पानी में", "जमीन पर", "आसमान में", "गुफा में"], correct: 2 },
  { q: "संज्ञा शब्द चुनें:", a: ["वह", "किताब", "रोना", "धीरे"], correct: 1 }
];

const GRADES = [
  { id: 1, name: 'Class 1', color: 'bg-rose-400', hover: 'hover:bg-rose-500' },
  { id: 2, name: 'Class 2', color: 'bg-amber-400', hover: 'hover:bg-amber-500' },
  { id: 3, name: 'Class 3', color: 'bg-emerald-400', hover: 'hover:bg-emerald-500' },
  { id: 4, name: 'Class 4', color: 'bg-sky-400', hover: 'hover:bg-sky-500' },
];

const SUBJECTS = [
  { id: 'Maths', name: 'Mathematics', icon: Calculator, color: 'text-blue-600' },
  { id: 'English', name: 'English', icon: BookOpen, color: 'text-purple-600' },
  { id: 'EVS', name: 'Env. Studies', icon: Globe, color: 'text-green-600' },
  { id: 'Hindi', name: 'Hindi', icon: Languages, color: 'text-orange-600' },
];

export default function App() {
  const [view, setView] = useState('landing');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null); // 'correct', 'retry', 'wrong'
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);

  const startQuiz = (grade, subject) => {
    let qSet = [];
    if (subject === 'Maths') qSet = generateMathQuestions(grade, 40);
    else if (subject === 'English') qSet = generateEnglishQuestions(grade, 40);
    else if (subject === 'EVS') qSet = generateEVSQuestions(grade, 40);
    else qSet = [...STATIC_HINDI_POOL].sort(() => Math.random() - 0.5);
    
    setQuestions(qSet);
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setView('quiz');
  };

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    const isCorrect = idx === questions[currentIndex].correct;
    
    if (isCorrect) {
      setShowFeedback('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts < 2) {
        // First mistake: Show retry message
        setShowFeedback('retry');
        setTimeout(() => {
          setShowFeedback(null);
        }, 1500);
      } else {
        // Second mistake: Show correct answer reveal
        setShowFeedback('wrong');
        setTimeout(() => {
          nextQuestion();
        }, 2500);
      }
    }
  };

  const nextQuestion = () => {
    setShowFeedback(null);
    setAttempts(0);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setView('result');
    }
  };

  const reset = () => {
    setView('landing');
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
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

        <main className="flex-1 p-6 overflow-y-auto">
          {view === 'landing' && (
            <div className="flex flex-col items-center text-center pt-10">
              <div className="w-36 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl rotate-3">
                <Zap size={70} className="text-white animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Challenge Mode!</h2>
              <p className="text-slate-500 mb-10 text-lg">Are you ready to become a topper, Arnav?</p>
              <button 
                onClick={() => setView('grades')}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all"
              >
                PLAY NOW
              </button>
            </div>
          )}

          {view === 'grades' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-black mb-6">Select Your Class</h2>
              <div className="grid grid-cols-1 gap-4">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { setSelectedGrade(g.id); setView('subjects'); }}
                    className={`${g.color} p-6 rounded-3xl text-white flex items-center justify-between shadow-lg active:scale-95 transition-transform`}
                  >
                    <span className="text-3xl font-black">{g.name}</span>
                    <Trophy size={30} className="opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'subjects' && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Choose Subject</h2>
                <div className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold">Class {selectedGrade}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSubject(s.id); startQuiz(selectedGrade, s.id); }}
                    className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-indigo-400 active:scale-95 transition-all"
                  >
                    <div className={`p-4 rounded-3xl bg-slate-50 ${s.color}`}>
                      <s.icon size={40} />
                    </div>
                    <span className="font-black text-slate-700">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'quiz' && (
            <div className="flex flex-col h-full relative">
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-8 rounded-[3rem] mb-8 relative border-2 border-indigo-100 min-h-[180px] flex items-center justify-center">
                <h3 className="text-2xl font-black text-indigo-900 leading-tight text-center">
                  {questions[currentIndex]?.q}
                </h3>
                
                {/* CORRECT FEEDBACK */}
                {showFeedback === 'correct' && (
                  <div className="absolute inset-0 bg-green-500 flex items-center justify-center rounded-[3rem] text-white z-10 animate-in zoom-in duration-200">
                    <div className="text-center p-4">
                      <Trophy size={60} className="mx-auto mb-2" />
                      <span className="text-4xl font-black drop-shadow-md block uppercase">Brilliant Arnav!</span>
                    </div>
                  </div>
                )}

                {/* RETRY FEEDBACK (First Mistake) */}
                {showFeedback === 'retry' && (
                  <div className="absolute inset-0 bg-amber-400 flex flex-col items-center justify-center rounded-[3rem] text-white z-10 animate-in zoom-in duration-200 p-6 text-center">
                    <RefreshCcw size={60} className="mb-2 animate-spin-slow" />
                    <span className="text-3xl font-black mb-2">TRY AGAIN!</span>
                    <p className="font-bold opacity-90">One more chance, Arnav!</p>
                  </div>
                )}

                {/* WRONG FEEDBACK (Second Mistake - Correct Answer Reveal) */}
                {showFeedback === 'wrong' && (
                  <div className="absolute inset-0 bg-rose-500 flex flex-col items-center justify-center rounded-[3rem] text-white z-10 animate-in zoom-in duration-200 p-6 text-center">
                    <XCircle size={60} className="mb-2" />
                    <span className="text-2xl font-black mb-4 uppercase">No Worries, Arnav!</span>
                    
                    <div className="bg-white/20 p-4 rounded-2xl w-full">
                      <p className="text-xs uppercase font-black opacity-80 mb-1 tracking-wider">The Correct Answer Is:</p>
                      <p className="text-2xl font-black drop-shadow-sm">
                        {questions[currentIndex]?.a[questions[currentIndex]?.correct]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentIndex]?.a.map((opt, i) => (
                  <button
                    key={i}
                    disabled={showFeedback !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-5 rounded-3xl border-2 font-black transition-all shadow-sm flex items-center
                      ${showFeedback === 'wrong' && i === questions[currentIndex].correct 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-slate-100 bg-white text-slate-700'}
                      ${showFeedback === null ? 'hover:border-indigo-500 active:bg-indigo-50' : ''}
                    `}
                  >
                    <span className="inline-block w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-center leading-8 mr-4 text-sm font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showFeedback !== null && i === questions[currentIndex].correct && (
                      <CheckCircle className="text-green-500 ml-2" size={20} />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex gap-2">
                   {[1, 2].map(num => (
                     <div 
                      key={num} 
                      className={`w-3 h-3 rounded-full transition-colors ${attempts >= num ? 'bg-rose-400' : 'bg-slate-200'}`}
                     />
                   ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Chances Used</p>
              </div>
            </div>
          )}

          {view === 'result' && (
            <div className="flex flex-col items-center text-center pt-10 animate-in zoom-in duration-500">
              <Trophy size={100} className="text-amber-400 mb-6 animate-bounce" />
              <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase italic">Winner!</h2>
              <p className="text-slate-500 mb-10 text-xl font-bold">You scored {score} / {questions.length}!</p>
              
              <div className="w-full space-y-3">
                <button onClick={() => startQuiz(selectedGrade, selectedSubject)} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl">
                  <RotateCcw size={24} /> PLAY AGAIN
                </button>
                <button onClick={reset} className="w-full bg-slate-100 text-slate-600 py-5 rounded-3xl font-black text-xl">
                  <Home size={24} className="inline mr-2" /> BACK HOME
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>
        {`
        @keyframes zoom-in { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}
