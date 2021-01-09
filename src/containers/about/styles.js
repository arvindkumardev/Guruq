import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../theme';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH } from '../../utils/helpers';

const styles = StyleSheet.create({
  aboutText: {
    color: Colors.darkGrey,
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    lineHeight:19
  },
  labelHeader:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: RfH(25),
  },
  aboutDetailLabel:{
    textAlign: 'center',
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
  },
  labelText:{
    color: Colors.primaryText,
    fontFamily: Fonts.bold,
    fontSize: 20,
  }
});
export default styles;
