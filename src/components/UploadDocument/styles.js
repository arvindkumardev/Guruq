import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
// import Fonts from '../../theme/Fonts';


export const styles = StyleSheet.create({
    mainModal: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end'
    },
    bottomContainer: {
        paddingBottom: RfH(34),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: RfH(28),
    },
    label: {
        // fontFamily: Fonts.regular,
        fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
        textAlign: 'center',
        color: Colors.darkGrey,
        fontWeight: 'normal',
        fontStyle: 'normal',
        paddingVertical: RfH(7)
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.black,
        paddingTop: Platform.OS === 'ios' ? RfH(0) : RfH(10),
        justifyContent: 'space-between'
    },
    registrationContainer: {
        marginHorizontal: RfW(36),
        backgroundColor: '#c3a061',
        borderRadius: RfH(50),
        paddingVertical: RfH(17),
        // marginTop: RfH(30),
        // justifyContent: 'flex-end',
        alignItems: 'center',
    },
    registrationText: {
        // fontFamily: Fonts.regular,
        fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: Colors.white,
    },
    imageView: {
        height: RfW(460),
        borderColor: '#717171',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: RfW(15),
        // borderWidth: RfW(1),
        marginBottom: RfH(30)
    },
    thumbView: {
        width: RfW(75),
        height: RfW(75),
        borderColor: '#717171',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RfW(15),
        borderWidth: RfW(1),
        marginRight: RfW(16),
        // padding: RfW(2)
    }
});
