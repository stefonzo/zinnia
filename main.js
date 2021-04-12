'use strict';

const h = Inferno.h;

function render()
{
   Inferno.render(
      h(App, {}),
      document.getElementById('root')
   );
}


window.onload = render;
