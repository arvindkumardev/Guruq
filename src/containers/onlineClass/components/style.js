import { Dimensions, StyleSheet } from 'react-native';
import { RfH, RfW } from '../../../utils/helpers';
import Colors from '../../../theme/colors';
import Fonts from '../../../theme/fonts';

export const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    // height: RfH(80),
    marginTop: RfH(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: RfW(54),
    paddingVertical: RfH(10),
    backgroundColor: Colors.brandBlue2,
    borderRadius: RfH(8),
    marginHorizontal: RfW(8),
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.semiBold,
    fontSize: 17,
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
  },
  remoteContainer: {
    width: '100%',
    height: 120,
    position: 'absolute',
    bottom: 100,
    zIndex: 2,
  },
  remote: {
    width: 100,
    height: 120,
    marginHorizontal: 8,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});
