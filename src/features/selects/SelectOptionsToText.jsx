const SelectOptionsToText = ({ selectedOptions }) => {
  const text =
    Array.isArray(selectedOptions) && selectedOptions.length > 0
      ? selectedOptions.map(option => option.label).join(', ')
      : '-';
  return <span>{text}</span>;
};

export default SelectOptionsToText;
