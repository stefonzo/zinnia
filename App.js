let state = {};
let internalState = {};

const KEY_ENTER = 13;

state.currentChar = '你';

function setState(key, value)
{
   state[key] = value;
   render();
}


const CurrentCharacter = function({character})
{
   return h(
      'h1',
      { onClick: () => setState('currentChar', '我') },
      character
   );
}

function shakeInputBox()
{
   setState('inputShaking', true);
   setTimeout(() => setState('inputShaking', false), 300);
}


const App = function()
{
   const { currentChar, inputValue, inputShaking } = state;
   
   return h(
      'div', {},
      [
         h(CurrentCharacter,
           { character: currentChar
           }),
         
         h(InputBox,
           { value: inputValue,
             shouldGrabFocus: true,
             shaking: inputShaking,
             handleKeyDown: (e) =>
             {
                if (e.keyCode == KEY_ENTER) {
                   console.log(inputValue);
                }
                else {
                   setTimeout(() => setState('inputValue', e.target.value), 0);
                }
             }
           }),

         h(StyleButton,
           {
              text: 'hello, world',
              enabled: true,
              handleClick: () => {
                 console.log('hi there');
              },
           }),
         ]
      );
   }
