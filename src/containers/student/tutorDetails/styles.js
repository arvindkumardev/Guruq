import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
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
  classMeta: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    marginTop: RfH(2),
  },
  topView: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: RfH(10),
    paddingHorizontal: RfW(16),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topMainView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  markFavouriteView: {
    height: RfH(44),
    width: RfW(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: RfW(16),
    marginBottom: RfH(17),
  },
});
export default styles;
