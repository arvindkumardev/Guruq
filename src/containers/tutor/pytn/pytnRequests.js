import { FlatList, Image, KeyboardAvoidingView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { useIsFocused } from '@react-navigation/native';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import { alertBox, getSubjectIcons, printDate, RfH, RfW } from '../../../utils/helpers';
import { SEARCH_TUTOR_PYTN_REQUESTS } from '../../student/pytn/pytn.query';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { offeringsMasterData } from '../../../apollo/cache';
import { ACCEPT_STUDENT_PYTN } from '../../student/pytn/pytn.mutation';
import PriceInputModal from './priceInputModal';

function PytnRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedPytn, setSelectedPytn] = useState({});
  const [priceVal, setPriceVal] = useState(0);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [isListEmpty, setIsListEmpty] = useState(false);
  const isFocussed = useIsFocused();
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const [getPytnRequests, { loading: pytnRequestLoading }] = useLazyQuery(SEARCH_TUTOR_PYTN_REQUESTS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setRequests(data.searchTutorPYTN.edges);
        setIsListEmpty(data?.searchTutorPYTN?.edges.length === 0);
      }
    },
  });

  const [acceptStudentPytn, { loading: acceptStudentPytnLoading }] = useMutation(ACCEPT_STUDENT_PYTN, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Request ${isEmpty(selectedPytn.acceptedPytns) ? 'accepted' : 'edited'} successfully`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            getPytnRequests({
              variables: { searchDto: { pending: true, size: 25, sortBy: 'createdDate', sortOrder: 'asc' } },
            });
          },
        });
      }
    },
  });

  const onSubmit = (request) => {
    // if (priceVal === 0) {
    //   alertBox('Please enter the amount');
    // } else if (priceVal < selectedPytn.minPrice || priceVal > selectedPytn.maxPrice) {
    //   alertBox('Please enter the correct amount');
    // } else
    if (isEmpty(request.acceptedPytns) && !isEmpty(request)) {
      setShowPriceModal(false);
      acceptStudentPytn({
        variables: {
          studentPYTNAcceptDto: {
            studentPytnId: request.id,
            price: request.maxPrice,
          },
        },
      });
    } else {
      setShowPriceModal(false);
      acceptStudentPytn({
        variables: {
          studentPYTNAcceptDto: {
            studentPytnId: request.id,
            price: request.maxPrice,
            id: request.acceptedPytns[0].id,
          },
        },
      });
    }
  };

  const handleAccept = (request) => {
    setSelectedPytn(request);
    setPriceVal(request.maxPrice);
    // if (isEmpty(request.acceptedPytns)) {
    //   setPriceVal(0);
    // } else {
    //   setPriceVal(request.acceptedPytns[0].price);
    // }
    // setShowPriceModal(true);
    alertBox(`Do you want to accept the request?`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => onSubmit(request),
      negativeText: 'No',
    });
  };

  useEffect(() => {
    if (isFocussed) {
      getPytnRequests({
        variables: { searchDto: { pending: true, size: 25, sortBy: 'createdDate', sortOrder: 'asc' } },
      });
    }
  }, [isFocussed]);

  const getRootOfferingName = (offering) =>
    offeringMasterData.find((item) => item.id === offering?.offering?.id)?.rootOffering?.displayName;

  const renderClassItem = (item) => (
    <>
      <View style={{ marginBottom: RfH(10) }}>
        <View style={{ height: RfH(30) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.headingPrimaryText}>{getRootOfferingName(item)}</Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item?.offering?.parentOffering?.parentOffering?.displayName}
              {' | '}
              {item?.offering?.parentOffering?.displayName}
            </Text>
          </View>
          <Text style={commonStyles.headingPrimaryText}>₹ {item.maxPrice}</Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(8) }]} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                imageResizeMode="cover"
                iconImage={getSubjectIcons(item?.offering?.displayName)}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                }}>
                {item?.offering?.displayName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.groupSize > 1 ? 'Group' : 'Individual'} Class
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.onlineClass ? 'Online Class' : 'Home Tuition'}
              </Text>
            </View>
          </View>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {item.count}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
      </View>
      <View style={commonStyles.lineSeparator} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: RfH(5),
          alignItems: 'center',
        }}>
        <View style={commonStyles.verticallyStretchedItemsView}>
          <Text>Created On {printDate(item.createdDate)}</Text>
        </View>

        {isEmpty(item.acceptedPytns) ? (
          <Button
            block
            style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
            onPress={() => handleAccept(item)}>
            <Text style={commonStyles.textButtonPrimary}>Accept Request</Text>
          </Button>
        ) : (
          <Text style={[commonStyles.headingPrimaryText, { color: Colors.brandBlue2, paddingVertical: RfH(10) }]}>
            Accepted
          </Text>
        )}
      </View>
      <View style={commonStyles.lineSeparator} />
    </>
  );

  return (
    <>
      <Loader isLoading={acceptStudentPytnLoading || pytnRequestLoading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ android: '', ios: 'padding' })}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? (isDisplayWithNotch() ? 44 : 20) : 0}
        enabled>
        <ScreenHeader label="Student Tuition Requests" homeIcon horizontalPadding={RfW(16)} />
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: RfW(16) }]}>
          {!isEmpty(requests) && (
            <FlatList
              data={requests}
              renderItem={({ item, index }) => renderClassItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(120) }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={requests.length > 3}
            />
          )}

          {isListEmpty && (
            <View style={{ flex: 1, paddingTop: RfH(100), alignItems: 'center' }}>
              <Image
                source={Images.nopytn}
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
                  { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center', marginHorizontal: RfW(20) },
                ]}>
                No Requests Yet
              </Text>
              <Text
                style={[
                  commonStyles.regularMutedText,
                  { marginHorizontal: RfW(40), textAlign: 'center', marginTop: RfH(16) },
                ]}>
                No student has sent you a tuition request yet. Ensure your profile is up to date to receive requests.
              </Text>
            </View>
          )}
        </View>
        <PriceInputModal
          visible={showPriceModal}
          onClose={() => setShowPriceModal(false)}
          onSubmit={onSubmit}
          onPriceChange={(val) => setPriceVal(val)}
          price={priceVal}
          selectedPytn={selectedPytn}
        />
      </KeyboardAvoidingView>
    </>
  );
}

export default PytnRequests;
