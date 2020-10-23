import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  bottomText: {
    fontSize:10,
    marginTop:RfH(4),
    color: Colors.inputLabel
  },
  bottomTabActive:{
    fontSize:10,
    marginTop:RfH(4),
    color: Colors.primaryButtonBackground
  }
});
export default styles;
