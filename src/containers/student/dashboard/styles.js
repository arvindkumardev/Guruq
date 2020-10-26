import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';

const styles = StyleSheet.create({
  bottomText: {
    fontSize: 10,
    marginTop: RfH(4),
    color: Colors.inputLabel,
  },
  bottomTabActive: {
    fontSize: 10,
    marginTop: RfH(4),
    color: Colors.primaryButtonBackground,
  },
  myProfileText:{
    marginTop: RfH(48), 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  userDetailsView:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
     alignItems: 'stretch',
      marginTop: RfH(24)
  },
  userIcon:{
    height: RfH(82), 
    width: RfW(82), 
    borderRadius: 8 

  }
});
export default styles;
