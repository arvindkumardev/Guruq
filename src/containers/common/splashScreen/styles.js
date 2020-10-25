import { StyleSheet } from 'react-native';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  splashImage: {
    height: RfH(233),
    width: RfW(233),
    marginTop: RfH(179),
    marginHorizontal: RfW(71),
    alignSelf: 'center',
  },
  msgOne: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: RfH(-40),
  },
  msgTwo: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'center',
  },
  bottomMsg: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
    bottom: RfH(48),
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
export default styles;
