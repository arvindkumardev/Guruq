import { StyleSheet } from 'react-native';
import { deviceWidth, RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
  mainModalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: RfH(25),
    width: deviceWidth() - RfW(20),
    alignSelf: 'center',
  },

  modalSeparator: {
    height: RfH(0.6),
    opacity: 0.5,
    backgroundColor: 'rgba(17, 17, 17, 0.5)',
  },
  modalTopLabel: {
    paddingVertical: RfH(15),
    fontSize: RfW(13),
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#8f8f8f',
  },
  modalInnerContainer: {
    borderRadius: RfW(14),
    backgroundColor: '#E3E3E3',
  },
  modalDismissContainer: {
    borderRadius: RfW(14),
    marginTop: RfH(8),
    backgroundColor: '#fff',
  },
  modalActionLabel: {
    fontSize: RfW(20),
    textAlign: 'center',
    color: Colors.darkGrey,
    fontWeight: 'normal',
    fontStyle: 'normal',
    paddingVertical: RfH(16),
  },
  modalLabelDismiss: {
    fontSize: RfW(20),
    textAlign: 'center',
    color: Colors.darkGrey,
    fontStyle: 'normal',
    paddingVertical: RfH(16),
    fontWeight: '600',
  },
});

export default styles;
