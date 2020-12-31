import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../../components';
import { userType } from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import { GET_STUDENT_DETAILS } from '../../graphql-query';
import { GET_TUTOR_DETAILS } from '../../../tutor/tutor.query';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { UserTypeEnum } from '../../../../common/userType.enum';
import { DELETE_STUDENT_ADDRESS, DELETE_TUTOR_ADDRESS } from '../../graphql-mutation';

function AddressListing() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const [addresses, setAddresses] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getStudentDetails, { loading: studentDetailLoading }] = useLazyQuery(GET_STUDENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setAddresses(data?.getStudentDetails?.addresses);
      }
    },
  });

  const [getTutorDetails, { loading: tutorDetailLoading }] = useLazyQuery(GET_TUTOR_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setAddresses(data?.getTutorDetails?.addresses);
        setIsListEmpty(data?.getTutorDetails?.addresses.length === 0);
      }
    },
  });

  const [deleteTutorAddress, { loading: tutorAddressDeleteLoading }] = useMutation(DELETE_TUTOR_ADDRESS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getTutorDetails();
      }
    },
  });

  const [deleteStudentAddress, { loading: studentAddressDeleteLoading }] = useMutation(DELETE_STUDENT_ADDRESS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getStudentDetails();
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      if (isStudent) {
        getStudentDetails();
      } else {
        getTutorDetails();
      }
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    if (isStudent) {
      deleteStudentAddress({ variables: { addressDto: { id: item.id } } });
    } else {
      deleteTutorAddress({ variables: { addressDto: { id: item.id } } });
    }
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete the address!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditAddress = () => {
    navigation.navigate(routeNames.ADD_EDIT_ADDRESS);
  };

  const renderAddress = (item) => (
    <View>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper iconImage={Images.home} iconWidth={RfW(16)} iconHeight={RfH(16)} imageResizeMode="contain" styling={{marginTop:RfH(5)}} />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.regularPrimaryText}>{item.type}</Text>
          <Text style={commonStyles.mediumMutedText}>{`${item.street}, ${item.subArea}`}</Text>
          <Text style={commonStyles.mediumMutedText}>{item.city}</Text>
          <Text style={commonStyles.mediumMutedText}>{`${item.State}, ${item.country}`}</Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={handleAddEditAddress}>
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
      <Loader
        isLoading={
          tutorDetailLoading || studentDetailLoading || tutorAddressDeleteLoading || studentAddressDeleteLoading
        }
      />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Manage Address"
          horizontalPadding={RfW(16)}
          showRightIcon
          onRightIconClick={handleAddEditAddress}
          rightIcon={Images.moreInformation}
          lineVisible={false}
        />
        <View style={{ height: RfH(44) }} />
        {!isListEmpty ? (
          <View style={{ paddingHorizontal: RfW(16) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={addresses}
              renderItem={({ item, index }) => renderAddress(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: RfH(100), alignItems: 'center' }}>
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
              No Address found
            </Text>
            <Text
              style={[
                commonStyles.regularMutedText,
                { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
              ]}>
              Looks like you haven't provided your address.
            </Text>
            <Button
              onPress={handleAddEditAddress}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Create AddressListing</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default AddressListing;
