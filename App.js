let state = {
   level: 1,
   
   levelCharacters: [],
   index: 0,
   
   character: '你',
   pinyin: 'ni3',

   guessHistory: [],
   
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

const opts = [
   'Hello, world!',
   'Goodbye, world!',
   'What\'s up, doc?',
];

const App = function()
{
   const {
      character, pinyin,
      hintLevel,
      inputValue, inputShaking
   } = state;

   return h(
      'div', {},
      [
         h('h1', {}, character),
         
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

         h(StyleDropdown,
           { options: opts,
             index: -1,
             defaultText: 'Dropdown',
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

