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
    paddingHorizontal: RfW(16),
  },
  buttonContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.brandBlue2,
    width: RfW(144),
    height: RfH(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: RfH(4),
  },
  buttonOutlinePrimary: {
    backgroundColor: Colors.white,
    borderColor: Colors.brandBlue2,
    // marginHorizontal: RfW(56),
    width: RfW(144),
    height: RfH(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: RfH(4),
    // shadowRadius: 4,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
  },
  buttonOutlineSecondary: {
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    // marginHorizontal: RfW(56),
    width: RfW(144),
    height: RfH(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: RfH(4),
    // shadowRadius: 4,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
  },
  disableButton: {
    backgroundColor: Colors.secondaryText,
    height: RfH(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: RfH(4),
    width: RfW(144),
  },
  textButtonPrimary: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  textButtonOutlinePrimary: {
    textAlign: 'center',
    color: Colors.brandBlue2,
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
  },
  lineSeparator: {
    flex: 1,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.8,
    // marginTop: RfH(16),
    // opacity: 0.5,
  },
  lineSeparatorWithMargin: {
    flex: 1,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5,
    marginVertical: RfH(16),
    marginHorizontal: RfH(16),
    // opacity: 0.5,
  },

  lineSeparatorWithHorizontalMargin: {
    // flex: 1,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.7,
    marginHorizontal: RfH(16),
    // opacity: 0.5,
  },
  lineSeparatorWithVerticalMargin: {
    flex: 1,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5,
    marginVertical: RfH(16),
    // opacity: 0.5,
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
  // pageTitle: {
  //   fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
  //   fontFamily: Fonts.semiBold,
  // },
  horizontalChildrenSpaceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalChildrenEqualSpaceView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    // marginTop: RfH(24),
    height: RfH(17),
  },
  blankViewMedium: {
    // marginTop: RfH(24),
    height: RfH(34),
  },

  blankGreyViewSmall: {
    backgroundColor: Colors.lightGrey,
    height: RfH(17),
  },

  blankGreyViewMedium: {
    backgroundColor: Colors.lightGrey,
    height: RfH(36),
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
  pageTitleBlack:{
    fontSize: RFValue(34, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.bold,
    color: Colors.black,
  },
  // titleText: {
  //   fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
  //   fontFamily: Fonts.semiBold,
  //   color: Colors.primaryText,
  // },
  // headingText: {
  //   fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
  //   fontFamily: Fonts.semiBold,
  //   color: Colors.primaryText,
  // },
  // secondaryText: {
  //   fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
  //   color: Colors.darkGrey,
  // },
  // blockHeading: {
  //   fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
  //   fontFamily: Fonts.semiBold,
  //   color: Colors.primaryText,
  // },

  // font styles
  headingPrimaryText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.black,
  },
  headingMutedText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.darkGrey,
  },

  regularPrimaryText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.primaryText,
  },

  regularMutedText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.darkGrey,
  },
  mediumPrimaryText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.primaryText,
  },

  mediumMutedText: {
    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.darkGrey,
  },

  smallPrimaryText: {
    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.primaryText,
  },

  smallMutedText: {
    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.darkGrey,
  },

  xSmallPrimaryText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.primaryText,
  },

  xSmallMutedText: {
    fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.darkGrey,
  },

  rhaText: {
    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});
export default styles;
