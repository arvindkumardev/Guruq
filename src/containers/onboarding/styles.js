import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  skip: {
    fontSize: 18,
    color: Colors.white,
    marginTop: RfH(49),
    marginRight: RfW(19),
    alignSelf: 'flex-end',
  },
  swipeChild: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImage: {
    width: RfW(178),
    height: RfH(383),
    marginTop: RfH(18),
  },
  title: {
    fontSize: 28,
    marginTop: RfH(38),
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: RfW(42),
    marginTop: RfH(28),
    color: Colors.white,
  },
});
export default styles;
