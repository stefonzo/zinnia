const levels = [];
const LEVEL_SIZE = 20;

for (let i=0; (LEVEL_SIZE*i) < characters.length; i++) {
   let start = (20*i) + 1;
   let end = 20 * (i+1);
   end = end > characters.length ? characters.length-1 : end;
   
   levels.push(`Level ${i+1} (${start} - ${end})`);
}


const gameModes = [
   'Only Level Characters',
   'Level + Previous Four Levels',
   'All Characters up to Level',
];

const GAMEMODE_LEVEL_ONLY = 0;
const GAMEMODE_PREV_LEVELS = 1;
const GAMEMODE_ALL_TO_LEVEL = 2;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let state = {
   level: 0,
   gameMode: GAMEMODE_LEVEL_ONLY,
   paused: false,
   
   levelCharacters: [],
   index: 0,
   
   character: '你',
   pinyin: 'ni3',

   guessHistory: [],
   numGuesses: 0,
   correctGuesses: 0,
   
   hintLevel: 0,
   
   inputValue: undefined,
   inputShaking: false,
};


function setState(update)
{
   for (const key in update)
      state[key] = update[key];

   render();
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const App = function()
{
   const {
      levelCharacters, time,
      level, gameMode,
      character, pinyin,
      numGuesses, correctGuesses,      
      hintLevel,
      inputValue, inputShaking
   } = state;

   return h(
      'div', {},
      [
         h(ScoreView,
           { level: level,
             numCharacters: levelCharacters.length,
             guesses: numGuesses,
             correctGuesses,
             time,
           }),
         
         h('h1', {}, character),
         
         h(InputBox,
           { value: inputValue,
             shaking: inputShaking,
             handleKeyDown: handleInputKeyDown,
           }),

         h('br'),

         h(HintButton,
           {
              answer: pinyin,
              hintLevel,
              handleClick: () => setState({ hintLevel: hintLevel+1 }),
           }),

         h('br'),

         h(StyleDropdown,
           { options: levels,
             index: level,
             defaultText: 'Select a Level',
             onChoose: (index) => {
                setState({ level: index });
                reset();
             },
           }),

         h(StyleDropdown,
           { options: gameModes,
             index: gameMode,
             defaultText: 'Select a Game Mode',
             onChoose: (index) => {
                setState({ gameMode: index });
                reset();
             },
           }),
      ]
   );
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function handleInputKeyDown(event)
{
   const KEY_ENTER = 13;
      
   if (event.keyCode === KEY_ENTER) {
      makeGuess();
   }
   else {
      setTimeout(() => setState({
         inputValue: event.target.value
      }), 300);
   }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function makeGuess()
{
   const { inputValue, pinyin } = state;
   
   if (inputValue === pinyin)
         correctAnswer();
      else
         shakeInputBox();
}

function correctAnswer()
{
   setState({
      inputValue: undefined,
      hintLevel: 0,
   });
}

function shakeInputBox()
{
   setState({ inputShaking: true });
   setTimeout(() => setState({ inputShaking: false }), 300);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// fisher-yates shuffle
function shuffledArray(arr)
{
   const shuffled = [...arr];
   for (let i=arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random() * i);
      let tmp = shuffled[j];
      shuffled[j] = shuffled[i];
      shuffled[i] = tmp;
   }

   return shuffled;
}


function buildLevel(level, levelSize, gameMode, characters)
{
   let start;
   
   switch (gameMode) {
   case GAMEMODE_LEVEL_ONLY:
      start = levelSize * level;
      break;

   case GAMEMODE_PREV_LEVELS:
      start = levelSize * (level - 4);
      break;

   case GAMEMODE_ALL_TO_LEVEL:
      start = 0;
      break;

   default:
      start = 0;
      break;
   }

   start = start < 0 ? 0 : start;
   
   let end = levelSize * (level + 1);

   const levelCharacters = [];
   for (let i=start; i<end; i++)
      levelCharacters.push(characters[i]);

   return shuffledArray(levelCharacters);
}

function reset() {
   const { level, gameMode } = state;

   const levelCharacters = buildLevel(level, LEVEL_SIZE, gameMode, characters);

   const [character, pinyin] = levelCharacters[0];

   clearInterval(timeInterval);
   timeInterval = setInterval(() => {
      const { paused, time } = state;
      if (!paused)
         setState({ time: time+1 });
   }, 1000);
   
   setState({
      levelCharacters,
      index: 0,
      paused: false,
      time: 0,
      
      character,
      pinyin,
      
      guessHistory: [],
      numGuesses: 0,
      correctGuesses: 0,
      
      hintLevel: 0,
      
      inputValue: undefined,
      inputShaking: false,
   });
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let timeInterval;

function ScoreView({ level, numCharacters, guesses, correctGuesses, time })
{
   const minutes = Math.floor(time/60);
   let seconds = time % 60;
   seconds = seconds < 10 ? '0' + seconds : seconds;


   const levelName = `Level ${level + 1}`;
   const percentage =
         guesses === 0 ? '100.0' : String(0.1 * Math.floor(1000 * correctGuesses / guesses));
   const score = `${correctGuesses}/${numCharacters} (${percentage}%)`;

   return h(
      'div', {},
      [
         h('h1', {}, `${levelName} - ${minutes}:${seconds}`),
         h('h1', {}, score),
      ]
   );
}
