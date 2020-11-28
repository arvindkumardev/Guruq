import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../../../utils/constants';
import {RfH, RfW} from "../../../../../utils/helpers";

const styles = StyleSheet.create({
  bottomText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    color: Colors.darkgrey,
  },
  bottomTabActive: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    color: Colors.brandBlue2,
  },
  iconStyle:{
    height: RfH(17),
    width: RfW(17.7),
    marginVertical: RfH(5)
  }
});
export default styles;
