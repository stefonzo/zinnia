'use strict';

const h = Inferno.h;

const GlobalState = {};

// IMPURE
const updateState = (state, update) => Object.keys(update).forEach(
   key => {
      if (typeof(state[key]) === 'object')
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
   const { currentLevel, guessInput, } = state;

   if (guessInput.isShaking)
      // side-effect!!
      setTimeout(() => setState({ guessInput: { isShaking: false } }), 300);
   
   return h(Game, {
      state,
      currentLevel,
      guessInput,
   });
};


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Components
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const Game = ({ state, currentLevel, guessInput }) => {
   const { characters, index, running } = currentLevel;

   if (!running)
      return h('p', {}, 'Finished');
   else {
      const [ character ] = characters[index];

      return h('div', {}, [
         h('p', {}, character),
         h(GuessInput, {
            value: guessInput.value,
            isShaking: guessInput.isShaking,
            handleInput: updateStateOnEvent(state, handleGuessInputInput),
            handleKeyDown: updateStateOnEvent(state, handleGuessInputKeyDown),
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
   const newLevel = 0;
   const gameModes = availableGameModes(newLevel, 20);
   const newGameMode = 0;

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
      return shuffled(characters.slice(start, end));
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
         correctGuesses: 0,
         totalGuesses: 0,
         running: true,
      },
      guessInput: {
         value: '',
         isShaking: false,
      }
   };
};


// IMPURE
window.onload = () => {
   const initialState = reset();
   setState(initialState);
};
      
      
