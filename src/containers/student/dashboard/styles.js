import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  bottomText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    marginTop: RfH(4),
    color: Colors.secondaryText,
  },
  bottomTabActive: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    marginTop: RfH(4),
    color: Colors.brandBlue2,
  },
});
export default styles;
