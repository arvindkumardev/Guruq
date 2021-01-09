import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import {alertBox, getFullName, RfH, RfW} from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_PARENT_DETAILS } from './parentDetail.query';
import { DELETE_PARENT_INFO } from './parentDetail.mutation';

function ParentListing() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [parentsList, setParentsList] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getParentList, { loading: parentListLoading }] = useLazyQuery(GET_PARENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setParentsList(data?.getStudentDetails?.guardians);
        setIsListEmpty(data?.getStudentDetails?.guardians.length === 0);
      }
    },
  });

  const [deleteParentsDetail, { loading: parentDetailDeleteLoading }] = useMutation(DELETE_PARENT_INFO, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Your parents/guardians details has been deleted successfully`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => getParentList(),
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getParentList();
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    deleteParentsDetail({ variables: { id: item.id } });
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete parents/guardians detail!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditParents = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.ADD_EDIT_PARENTS, { detail: item || {} });
  };

  const renderParentDetails = (item) => (
    <View style={{ marginTop: RfH(20) }}>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconImage={Images.parent_details}
          iconWidth={RfW(16)}
          iconHeight={RfH(16)}
          imageResizeMode="contain"
          styling={{ marginTop: RfH(5) }}
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.regularPrimaryText}>
            {getFullName(item?.contactDetail)}
          </Text>
          {item.contactDetail.phoneNumber && (
            <Text style={commonStyles.mediumMutedText}>
              +{item?.contactDetail?.phoneNumber.countryCode}-{item?.contactDetail?.phoneNumber.number}
            </Text>
          )}
          <Text style={commonStyles.mediumMutedText}>{item?.contactDetail?.email}</Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={() => handleAddEditParents(item)}>
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
      <Loader isLoading={parentListLoading || parentDetailDeleteLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Parents/Guardians Details"
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.add}
          onRightIconClick={handleAddEditParents}
        />
        <View style={{ height: RfH(10) }} />
        {!isListEmpty ? (
          <View style={{ paddingHorizontal: RfW(16) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={parentsList}
              renderItem={({ item, index }) => renderParentDetails(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={parentsList.length > 3}
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
              Looks like you haven't provided your Parents/Guardians details.
            </Text>
            <Button
              onPress={() => handleAddEditParents()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Parents/Guardians</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default ParentListing;
