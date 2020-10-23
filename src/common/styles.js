import { StyleSheet } from 'react-native';
import Colors from '../theme/colors';
import { RfH, RfW } from '../utils/helpers';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  buttonPrimary: {
    backgroundColor: Colors.primaryButtonBackground,
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
    backgroundColor: Colors.inputLabel,
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
    fontSize: 18,
  },
});
export default styles;
