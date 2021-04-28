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
  questionText: {
    fontSize: RFValue(24, STANDARD_SCREEN_SIZE),
    color: Colors.black,
    flexShrink: 1,
  },
});

export default style;
