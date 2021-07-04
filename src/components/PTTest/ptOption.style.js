import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RfH, RfW } from '../../utils/helpers';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

const styles = StyleSheet.create({
  childView: {
    flex: 1,
  },

  questionView: {
    marginHorizontal: RfW(16),
    marginVertical: RfH(16),
    backgroundColor: Colors.white,
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: RfW(16),
    paddingBottom: RfH(32),
    flexDirection: 'column',
  },

  questionHeadingText: {
    fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
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
    marginLeft: RfH(16),
    flexShrink: 1,
    justifyContent: 'center',
  },
  checkboxView: {
    marginRight: RfH(16),
    alignSelf: 'center',
    color: '#005CC8',
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
    left: 16,
  },
  buttonRight: {
    position: 'relative',
    backgroundColor: Colors.brandBlue2,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.white,
    paddingHorizontal: RfW(16),
    paddingVertical: RfH(8),
    right: 16,
  },
});

export default styles;
