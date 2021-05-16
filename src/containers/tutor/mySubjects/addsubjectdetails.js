import React from 'react';
import { View, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import styles from './styles';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import LabelComponent from './components/labelcomponent';
import StudentListing from '../studentList';

const AddSubjectDetails = (props) => {
  const { route } = props;
  const item = route?.params?.offering;
  const navigation = useNavigation();

  const optionsArray = [
    { id: 1, label: 'Online Class' },
    { id: 2, label: 'Offline Class' },
    { id: 3, label: 'Demo Class' },
    { id: 4, label: 'Why Me?' },
  ];
  const handleOnPress = (id) => {
    switch (id) {
      case 1: {
        navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX,{isOnline:true});
        break;
      }
      case 2: {
        navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX,{isOnline:false});
        break;
      }
      case 3: {
        navigation.navigate(NavigationRouteNames.TUTOR.DEMO_PRICE_MATRIX);
        break;
      }
      case 4: {
        navigation.navigate(NavigationRouteNames.TUTOR.WHY_ME, {
          offering: item,
        });
        break;
      }
    }
  };
  return (
    <>
      <Loader />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader label="Add Details" homeIcon horizontalPadding={RfW(16)} />
        <View style={styles.adddetailmainview}>
          <View style={{ flexDirection: 'row' }}>
            <IconButtonWrapper iconImage={getSubjectIcons(item.offering.displayName)} />
            <View style={{ marginLeft: RfW(16) }}>
              <Text style={commonStyles.regularPrimaryText} numberOfLines={2}>
                {`${item?.offering?.rootOffering?.displayName} | ${item?.offering?.parentOffering?.parentOffering?.displayName}`}
              </Text>
              <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(5) }]}>
                {`${item?.offering?.parentOffering?.displayName} | ${item?.offering?.displayName}`}
              </Text>
            </View>
          </View>
          {optionsArray.map((element) => {
            return <LabelComponent id={element.id} label={element.label} onPress={handleOnPress} />;
          })}
        </View>
        <StudentListing isSubScreen />
      </View>
    </>
  );
};

export default AddSubjectDetails;
