import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  skip: {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: Colors.white,
    marginTop: RfH(49),
    marginRight: RfW(19),
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
    marginTop: RfH(18),
  },
  title: {
    fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
    marginTop: RfH(38),
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
    marginHorizontal: RfW(42),
    marginTop: RfH(28),
    color: Colors.white,
  },
});
export default styles;
