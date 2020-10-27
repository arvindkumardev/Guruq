import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  bottomText: {
    fontSize: 10,
    marginTop: RfH(4),
    color: Colors.inputLabel,
  },
  bottomTabActive: {
    fontSize: 10,
    marginTop: RfH(4),
    color: Colors.primaryButtonBackground,
  },
  myProfileText: {
    marginTop: RfH(48),
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(25,24,24)',
  },
  userMobDetails: {
    marginLeft: RfW(12),
    color: 'rgb(129,129,129)',
  },
  separatorView: {
    flex: 1,
    borderBottomColor: Colors.inputLabel,
    borderBottomWidth: 0.5,
    marginTop: RfH(16),
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darktitle,
    marginLeft: RfW(12),
  },
  menuItemSecondaryText: {
    marginLeft: RfW(12),
    color: Colors.inputLabel,
  },
  actionIconParentView: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: Colors.inputLabel,
    marginTop: RfH(8),
  },
});
export default styles;
