import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { RfH, RfW} from '../../utils/helpers';

const styles = StyleSheet.create({
    title:{
        fontSize:28, 
        color: Colors.white, 
        fontWeight:'700',
        marginHorizontal:RfW(16), 
        marginBottom:RfH(20)
    },
    subtitle:{
        fontSize:16, 
        marginHorizontal:RfW(16),
        color: Colors.white,
        marginBottom:RfH(56)
    }
});
export default styles;


