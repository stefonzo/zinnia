let state = {
   character: '你',
   pinyin: 'ni3',

   guessHistory: [],
   
   hintLevel: 0,
   
   inputValue: undefined,
   inputShaking: false,
};

let internalState = {};

const KEY_ENTER = 13;


function setState(update)
{
   for (const key in update)
      state[key] = update[key];
   render();
}


const CurrentCharacter = function({character})
{
   return h(
      'h1',
      { onClick: () => setState({currentCharacter: '我'}) },
      character
   );
}


function shakeInputBox()
{
   setState({ inputShaking: true });
   setTimeout(() => setState({ inputShaking: false }), 300);
}

function handleInputKeyDown(event)
{
   const KEY_ENTER = 13;
   const { pinyin, inputValue } = state;
      
   if (event.keyCode === KEY_ENTER) {
      if (inputValue === pinyin)
         correctAnswer();
      else
         shakeInputBox();
   }
   else {
      setTimeout(() => setState({
         inputValue: event.target.value
      }), 300);
   }
}


function correctAnswer()
{
   setState({
      inputValue: undefined,
      hintLevel: 0,
   });
}


const App = function()
{
   const {
      character, pinyin,
      hintLevel,
      inputValue, inputShaking
   } = state;

   console.log(inputValue);
   
   return h(
      'div', {},
      [
         h(CurrentCharacter,
           { character, }),
         
         h(InputBox,
           { value: inputValue,
             shaking: inputShaking,
             handleKeyDown: handleInputKeyDown,
           }),

         h('br'),
         h('br'),

         h(HintButton,
           {
              answer: pinyin,
              hintLevel,
              handleClick: () => setState({ hintLevel: hintLevel+1 }),
           }),
         ]
      );
   }
