const Colors = {
  white: '#ffffff',
  black: '#000000',
  lightBlack: '#222222',
  darkGrey: '#818181',
  lightGrey: '#f6f6f6',
  lightGrey2: '#E7E5F2',
  greyBlue: '#E7E5F2',
  brandBlue: '#1E5AA0',
  brandBlue2: '#07A6EE',
  primaryText: '#000000',
  secondaryText: '#888888',
  borderColor: '#d9d9d9',

  orange: '#fcb92d',
  orangeRed: '#fe3d3d',
  lightPurple: '#e7e5f2',
  lightGreen: '#e6fce7',
  green: '#2cbe5a',
  lightOrange: '#fff7f0',
  skyBlue: '#cbe7ff',
  lightBlue: '#e8f7fe',
  subjectBlue: '#CBE7FF',
};

export const getBoxColor = (name) => {
  let icon = '';
  switch (name) {
    case 'Accounts':
      icon = Colors.lightGreen;
      break;
    case 'Chemistry':
      icon = Colors.lightGreen;
      break;
    case 'Civics':
      icon = Colors.lightPurple;
      break;
    case 'Computer Science':
      icon = Colors.lightGreen;
      break;
    case 'Dna':
      icon = Colors.subjectBlue;
      break;
    case 'Hindi':
      icon = Colors.subjectBlue;
      break;
    case 'Geography':
      icon = Colors.lightOrange;
      break;
    case 'English':
      icon = Colors.lightPurple;
      break;
    case 'Engineering':
      icon = Colors.lightPurple;
      break;
    case 'Economics':
      icon = Colors.subjectBlue;
      break;
    case 'History':
      icon = Colors.subjectBlue;
      break;
    case 'Law':
      icon = Colors.lightPurple;
      break;
    case 'Mathematics':
      icon = Colors.lightGreen;
      break;
    case 'Medical':
      icon = Colors.lightPurple;
      break;
    case 'Physical Education':
      icon = Colors.lightOrange;
      break;
    case 'Sociology':
      icon = Colors.lightOrange;
      break;
    case 'Sanskrit':
      icon = Colors.lightGreen;
      break;
    case 'Psychology':
      icon = Colors.lightOrange;
      break;
    case 'Political Science':
      icon = Colors.lightGreen;
      break;
    case 'Physics':
      icon = Colors.lightOrange;
      break;
    case 'ssc-govt':
      icon = Colors.lightGreen;
      break;
    default:
      icon = Colors.lightPurple;
  }
  return icon;
};

export default Colors;
