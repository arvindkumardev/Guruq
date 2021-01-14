import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { DELETE_BANK_DETAIL } from './bank.mutation';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_BANK_DETAILS_DATA } from './bank.query';

function BankDetails() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [bankDetailData, setBankDetailData] = useState({});
  const [isListEmpty, setIsListEmpty] = useState(false);

  const [getBankDetails, { loading: bankListLoading }] = useLazyQuery(GET_BANK_DETAILS_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setBankDetailData(data?.getTutorBankDetails?.bankDetails);
        setIsListEmpty(isEmpty(data?.getTutorBankDetails?.bankDetails));
      }
    },
  });

  const [deleteBankDetail, { loading: bankDeleteLoading }] = useMutation(DELETE_BANK_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Your bank details has been deleted successfully`, '', {
          positiveText: 'Yes',
          onPositiveClick: () => getBankDetails(),
        });
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getBankDetails();
    }
  }, [isFocussed]);

  const handleDelete = (item) => {
    deleteBankDetail({ variables: { id: item.id } });
  };

  const handleDeleteConfirmation = (item) => {
    alertBox(`Do you really want to delete your bank details!`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => handleDelete(item),
      negativeText: 'No',
    });
  };

  const handleAddEditBankDetail = (item) => {
    navigation.navigate(NavigationRouteNames.ADD_EDIT_BANK_DETAILS, { detail: item || {} });
  };

  const bankDetail = (item) => (
    <View>
      <View style={commonStyles.horizontalChildrenStartView}>
        <IconButtonWrapper iconImage={Images.bank} iconWidth={RfW(16)} iconHeight={RfH(20)} imageResizeMode="contain" />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.regularPrimaryText}>{item.accountNumber}</Text>
          <Text style={commonStyles.mediumMutedText}>{item.accountHolder}</Text>
          <Text style={commonStyles.mediumMutedText}>
            {item.bankName} - {item.ifscCode}{' '}
          </Text>
          <Text style={commonStyles.mediumMutedText}>{item.branchAddress}</Text>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
        <TouchableWithoutFeedback onPress={() => handleAddEditBankDetail(item)}>
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
      <Loader isLoading={bankListLoading || bankDeleteLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Manage Bank Details" horizontalPadding={RfW(16)} />
        <View style={{ height: RfH(24) }} />
        {!isListEmpty ? (
          <>
            {!isEmpty(bankDetailData) && (
              <View style={{ paddingHorizontal: RfW(16) }}>{bankDetail(bankDetailData)}</View>
            )}
          </>
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
              Looks like you haven't provided your bank details.
            </Text>
            <Button
              onPress={() => handleAddEditBankDetail()}
              style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
              <Text style={commonStyles.textButtonPrimary}>Add Bank Details</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default BankDetails;
