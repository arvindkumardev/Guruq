import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { RfH, RfW } from '../../../../utils/helpers';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  isDemoClassText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.black,
  },
  isDemoCheckBoxText: {
    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingLeft: RfW(8),
  },
  labelContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'flex-start',
  },
  boxMainContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: RfH(16),
    justifyContent: 'center',
  },
  boxHeadingContainer: {
    backgroundColor: Colors.lightBlue,
    height: RfH(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 0.5,
  },
  boxHeadingText: {
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  boxInputContainer: {
    backgroundColor: Colors.white,
    height: RfH(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 0.5,
  },
  boxInputStyle: {
    textAlign: 'center',
    width: RfW(150),
    fontSize: 14,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: RfH(20),
  },
  pressableStyle: {
    flexDirection: 'row',
    paddingLeft: 64,
  },
});
export default styles;
