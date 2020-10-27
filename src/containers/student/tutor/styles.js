import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  topView: {
    height: RfH(100),
    backgroundColor: Colors.lightPurple,
    padding: RfH(16),
  },
  bookIcon: {
    alignSelf: 'flex-end',
    marginTop: RfH(16),
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: RfH(12),
  },
  switchText: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
  },
  subjectTitleView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  subjectTitle: {
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    fontWeight: 'bold',
    paddingHorizontal: RfW(16),
  },
  classText: {
    color: Colors.secondaryText,
    paddingHorizontal: RfW(16),
  },
  filterParentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: Colors.secondaryText,
    borderBottomColor: Colors.secondaryText,
    borderBottomWidth: RfH(0.5),
    borderTopWidth: RfH(0.5),
    paddingVertical: RfH(4),
    marginTop: RfH(12),
    paddingHorizontal: RfW(16),
  },
  filterText: {
    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
  },
  listItemParent: {
    borderRadius: RfH(8),
    marginTop: RfH(35),
  },
  deatilsParent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: RfW(16),
  },
  userIconParent: {
    flex: 0.3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    height: RfH(90),
    width: RfW(80),
    borderRadius: RfH(8),
  },
  tutorName: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    color: Colors.black,
  },
  tutorDetails: {
    color: Colors.darkGrey,
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    marginTop: RfH(2),
  },
  chargeText: {
    color: Colors.black,
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    fontWeight: '600',
  },
  iconsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default styles;
