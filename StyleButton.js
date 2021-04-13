function StyleButton(props)
{
   const { enabled, handleClick } = props;
   
   const className = enabled ? 'StyleButtonEnabled' : 'StyleButtonDisabled';
   
   
   return h(
      `div.unselectable.StyleButton.${className}`,
      {
         onClick: handleClick,
      },
      props.text
   );
}
