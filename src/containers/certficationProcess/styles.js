import {StyleSheet} from 'react-native';
import {RfH, RfW} from '../../utils/helpers';

const styles = StyleSheet.create({
  stepCard: {
    height: RfH(80),
    borderWidth: RfW(0.3),
    flexDirection: 'row',
    borderLeftWidth: RfW(8),
    marginTop: RfH(20),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    alignItems: 'center',
  },
  interviewCard: {
    height: RfH(80),
    borderWidth: RfW(0.3),
    borderLeftWidth: RfW(8),
    marginTop: RfH(20),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    justifyContent: 'center',
  },
});
export default styles;
