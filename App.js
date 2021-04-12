let state = {};
let internalState = {};

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
   

const App = function()
{
   const { currentChar } = state;
   
   return h(
      'div', {},
      [
         h(
            CurrentCharacter,
            {character: currentChar}
         ),
      ]
   );
}
