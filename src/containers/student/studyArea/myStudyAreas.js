import { FlatList, Text, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import { interestingOfferingData } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';

const MyStudyAreas = (props) => {
  const navigation = useNavigation();

  const interestedOfferings = useReactiveVar(interestingOfferingData);

  // FIXME:
  // const [removeStudyArea, {loading}] = useMutation(REMOVE_INTERESTED_OFFERINGS)

  const renderItem = (item, index, showSeparator) => (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: Colors.borderColor,
          borderBottomWidth: 0.5,
          paddingVertical: RfH(20),
        }}>
        <IconButtonWrapper
          iconWidth={RfW(36)}
          iconHeight={RfH(36)}
          styling={{ alignSelf: 'flex-start' }}
          iconImage={getSubjectIcons(item?.offering?.displayName)}
        />
        <View style={{ marginLeft: RfW(16) }}>
          <Text style={commonStyles.headingPrimaryText}>{item?.offering?.displayName}</Text>
          <Text style={{ color: Colors.primaryText }}>
            {item?.offering?.rootOffering?.displayName} | {item?.offering?.parentOffering?.displayName}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Loader isLoading={false} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="My Study Areas"
          horizontalPadding={RfW(16)}
          showRightIcon
          onRightIconClick={() => navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA)}
          rightIcon={Images.add}
        />
        <View style={{ height: RfH(24) }} />

        <FlatList
          data={interestedOfferings}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index, interestedOfferings.length - 1 > index)}
          keyExtractor={(item, index) => index.toString()}
          style={{}}
        />
      </View>
    </>
  );
};

export default MyStudyAreas;
