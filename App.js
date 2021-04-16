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
const App = ({state, setState}) => {
   const { guessInput, } = state;

   return h(GuessInput, {
      value: guessInput.value,
      isShaking: guessInput.isShaking,
      handleInput: updateStateOnEvent(state, handleGuessInputInput),
      handleKeyDown: updateStateOnEvent(state, handleGuessInputKeyDown),
   });
};


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Components
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const GuessInput = ({value, isShaking, handleInput, handleKeyDown}) => {
   const inputTag = isShaking ? 'input.shaking' : 'input';

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


const handleGuessInputInput = (state, event) =>
      ({ guessInput: { value: event.target.value } });


const handleGuessInputKeyDown = (state, event) => {
   const KEYCODE_ENTER = 13;

   if (event.keyCode === KEYCODE_ENTER) {
      console.log(state.guessInput.value);
      return { guessInput: { value: '' } };
   }

   return {};
};


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Document load
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// IMPURE
window.onload = () => {
   const initialState = {
      guessInput: {
         value: '',
         isShaking: false,
      },
   };
               
   setState(initialState);
}
      
      
