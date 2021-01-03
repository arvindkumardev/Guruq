import { StyleSheet } from 'react-native';
import { RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
  stepCard: {
    paddingVertical: RfH(31),
    borderWidth: RfW(0.3),
    borderTopColor: Colors.darkGrey,
    borderRightColor: Colors.darkGrey,
    borderBottomColor: Colors.darkGrey,
    flexDirection: 'row',
    borderLeftWidth: RfW(10),
    marginTop: RfH(20),
    borderTopRightRadius: RfH(10),
    borderBottomRightRadius: RfH(10),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    alignItems: 'center',
  },
  interviewCard: {
    paddingVertical: RfH(31),
    borderWidth: RfW(0.3),
    borderColor: Colors.darkGrey,
    borderLeftWidth: RfW(10),
    marginTop: RfH(20),
    borderTopRightRadius: RfH(8),
    borderBottomRightRadius: RfH(8),
    marginHorizontal: RfW(16),
    paddingHorizontal: RfH(10),
    justifyContent: 'center',
  },
});
export default styles;
