'use strict';

const h = Inferno.h;

const linearArray = n => {
      let array = [];
      for (let i=0; i<n; i++)
         array.push(i);
      return array;
   };

const GlobalState = {};
const CHARACTERS_PER_LEVEL = 20;
const Constant = {
   CHARACTERS: characters,
   CHARACTERS_PER_LEVEL,
   LEVEL_NAMES: linearArray(characters.length/CHARACTERS_PER_LEVEL)
      .map(n => `${n+1} (Characters ${(CHARACTERS_PER_LEVEL*n)+1}-${CHARACTERS_PER_LEVEL*(n+1)})`),
};

// IMPURE
const updateState = (state, update) => Object.keys(update).forEach(
   key => {
      if (typeof(state[key]) === 'object' && !(Array.isArray(state[key])))
         updateState(state[key], update[key]);
      else
         state[key] = update[key];
   });

// IMPURE
const setState = update => {
   updateState(GlobalState, update);
   Inferno.render(
      h(App, {state: GlobalState, setState}),
      document.getElementById('root')
   );
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * App
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// IMPURE
const App = ({state}) => {
   const { gameParams, currentLevel, guessInput, } = state;

   if (guessInput.isShaking)
      // side-effect!!
      setTimeout(() => setState({ guessInput: { isShaking: false } }), 300);

   if (currentLevel.oldTimer) {
      // side-effect!!
      clearInterval(currentLevel.oldTimer);
      currentLevel.oldTimer = undefined;
      currentLevel.timer = setInterval(() => {
         const { time, running } = GlobalState.currentLevel;
         if (running)
            setState({ currentLevel: { time: time+1 } });
      }, 1000);
   }
   
   return h('div', {}, [
      h(Score, { gameParams, currentLevel }),
      h(Game, {
         currentLevel,
         guessInput,
         eventHandlers: {
            handleInput: updateStateOnEvent(state, handleGuessInputInput),
            handleKeyDown: updateStateOnEvent(state, handleGuessInputKeyDown),
            handlePlayAgainClick: updateStateOnEvent(state, handlePlayAgainClick),
            handleHintButtonClick: updateStateOnEvent(state, handleHintButtonClick),
         },
      }),
      h(LevelSelect, {
         gameParams,
         handleInput: updateStateOnEvent(state, handleLevelInput),
      }),
      h(ModeSelect, {
         gameParams,
         handleInput: updateStateOnEvent(state, handleModeInput),
      }),
   ]);
};


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Components
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const Score = ({ gameParams, currentLevel }) => {
   const { level } = gameParams;
   const {
      characters,
      correctGuesses,
      totalGuesses,
      time
   } = currentLevel;
   
   const minutes = String(Math.floor(time/60));
   const seconds = String(time % 60).padStart(2, '0');

   const fractionCorrect = totalGuesses === 0 ? 1 : correctGuesses / totalGuesses;
   const percentage = (100*fractionCorrect).toFixed(1) + '%';

   return h('div', {}, [
      h('h1', {}, `Level ${level+1} - ${minutes}:${seconds}`),
      h('h1', {}, `${correctGuesses}/${characters.length} (${percentage})`),
   ]);
};


const Game = ({ currentLevel, guessInput, eventHandlers }) => {
   const { characters, index, hintLevel, running } = currentLevel;
   const {
      handleInput,
      handleKeyDown,
      handlePlayAgainClick,
      handleHintButtonClick,
   } = eventHandlers

   if (!running)
      return h('div', {}, [
         h('p', {}, 'Done!'),
         h('p', {}, h('button', { onClick: handlePlayAgainClick }, 'Play Again')),
      ]);
   else {
      const [ character, pinyin ] = characters[index];

      return h('div', {}, [
         h('p#current-character', {}, character),
         h(GuessInput, {
            value: guessInput.value,
            isShaking: guessInput.isShaking,
            handleInput: handleInput,
            handleKeyDown: handleKeyDown,
         }),
         h(HintButton, {
            answer: pinyin,
            hintLevel,
            handleClick: handleHintButtonClick,
         }),
      ]);
   }
};


const GuessInput = ({value, isShaking, handleInput, handleKeyDown}) => {
   const inputTag = isShaking ? 'input.shake' : 'input';

   return h(inputTag, {
      type: 'text',
      value,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
   });
};


const HintButton = ({ answer, hintLevel, handleClick }) => {
   const getHint = (answer, hintLevel) => {
      if (hintLevel === 0)
         return 'Reveal Hint';
      else if (hintLevel > 3)
         return answer;
      else
         return answer.slice(0, hintLevel).padEnd(answer.length, '*');
   }

   const hint = getHint(answer, hintLevel);

   return h('p', {}, h('button', { onClick: handleClick }, hint));
}


const LevelSelect = ({ gameParams, handleInput, handleFocusIn }) => {
   const { level } = gameParams;

   const options = Constant.LEVEL_NAMES.map(
      (name, index) =>
      h('option', {
         value: index,
      }, name)
   );
   
   return h('p', {}, [
      h('label', {}, 'Level '),
      h('select', {
         onInput: handleInput,
      }, options),
   ]);
}


const ModeSelect = ({ gameParams, handleInput, handleFocusIn }) => {
   const { gameMode, gameModes } = gameParams;

   const options = gameModes.map(
      (mode, index) =>
      h('option', {
         value: index,
      }, mode.name)
   );
   
   return h('p', {}, [
      h('label', {}, 'Mode '),
      h('select', {
         onInput: handleInput,
      }, options),
   ]);
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Event Handlers
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// IMPURE
const updateStateOnEvent = (state, handler) =>
      event => setState(handler(state, event));


const handleGuessInputInput = (state, event) => (
   { guessInput: { value: event.target.value } }
);


const handleGuessInputKeyDown = (state, event) => {
   const KEYCODE_ENTER = 13;

   const { guessInput, currentLevel } = state;

   const guessValue = guessInput.value;
   const { characters, index, correctGuesses, totalGuesses } = currentLevel;
   const [ _, pinyin ] = characters[index];

   if (event.keyCode === KEYCODE_ENTER) {
      if (guessValue === pinyin)
         return {
            guessInput: {
               value: '',
            },
            currentLevel: {
               index: index + 1,
               hintLevel: 0,
               correctGuesses: correctGuesses + 1,
               totalGuesses: totalGuesses + 1,
               running: (index + 1) < characters.length,
            }
         };
      else
         return {
            guessInput: {
               isShaking: true,
            },
            currentLevel: {
               totalGuesses: totalGuesses + 1,
            }
         };
   }
   else
      // enter wasn't pressed, no update
      return {};
};

const handlePlayAgainClick = (state, event) => reset(state, {});

const handleHintButtonClick = (state, event) => {
   const { hintLevel, totalGuesses } = state.currentLevel;

   if (hintLevel < 4)
      return {
         currentLevel: {
            totalGuesses: totalGuesses + 1,
            hintLevel: hintLevel + 1,
         }
      }
   else
      return {}
}


const handleLevelInput = (state, event) => reset(state, { level: event.target.selectedIndex });

const handleModeInput = (state, event) => reset(state, { gameMode: event.target.selectedIndex });
   


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Document load and game reset
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const availableGameModes = (level, levelSize) => {
   const clampNonNeg = value => value < 0 ? 0 : value;

   const startLevels = [...new Set([
      clampNonNeg(level),
      clampNonNeg(level-3),
      clampNonNeg(level-7),
      clampNonNeg(level-12),
      clampNonNeg(0),
   ])];
   
   const modeName = range => {
      const [start, end] = range;
      
      if (start === end)
         return `Characters from level ${start+1}`;
      else if (start === 0)
         return `Characters from levels 1-${end+1}`;
      else
         return `Characters from levels ${start+1}-${end+1}`;
   }

   const mode = startLevel => {
      const levelRange = [startLevel, level];
      const range = levelRange.map((x, i) => levelSize * (x+i));

      return {
         name: modeName(levelRange),
         range,
      };
   };

   const modes = startLevels.map(mode);
   return modes;
};


const reset = (state, update) => {
   const { level, gameMode } = state.gameParams;
   const { timer } = state.currentLevel;
   
   const newLevel = update.level !== undefined ? update.level : level;
   const gameModes = availableGameModes(newLevel, Constant.CHARACTERS_PER_LEVEL);
   const newGameMode = update.level !== undefined ? 0 :
         update.gameMode !== undefined ? update.gameMode : gameMode;

   // new level characters
   const shuffled = array => {
      const shuffle = [...array];
      for (let i=shuffle.length-1; i>1; i--) {
         const j = Math.floor(Math.random() * (i+1));
         [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
      }
      return shuffle;
   };

   const levelCharacters = gameMode => {
      const [start, end] = gameMode.range;
      return shuffled(Constant.CHARACTERS.slice(start, end)); // global (but constant) access
   };

   return {
      gameParams: {
         level: newLevel,
         gameModes,
         gameMode: newGameMode,
      },
      currentLevel: {
         characters: levelCharacters(gameModes[newGameMode]),
         index: 0,
         hintLevel: 0,
         correctGuesses: 0,
         totalGuesses: 0,
         running: true,
         time: 0,
         oldTimer: timer,
      },
      guessInput: {
         value: '',
         isShaking: false,
      }
   };
};


// IMPURE
window.onload = () => {
   const initialState = reset({
      gameParams: { level: 0, gameMode: 0 },
      currentLevel: { timer: true }
   }, {});
   setState(initialState);
};
      
      
