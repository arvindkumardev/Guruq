import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '700',
    marginHorizontal: RfW(16),
    marginBottom: RfH(20),
  },
  subtitle: {
    fontSize: 16,
    marginHorizontal: RfW(16),
    color: Colors.white,
    marginBottom: RfH(56),
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#313031',
    fontSize: 24,
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
export default styles;
