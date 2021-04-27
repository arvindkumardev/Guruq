import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RfH, RfW } from '../../utils/helpers';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

const style = StyleSheet.create({
  mainView: {
    marginHorizontal: RfW(16),
    marginVertical: RfW(16),
    backgroundColor: Colors.white,
    width: '90%',
    borderRadius: 8,
    height: RfH(100),
    padding: RfH(8),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  childView: {
    flex: 1,
  },

  questionView: {
    marginHorizontal: RfW(16),
    marginVertical: RfH(16),
    backgroundColor: Colors.white,
    width: '90%',
    borderRadius: 8,
    padding: RfH(8),
    flexDirection: 'column',
  },
  headingtext: {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
  },
  questionHeadingText: {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: Colors.secondaryText,
    position: 'absolute',
    left: 0,
    padding: RfH(16),
  },
  questionContainer: {
    marginTop: RfH(55),
    paddingHorizontal: RfH(8),
  },
  questionText: {
    fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
    color: Colors.black,
    flexShrink: 1,
  },
  questionStyle: {
    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
    color: Colors.black,
    flexWrap: 'wrap',
  },
  timetext: {
    fontSize: RFValue(40, STANDARD_SCREEN_SIZE),
    color: Colors.black,
  },
  optionView: {
    marginTop: RfH(16),
    flexDirection: 'row',
  },
  optionText: {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    color: Colors.lightBlack,
    flexShrink: 1,
  },
  checkboxView: {
    marginRight: RfH(16),
    alignSelf: 'center',
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',

    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    position: 'relative',

    backgroundColor: Colors.brandBlue2,
    color: Colors.white,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: RfW(16),
    paddingVertical: RfH(8),
    left: 8,
  },
  buttonRight: {
    position: 'relative',
    backgroundColor: Colors.brandBlue2,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.white,
    paddingHorizontal: RfW(16),
    paddingVertical: RfH(8),
    right: 8,
  },
});

export default style;
