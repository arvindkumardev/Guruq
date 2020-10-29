import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from './colors';
import { RfH, RfW } from '../utils/helpers';
import { spacePX } from './variables';
import { STANDARD_SCREEN_SIZE } from '../utils/constants';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: Colors.brandBlue2,
    marginHorizontal: RfW(58),
    height: RfH(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: RfH(30),
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  disableButton: {
    backgroundColor: Colors.secondaryText,
    height: RfH(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: RfW(144),
  },
  textButtonPrimary: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
  },

  lineSeparator: {
    flex: 1,
    borderBottomColor: Colors.secondaryText,
    borderBottomWidth: 0.5,
    // marginTop: RfH(16),
    opacity: 0.2,
  },
});
export default styles;
