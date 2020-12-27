import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../theme';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  itemStyle: {
    padding: RfH(10),
    marginHorizontal: RfW(4),
    marginVertical: RfH(4),
    borderRadius: RfH(8),
  },
  bookingSelectorParent: {
    borderRadius: 8,
    width: RfW(72),
    height: RfH(32),
    borderWidth: 1,
    borderColor: Colors.brandBlue2,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemParent: {
    // borderRadius: RfH(8),
    marginBottom: RfH(24),
  },
  userIconParent: {
    // flex: 0.3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    height: RfH(90),
    width: RfW(80),
    borderRadius: RfH(8),
  },
  tutorName: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
    fontFamily: Fonts.semiBold,
  },
  tutorDetails: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    marginTop: RfH(2),
  },
});
export default styles;
