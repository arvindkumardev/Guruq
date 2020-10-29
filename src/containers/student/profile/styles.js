import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/Fonts';

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
    color: 'rgb(25,24,24)',
  },
  userMobDetails: {
    marginLeft: RfW(12),
    color: 'rgb(129,129,129)',
  },
  separatorView: {
    flex: 1,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.5,
    marginTop: RfH(16),
    opacity: 0.1,
  },
  bottomParent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  userMenuParentView: {
    flex: 1,
    marginTop: RfH(16),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuItemParentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  menuItemPrimaryText: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: RfW(12),
  },
  menuItemSecondaryText: {
    marginLeft: RfW(12),
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
    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    marginTop: RfH(8),
  },
});
export default styles;
