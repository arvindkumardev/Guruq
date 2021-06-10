import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import Fonts from '../../theme/fonts';

// eslint-disable-next-line no-undef
export const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: RfW(16),
    marginBottom: RfH(17),
  },
  studentName: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
    fontFamily: Fonts.semiBold,
  },
  studentDetails: {
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    marginTop: RfH(2),
  },
});
