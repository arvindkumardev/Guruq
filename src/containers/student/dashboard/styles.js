import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  bottomText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    // marginTop: RfH(4),
    color: Colors.secondaryText,
  },
  bottomTabActive: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    // marginTop: RfH(4),
    color: Colors.brandBlue2,
  },

  userDetailsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: RfH(24),
  },
  userIcon: {
    height: RfH(82),
    width: RfW(82),
    borderRadius: 8,
  },
  userName: {
    marginTop: RfH(8),
    marginLeft: RfW(12),
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
    color: Colors.black,
  },
  userMobDetails: {
    marginLeft: RfW(12),
    color: Colors.darkGrey,
  },


  actionIconParentView: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
export default styles;
