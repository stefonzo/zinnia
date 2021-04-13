'use strict';

const h = Inferno.h;

function useState(initial) {
   let state = initial;
   let setState = (value) => {
      state = value;
      render();
   }
   return [state, setState];
}


function render()
{
   Inferno.render(
      h(App, {}),
      document.getElementById('root')
   );
}


window.onload = render;
