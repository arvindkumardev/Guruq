import { StyleSheet } from 'react-native';
import { RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  sectionHeaderLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: RfH(9),
    paddingBottom: RfH(14),
    paddingHorizontal: RfW(15),
  },
  headerText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
    color: Colors.black,
    textAlign: 'center',
    marginRight: RfW(17)
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
    marginLeft: RfW(10)
  },
  itemText: {
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.black,
  }

});
export default styles;
