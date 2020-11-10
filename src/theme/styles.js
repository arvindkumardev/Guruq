import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from './colors';
import { RfH, RfW } from '../utils/helpers';
import { spacePX } from './variables';
import { STANDARD_SCREEN_SIZE } from '../utils/constants';
import Fonts from './fonts';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: Colors.brandBlue2,
    marginHorizontal: RfW(56),
    width: RfW(144),
    height: RfH(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: RfH(4),
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  disableButton: {
    backgroundColor: Colors.secondaryText,
    height: RfH(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: RfW(144),
  },
  textButtonPrimary: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  lineSeparator: {
    flex: 1,
    borderBottomColor: Colors.secondaryText,
    borderBottomWidth: 0.5,
    // marginTop: RfH(16),
    opacity: 0.5,
  },
  lineSeparatorWithMargin: {
    flex: 1,
    borderBottomColor: Colors.secondaryText,
    borderBottomWidth: 0.5,
    marginVertical: RfH(16),
    marginHorizontal: RfH(16),
    opacity: 0.5,
  },
  topActionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RfH(44),
  },
  horizontalChildrenView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  horizontalChildrenStartView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontFamily: 'SegoeUI-bold',
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
  },
  horizontalChildrenSpaceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalChildrenCenterView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticallyCenterItemsView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  verticallyStretchedItemsView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  blankViewSmall: {
    marginTop: RfH(24),
  },

  borderTop: {
    borderTopColor: Colors.borderColor,
    borderTopWidth: 0.5,
  },
  borderBottom: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5,
  },
  pageTitleThirdRow: {
    fontSize: RFValue(34, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.bold,
  },
  titleText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
  },
  headingText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  secondaryText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    color: Colors.darkGrey,
  },
  blockHeading: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.primaryText,
  },
});
export default styles;
