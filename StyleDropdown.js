function StyleDropdown({ options, index, onChoose, defaultText })
{
   const text = index < 0 ? defaultText : options[index];

   let optionLinks = [];
   for (let i=0; i<options.length; i++)
      optionLinks.push(
         h('a',
           {
              href: '#',
              onClick: () => onChoose(i)
           },
           options[i]
          )
      );

   return h(
      'div.StyleDropdownContainer', {}
      [
         h('button.StyleDropdownButton', {}, text),

         h('div.StyleDropdownContent', {}, optionLinks)
      ]
   );
}
