import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/fonts';

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

  myProfileText: {
    fontSize: RFValue(34, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
  },

  userDetailsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: RfH(24),
  },
  userIcon: {
    height: RfH(64),
    width: RfW(64),
    // TODO: fix circle
    borderTopLeftRadius: RfW(64),
    borderTopRightRadius: RfW(64),
    borderBottomLeftRadius: RfW(64),
    borderBottomRightRadius: RfW(64),
  },
  userName: {
    // marginTop: RfH(8),
    // marginLeft: RfW(12),
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
  },
  userMobDetails: {
    color: Colors.darkGrey,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
  },

  bottomParent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  userMenuParentView: {
    flex: 1,
    // marginTop: RfH(16),
    backgroundColor: Colors.white,
    paddingHorizontal: RfW(16),
    height: RfH(54),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5,
  },

  menuItemParentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  menuItemPrimaryText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    color: Colors.primaryText,
    marginLeft: RfW(16),
  },
  menuItemSecondaryText: {
    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
    marginLeft: RfW(16),
    color: Colors.secondaryText,
  },

  versionText: {
    color: Colors.secondaryText,
    textAlign: 'left',
  },

  actionIconParentView: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    // marginTop: RfH(8),
  },
});
export default styles;
