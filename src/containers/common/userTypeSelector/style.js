import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  helloView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: RfH(58),
    marginLeft: RfW(16),
  },
  helloText: {
    marginLeft: RfW(8),
    fontSize: 16,
    color: Colors.inputLabel,
  },
  userName: {
    color: Colors.darktitle,
    fontSize: 28,
    marginLeft: RfW(51),
  },
  subHeading: {
    textAlign: 'center',
    marginTop: RfH(58),
    fontSize: 20,
    color: '#313030',
  },
  areaParentView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RfH(32),
  },
  areaView: {
    flex: 0.5,
    height: RfH(162),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaTitleOne: {
    marginTop: RfH(12),
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  areaTitleTwo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  classView: {
    height: RfH(100),
    width: RfW(100),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 35,
    fontWeight: '600',
    textAlign: 'center',
  },
});
export default styles;
