function StyleButton(props)
{
   const { enabled, handleClick, style } = props;
   
   const className = enabled ? 'StyleButtonEnabled' : 'StyleButtonDisabled';
   
   
   return h(
      `div.unselectable.StyleButton.${className}`,
      {
         style,
         onClick: handleClick,
      },
      props.text
   );
}
