const linkEvent = Inferno.linkEvent;


function InputBox(props)
{
   const { shaking, handleKeyDown } = props;
   
   const className = shaking ? '.shake' : '';
   
   return h(
      `input${className}`,
      {
         id: 'pinyin-input',
         type: 'text',
         value: props.value,
         onKeyDown: handleKeyDown,
      }
   );
}
