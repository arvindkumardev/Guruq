import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import Badge from '@react-navigation/bottom-tabs/src/views/Badge';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import { userType } from '../../apollo/cache';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { alertBox, RfH, RfW } from '../../utils/helpers';
import routeNames from '../../routes/screenNames';
import { GET_STUDENT_DETAILS } from '../common/graphql-query';
import { GET_TUTOR_DETAILS } from '../tutor/tutor.query';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { UserTypeEnum } from '../../common/userType.enum';
import { DELETE_STUDENT_ADDRESS, DELETE_TUTOR_ADDRESS } from '../common/graphql-mutation';

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
        setIsListEmpty(data?.getStudentDetails?.addresses.length === 0);
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

  const handleAddEditAddress = (address) => {
    navigation.navigate(routeNames.ADD_EDIT_ADDRESS, { address });
  };

  const renderAddress = (item) => (
    <View>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper
          iconImage={Images.home}
          iconWidth={RfW(16)}
          iconHeight={RfH(16)}
          imageResizeMode="contain"
          styling={{ marginTop: RfH(5) }}
        />
        <View style={commonStyles.verticallyStretchedItemsView}>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <View style={{ alignSelf: 'flex-start' }}>
              <Text
                style={[
                  commonStyles.smallPrimaryText,
                  {
                    backgroundColor: Colors.lightPurple,
                    paddingHorizontal: 4,
                    fontFamily: Fonts.semiBold,
                  },
                ]}>
                {item.type}
              </Text>
            </View>

            <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(5) }]}>
              {item.city}, {item.state}, {item.country}
            </Text>
            {/* <Text style={commonStyles.mediumMutedText}>{`${item.street}, ${item.subArea}`}</Text> */}
            <Text style={commonStyles.mediumMutedText}>{item.fullAddress}</Text>
            {/* <Text style={commonStyles.mediumMutedText}>{`${item.State}, ${item.country}`}</Text> */}
          </View>

          <View style={[commonStyles.horizontalChildrenView, { margin: RfH(8) }]}>
            <TouchableWithoutFeedback onPress={() => handleAddEditAddress(item)}>
              <Text style={{ color: Colors.orangeRed }}>EDIT</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleDeleteConfirmation(item)}>
              <Text style={{ color: Colors.orangeRed, marginLeft: RfW(16) }}>DELETE</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      <View style={[commonStyles.lineSeparator, { marginBottom: RfH(16) }]} />
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
          rightIcon={Images.add}
        />
        <View style={{ height: RfH(24) }} />
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
              onPress={() => handleAddEditAddress()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Address</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default AddressListing;
