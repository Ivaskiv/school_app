import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    borderRadius: '4px',
    borderColor: '#ccc',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? data.color || 'transparent'
      : isFocused
      ? `${data.color || 'transparent'}1A`
      : undefined,
    color: isDisabled ? 'black' : isSelected ? '#fff' : data.color || 'black',
    cursor: isDisabled ? 'not-allowed' : 'default',
    ':active': {
      ...styles[':active'],
      backgroundColor: isSelected ? data.color : isFocused ? `${data.color}3D` : undefined,
    },
  }),
  input: styles => ({
    ...styles,
    paddingLeft: 8,
  }),
  placeholder: styles => ({
    ...styles,
    color: '#ccc',
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.color || 'transparent',
  }),
};

export default function MultiSelect({ options, value, onChange, placeholder, isMulti = true }) {
  return (
    <Select
      isMulti={isMulti}
      closeMenuOnSelect={false}
      components={animatedComponents}
      value={value}
      onChange={selectedOptions => {
        onChange(selectedOptions);
      }}
      options={options}
      placeholder={placeholder}
      styles={colourStyles}
    />
  );
}
