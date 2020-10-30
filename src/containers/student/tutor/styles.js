import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  topView: {
    height: RfH(98),
    backgroundColor: Colors.lightPurple,
    paddingVertical: RfH(16),
    paddingRight: RfW(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookIcon: {
    alignSelf: 'flex-end',
    // marginTop: RfH(16),
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // padding: RfH(12),
    height: 54,
  },
  switchText: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
  },
  subjectTitle: {
    color: Colors.primaryText,
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Bold',
    // paddingHorizontal: RfW(16),
  },
  classText: {
    color: Colors.darkGrey,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
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
    paddingHorizontal: RfW(16),
    height: 34,
  },
  filterText: {
    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
  },
  listItemParent: {
    borderRadius: RfH(8),
    marginTop: RfH(35),
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
    color: Colors.primaryText,
    fontFamily: Fonts.semiBold,
  },
  tutorDetails: {
    color: Colors.darkGrey,
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    marginTop: RfH(2),
  },
  chargeText: {
    color: Colors.black,
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    marginLeft: RfW(4),
  },
  iconsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    // marginLeft: RfW(8),
    marginTop: RfH(24),
  },
  filterPopupParentView: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  transparentTopView: {
    backgroundColor: Colors.black,
    opacity: 0.5,
    flex: 1,
  },
  bottomViewParent: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: Colors.white,
  },
  popupHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: RfW(0.3),
    height: RfH(56),
  },
  filterContentView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: RfH(140),
  },
  filterItemView: {
    flex: 0.4,
    borderRightColor: Colors.darkGrey,
    borderRightWidth: 0.5,
  },
  filterButttonParent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: RfH(40),
    marginHorizontal: RfW(16),
  },
  buttonText: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
  },
  borderButton: {
    flex: 0.5,
    borderColor: Colors.brandBlue2,
    justifyContent: 'center',
    marginRight: RfW(4),
  },
  solidButton: {
    flex: 0.5,
    backgroundColor: Colors.brandBlue2,
    marginLeft: RfW(4),
  },
  activeFilterItem: {
    height: RfH(52),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  disableFilterItem: {
    height: RfH(52),
    backgroundColor: Colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  indicatorView: {
    width: RfW(4),
    height: RfH(52),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RfH(8),
    borderColor: Colors.darkGrey,
    height: RfH(28),
    marginLeft: RfW(8),
    borderRadius: RfW(8),
  },
  compareTutorName: {
    marginTop: RfH(16),
    alignSelf: 'center',
    fontFamily: 'SegoeUI-Semibold',
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
  },
  informationParentMargin: {
    paddingHorizontal: RfW(16),
    marginTop: RfH(30),
  },
  infoCategoryText: {
    marginTop: RfH(8),
    alignSelf: 'center',
    color: Colors.black,
  },
  ratingText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
  },
  qualificationItemText: {
    flex: 0.5,
    color: Colors.darkGrey,
    marginTop: RfH(8),
  },
  typeItemText: {
    color: Colors.darkGrey,
    alignSelf: 'center',
    marginLeft: RfW(8),
  },
  crossIcon: {
    alignSelf: 'flex-end',
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    borderRadius: 9,
  },
  topViewAfterScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.lightPurple,
    paddingTop: RfH(8),
  },
  appliedFilterText: {
    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
  },
});
export default styles;
