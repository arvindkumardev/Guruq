import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  skip: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    color: Colors.white,
    marginTop: RfH(44),
    // marginRight: RfW(16),
    alignSelf: 'flex-end',
  },
  swipeChild: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImage: {
    width: RfW(178),
    height: RfH(383),
    marginTop: RfH(44),
  },
  title: {
    fontSize: RFValue(34, STANDARD_SCREEN_SIZE),
    marginTop: RfH(22),
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    // marginHorizontal: RfW(42),
    marginTop: RfH(8),
    color: Colors.white,
  },
});
export default styles;
