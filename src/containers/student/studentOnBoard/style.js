import { StyleSheet } from 'react-native';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  stepCard: {
    height: RfH(80),
    // paddingVertical: RfH(16),
    borderWidth: RfW(0.3),
    // borderTopColor: Colors.darkGrey,
    // borderRightColor: Colors.darkGrey,
    // borderBottomColor: Colors.darkGrey,
    flexDirection: 'row',
    borderLeftWidth: RfW(8),
    marginTop: RfH(20),
    // borderTopRightRadius: RfH(10),
    // borderBottomRightRadius: RfH(10),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    alignItems: 'center',
  },
  interviewCard: {
    height: RfH(80),
    // paddingVertical: RfH(31),
    borderWidth: RfW(0.3),
    // borderColor: Colors.darkGrey,
    // borderLeftWidth: RfW(8),
    marginTop: RfH(20),
    // borderTopRightRadius: RfH(8),
    // borderBottomRightRadius: RfH(8),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    justifyContent: 'center',
  },
});
export default styles;
