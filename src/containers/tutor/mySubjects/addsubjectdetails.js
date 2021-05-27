import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import styles from './styles';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import LabelComponent from './components/labelcomponent';
import StudentListing from '../studentList';
import { SEARCH_TUTOR_OFFERINGS } from './subject.query';

const AddSubjectDetails = (props) => {
  const { route } = props;
  const [item, setItem] = useState(route?.params?.offering);
  const tutorId = route?.params?.tutorId;
  const navigation = useNavigation();
  const isFocussed = useIsFocused();

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(SEARCH_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        const subjectsList = data?.searchTutorOfferings;
        subjectsList.forEach((element) => {
          if (element?.offering?.id === item?.offering?.id) {
            setItem(element);
          }
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getTutorOffering();
    }
  }, [isFocussed]);
  const optionsArray = [
    { id: 1, label: 'Online Class' },
    { id: 2, label: 'Offline Class' },
    { id: 3, label: 'Demo Class' },
    { id: 4, label: 'Why Me?' },
  ];
  const handleOnPress = (id) => {
    switch (id) {
      case 1: {
        navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX, { isOnline: true, offering: item });
        break;
      }
      case 2: {
        navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX, { isOnline: false, offering: item });
        break;
      }
      case 3: {
        navigation.navigate(NavigationRouteNames.TUTOR.DEMO_PRICE_MATRIX, { offering: item });
        break;
      }
      case 4: {
        navigation.navigate(NavigationRouteNames.TUTOR.WHY_ME, {
          offering: item,
        });
        break;
      }
      default:
        break;
    }
  };
  return (
    <>
      <Loader isLoading={loadingTutorsOffering} />
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
