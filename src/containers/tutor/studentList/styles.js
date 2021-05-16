import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import Fonts from '../../../theme/fonts';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: RfW(16),
    paddingVertical: RfH(16),
  },
  childContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: RfW(16),
  },
  bottomBarView: {
    width: '90%',
    height: 0.5,
    alignSelf: 'center',
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
  },
  nameTextStyle: {
    fontSize: RFValue(22, STANDARD_SCREEN_SIZE),
    color: Colors.black,
  },
  idTextStyle: {
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: Colors.lightBlack,
  },
  subscreenheadingView: {
    flex: 1,
    flexDirection: 'row',
    padding: RFValue(16, STANDARD_SCREEN_SIZE),
    marginBottom:RfH(16),
  },
  subscreenheadingView_Two: {
    flex: 0.1,

    flexDirection: 'row',
    padding: RFValue(16, STANDARD_SCREEN_SIZE),
  },
  subscreenheadingText: {
    fontSize: RFValue(22, STANDARD_SCREEN_SIZE),
    color: Colors.black,
    fontFamily: Fonts.bold,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  subscreenviewAll: {
    flex: 1,
  },
  textviewAll: {
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    right: 0,
    position: 'absolute',
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});
