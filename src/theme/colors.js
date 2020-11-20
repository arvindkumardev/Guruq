const Colors = {
  white: '#ffffff',
  black: '#000000',
  darkGrey: '#818181',
  lightGrey: '#f6f6f6',

  brandBlue: '#1E5AA0',
  brandBlue2: '#07A6EE',

  primaryText: '#000000',
  secondaryText: '#888888',
  borderColor: '#d9d9d9',

  orange: '#fcb92d',
  orangeRed: '#fe3d3d',
  lightPurple: '#e7e5f2',
  lightGreen: '#e6fce7',
  lightOrange: '#fff7f0',
  skyBlue: '#cbe7ff',
  lightBlue: '#e8f7fe',
};

export const getBoxColor = (id: number) => {
  return id % 5 === 0
    ? Colors.lightPurple
    : id % 5 === 1
    ? Colors.lightOrange
    : id % 5 === 2
    ? Colors.lightGreen
    : Colors.skyBlue;
};

export default Colors;
