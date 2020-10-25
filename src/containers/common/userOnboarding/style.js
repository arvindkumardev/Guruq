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
});
export default styles;
