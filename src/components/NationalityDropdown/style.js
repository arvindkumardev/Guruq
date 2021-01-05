import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { RfH, RfW } from '../../utils/helpers';
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  sectionHeaderLabel: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    color: Colors.black,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: RfH(9),
    paddingBottom: RfH(14),
    paddingHorizontal: RfW(15),
    // // borderBottomWidth: 0.3,
    // borderBottomColor: Colors.secondaryText,
  },
  headerText: {
    flex: 1,
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontStyle: 'normal',
    color: Colors.black,
    textAlign: 'center',
    marginRight: RfW(17),
  },
  itemContainer: {
    marginHorizontal: RfW(16),
    paddingVertical: RfH(10),
    flex: 1,
    flexDirection: 'row',
    // borderBottomColor: Colors.lightGray,
    // borderBottomWidth: 0.3,
  },
  itemTextContainer: {
    flexDirection: 'row',
    paddingVertical: RfW(2),
    alignItems: 'center',
    marginLeft: RfW(10),
  },
  itemText: {
    fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
    fontFamily: 'SegoeUI-Semibold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.black,
  },
});
export default styles;
