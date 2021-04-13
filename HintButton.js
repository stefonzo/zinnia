function getHint(answer, level)
{
   const defaultText = 'Reveal Hint';
   
   if (level === 0)
      return defaultText;

   if (level > 3 || level >= answer.length)
      return answer;

   let hint = '';
   for (let i=0; i<answer.length; i++)
      hint += i >= level ? '*' : answer[i];

   // pad so that button size doesn't change
   while (hint.length < defaultText.length)
      hint = ` ${hint} `;
   
   return hint;
}
   

function HintButton({ answer, hintLevel, handleClick })
{
   const hint = getHint(answer, hintLevel);
   
   return h(
      StyleButton,
      { text: hint,
        style: {
           'min-width': '100px',
        },
        enabled: true,
        handleClick,
      }
   );
}
