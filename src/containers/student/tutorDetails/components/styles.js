import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { RfH, RfW } from '../../../../utils/helpers';

const styles = StyleSheet.create({
  appliedFilterText: {
    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
  },
  bookingSelectorParent: {
    borderRadius: 4,
    width: RfW(100),
    height: RfH(36),
    borderWidth: 1,
    borderColor: Colors.brandBlue2,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});
export default styles;
