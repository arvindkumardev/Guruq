import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { startCase } from 'lodash';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { alertBox, formatDate, RfH, RfW } from '../../../../utils/helpers';
import NavigationRouteNames from '../../../../routes/screenNames';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { GET_AWARD_LIST } from './award.query';
import { DELETE_AWARD_DETAIL } from './award.mutation';

function AwardListing() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [awardList, setAwardList] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getAwardList, { loading: awardListLoading }] = useLazyQuery(GET_AWARD_LIST, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setAwardList(data?.getTutorAwardsDetails?.awards);
        setIsListEmpty(data?.getTutorAwardsDetails?.awards.length === 0);
      }
    },
  });

  const [deleteAwardDetail, { loading: awardDeleteLoading }] = useMutation(DELETE_AWARD_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Your awards/achievement deleted successfully`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => getAwardList(),
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getAwardList();
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    deleteAwardDetail({ variables: { id: item.id } });
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete your awards/achievement!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditAward = (item) => {
    navigation.navigate(NavigationRouteNames.ADD_EDIT_AWARD_DETAILS, { detail: item || {} });
  };

  const renderAwards = (item) => (
    <View style={{ marginTop: RfH(20) }}>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconImage={Images.award}
          iconWidth={RfW(16)}
          iconHeight={RfH(16)}
          imageResizeMode="contain"
          styling={{ marginTop: RfH(5) }}
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.regularPrimaryText}>{item?.title}</Text>
          <Text style={commonStyles.mediumMutedText}>{item?.issuer}</Text>
          <Text style={commonStyles.mediumMutedText}>{item?.description}</Text>
          <Text style={commonStyles.mediumMutedText}>{formatDate(item.startDate, 'YYYY')}</Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={() => handleAddEditAward(item)}>
          <Text style={{ color: Colors.orange }}>Edit</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => handleDeleteConfirmation(item)}>
          <Text style={{ color: Colors.orange }}>Delete</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={commonStyles.lineSeparator} />
    </View>
  );
  return (
    <>
      <Loader isLoading={awardListLoading || awardDeleteLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Manage Awards & Achievements"
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.add}
          onRightIconClick={handleAddEditAward}
        />
        <View style={{ height: RfH(24) }} />
        {!isListEmpty ? (
          <View style={{ paddingHorizontal: RfW(16) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={awardList}
              renderItem={({ item, index }) => renderAwards(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={awardList.length > 3}
            />
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: RfH(70), alignItems: 'center' }}>
            <Image
              source={Images.empty_cart}
              style={{
                height: RfH(264),
                width: RfW(248),
                marginBottom: RfH(32),
              }}
              resizeMode="contain"
            />
            <Text
              style={[
                commonStyles.pageTitleThirdRow,
                { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
              ]}>
              No data found
            </Text>
            <Text
              style={[
                commonStyles.regularMutedText,
                { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
              ]}>
              Looks like you haven't provided your awards & achievements.
            </Text>
            <Button
              onPress={() => handleAddEditAward()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(200) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Awards & Achievements</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default AwardListing;
