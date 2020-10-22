import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';

const styles = StyleSheet.create({
  helloView: {
    flexDirection:'row', 
    justifyContent:'flex-start', 
    alignItems:'center', 
    marginTop:RfH(58), 
    marginLeft:RfW(16)
  },
  userName: {
    color:Colors.darktitle, 
    fontSize:28, 
    marginLeft:RfW(51)
  },
  subHeading: {
    textAlign:"center", 
    marginTop:RfH(58), 
    fontSize:20, 
    color:'#313030'
  },
  iconView: {
    height:RfH(146), 
    width:RfW(146), 
    borderColor:Colors.primaryButtonBackground, 
    borderRadius:RfH(73), 
    borderWidth:1, 
    marginTop:RfH(34), 
    alignSelf:'center'
  },
});
export default styles;
