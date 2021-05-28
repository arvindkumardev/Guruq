import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme';
import { RfH } from '../../../../utils/helpers';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  subheadingText: {
    fontSize: 16,
    color: Colors.black,
  },
  boxHeadingContainer: {
    backgroundColor: Colors.lightBlue,
    height: RfH(44),
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 1,
  },
  boxHeadingText: {
    fontSize: 16,
    color: Colors.black,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  classLabel: {
    flex: 0.5,
    height: RfH(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 1,
  },
  classInputFieldContainer: {
    flex: 0.5,
    height: RfH(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 1,
  },
  classInputField: {
    textAlign: 'center',
  },
  noOfStudentContainer: {
    backgroundColor: Colors.subjectBlue,
    height: RfH(55),
    width: RfH(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey,
    borderWidth: 0.5,
  },
  noOfStudentLabel: {
    fontSize: 14,
    color: Colors.black,
    paddingHorizontal: 18,
    paddingVertical: 36,
  },
  discountContainer: {
    backgroundColor: Colors.lightGrey2,
    height: RfH(55),
    width: RfH(80),

    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey,
    borderWidth: 0.5,
  },
  discountLabel: {
    fontSize: 14,
    color: Colors.black,
    paddingHorizontal: 18,
    paddingVertical: 36,
  },
  flatListFooterView: {
    flex: 0.5,
    height: RfH(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey2,
    borderWidth: 1,
  },
  groupClassMainContainer: {
    marginTop: 36,
    paddingHorizontal: 16,
  },
  groupLabelMainContainer: {
    backgroundColor: Colors.white,
    height: RfH(55),
    flex: 0.44,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightGrey,
    borderWidth: 0.5,
  },
  groupLabelText: {
    fontSize: 14,
    color: Colors.black,
    paddingHorizontal: 18,
    paddingVertical: 36,
  },
  labelFlatListContainers: {
    flex: 0.72,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: RfH(20),
  },
});

export default styles;
