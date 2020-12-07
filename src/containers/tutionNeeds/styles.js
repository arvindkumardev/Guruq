import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  itemStyle: {
    padding: RfH(12),
    marginHorizontal: RfW(4),
    marginVertical: RfH(4),
    borderRadius: RfH(8),
  },
  bookingSelectorParent: {
    borderRadius: 8,
    width: RfW(72),
    height: RfH(32),
    borderWidth: 1,
    borderColor: Colors.brandBlue2,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default styles;
