import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Input, Button } from 'native-base';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { ScreenHeader, Loader } from '../../../components';
import { alertBox, RfW, RfH } from '../../../utils/helpers';
import { Colors } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../tutor.mutation';


const PM = {
  online: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
  offline: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
};

const ClassPriceMatrix = (props) => {
  const { route } = props;
  const isOnline = route?.params.isOnline;
  const offering = route?.params.offering;
  const navigation = useNavigation();
  const title = isOnline ? 'Online Class Price' : 'Offline Class Price';
  const [priceMatrix, setPriceMatrix] = useState(PM);
  const [demoClassPm, setDemoClassPM] = useState({ online: 0, offline: 0 });
  const [isDemoClass, setIsDemoClass] = useState(offering.demoClass);
  const [isOnlineDemo, setOnlineDemo] = useState(false);
  const [isOfflineDemo, setOfflineDemo] = useState(false);
  const [isOnlineFree, setOnlineFree] = useState(false);
  const [isOnlinePaid, setOnlinePaid] = useState(false);
  const [isOfflineFree, setOfflineFree] = useState(false);
  const [isOfflinePaid, setOfflinePaid] = useState(false);
  useEffect(() => {
    if (!isEmpty(offering.budgets)) {
      const pm = {
        online: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
        offline: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
      };
      const demoPrice = {
        online: 0,
        offline: 0,
      };
      const eligibleDemo = {
        online: false,
        offline: false,
      };
      offering.budgets.forEach((budget) => {
        if (budget.demo) {
          demoPrice[budget.onlineClass ? 'online' : 'offline'] = budget.price;
          eligibleDemo[budget.onlineClass ? 'online' : 'offline'] = true;
        } else {
          pm[budget.onlineClass ? 'online' : 'offline'][`${budget.count}`] = budget.price;
        }
      });
      let maxValueOnline = 0;
      Object.entries(pm.online).forEach(([key, value]) => {
        if (value !== 0) {
          maxValueOnline = value;
        }
        pm.online[key] = maxValueOnline;
      });

      let maxValueOffline = 0;
      Object.entries(pm.offline).forEach(([key, value]) => {
        if (value !== 0) {
          maxValueOffline = value;
        }
        pm.offline[key] = maxValueOffline;
      });
      setPriceMatrix(pm);
      setDemoClassPM(demoPrice);
      setOfflinePaid(eligibleDemo.offline);
      setOnlinePaid(eligibleDemo.online);
      setOnlineDemo(eligibleDemo.online);
      setOfflineDemo(eligibleDemo.offline);
      setOnlineFree(!eligibleDemo.online);
      setOfflineFree(!eligibleDemo.offline);
    }
  }, [offering]);

  const [updateOffering, { loading: offeringLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Price matrix updated successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            navigation.goBack();
            // check for offline and show the relevant popup
            if (priceMatrix.offline['1'] > 0) {
              // show message
              // setOfflineClassEnabled(true);
            } else {
              // navigation.goBack();
            }
          },
        });
      }
    },
  });
  const getItemValue = (item) => {
    if (isOnline) {
      return priceMatrix.online[`${item.value}`].toString();
    }
    return priceMatrix.offline[`${item.value}`].toString();
  };

  const onValueChange = (value, index) => {
    if (isOnline) {
      setPriceMatrix((priceMatrix) => ({
        ...priceMatrix,
        online: {
          ...priceMatrix.online,
          [index]: value ? parseInt(value) : 0,
        },
      }));
    } else {
      setPriceMatrix((priceMatrix) => ({
        ...priceMatrix,
        offline: { ...priceMatrix.offline, [index]: value ? parseInt(value) : 0 },
      }));
    }
  };
  const onUpdateDemoOffering = () => {
    const lowCostOnline = Object.entries(priceMatrix.online).find(([key, value]) => value > 0 && value < 25);
    const lowCostOffline = Object.entries(priceMatrix.offline).find(([key, value]) => value > 0 && value < 25);

    if (
      (Object.entries(priceMatrix.online).length > 0 && lowCostOnline) ||
      (Object.entries(priceMatrix.offline).length > 0 && lowCostOffline)
    ) {
      alertBox('Price should be greater than 25. ');
    } else {
      // showLoader(offeringLoading);
      const budgetArray = [];
      Object.entries(priceMatrix.online).forEach(([key, value]) => {
        budgetArray.push({
          price: value,
          count: parseInt(key, 10),
          groupSize: 1,
          demo: false,
          onlineClass: true,
        });
      });

      Object.entries(priceMatrix.offline).forEach(([key, value]) => {
        budgetArray.push({
          price: value,
          count: parseInt(key, 10),
          groupSize: 1,
          demo: false,
          onlineClass: false,
        });
      });
      if (isOnlineDemo) {
        if (isOnlinePaid) {
          budgetArray.push({
            price: demoClassPm.online,
            count: 1,
            groupSize: 1,
            demo: true,
            onlineClass: true,
          });
        }
        if (isOnlineFree) {
          budgetArray.push({
            price: 0,
            count: 1,
            groupSize: 1,
            demo: true,
            onlineClass: true,
          });
        }
        if (isOfflineDemo) {
          if (isOfflineFree) {
            budgetArray.push({
              price: 0,
              count: 1,
              groupSize: 1,
              demo: true,
              onlineClass: false,
            });
          }
          if (isOfflinePaid) {
            budgetArray.push({
              price: demoClassPm.offline,
              count: 1,
              groupSize: 1,
              demo: true,
              onlineClass: false,
            });
          }
        }
      }
      console.log('Value of budget array ', budgetArray);
      updateOffering({
        variables: {
          tutorOfferingDto: {
            id: offering.id,
            offering: { id: offering?.offering?.id },
            budgets: budgetArray,
          },
        },
      });
    }
  };

  const renderItem = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenEqualSpaceView]}>
        <View
          style={{
            flex: 0.5,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.lightGrey2,
            borderWidth: 1,
          }}>
          <Text>{item.label}</Text>
        </View>
        <View
          style={{
            flex: 0.5,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.lightGrey2,
            borderWidth: 1,
          }}>
          <Input
            value={getItemValue(item)}
            onChangeText={(text) => onValueChange(text, `${item.value}`)}
            style={{ textAlign: 'center' }}
            placeholder="Price"
            placeholderTextColor={Colors.darkGrey}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
      </View>
    );
  };

  const renderNoOfStudents = (item) => {
    return (
      <View
        style={{
          backgroundColor: Colors.subjectBlue,
          height: RfH(55),
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: Colors.lightGrey,
          borderWidth: 0.5,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: Colors.black,
            paddingHorizontal: 18,
            paddingVertical: 36,
          }}>
          {item.studentNumber}
        </Text>
      </View>
    );
  };

  const renderDiscount = (item) => {
    return (
      <View
        style={{
          backgroundColor: Colors.lightGrey2,
          height: RfH(55),
          flex: 0.24,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: Colors.lightGrey,
          borderWidth: 0.5,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: Colors.black,
            paddingHorizontal: 18,
            paddingVertical: 36,
          }}>
          {item.discount}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.white, height: '100%' }}>
      <ScreenHeader label={title} homeIcon horizontalPadding horizontalPadding={RfW(16)} />
      <Loader isLoading={offeringLoading} />
      <View style={{ marginTop: 36, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, color: Colors.black }}> Individual Class </Text>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16) }]}>
          <View
            style={{
              backgroundColor: Colors.lightBlue,
              height: RfH(44),
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey2,
              borderWidth: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                paddingHorizontal: 24,
                paddingVertical: 36,
              }}>
              Classes
            </Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.lightBlue,
              height: RfH(44),
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey2,
              borderWidth: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                paddingHorizontal: 24,
                paddingVertical: 36,
              }}>
              Price
            </Text>
          </View>
        </View>
        <FlatList
          data={[
            { value: 1, label: 'Upto 5' },
            { value: 6, label: '6-10' },
            { value: 11, label: '11-25' },
            { value: 26, label: '26-50' },
            { value: 51, label: '>50' },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          ListFooterComponent={() => (
            <View
              style={{
                flex: 0.5,
                height: RfH(1),
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Colors.lightGrey2,
                borderWidth: 1,
              }}
            />
          )}
        />
      </View>
      <View style={{ marginTop: 36, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, color: Colors.black }}>Group Class</Text>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { alignSelf: 'center', marginTop: RfH(16) }]}>
          <View
            style={{
              backgroundColor: Colors.subjectBlue,
              height: RfH(55),
              flex: 0.33,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey,
              borderWidth: 0.5,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                paddingHorizontal: 18,
                paddingVertical: 36,
              }}>
              No. Of Students
            </Text>
          </View>
          <View style={{ flex: 0.72 }}>
            <FlatList
              data={[{ studentNumber: '2-5' }, { studentNumber: ' 6-10' }, { studentNumber: '11-25' }]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderNoOfStudents(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              horizontal
            />
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView]}>
          <View
            style={{
              backgroundColor: Colors.white,
              height: RfH(55),
              flex: 0.33,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey,
              borderWidth: 0.5,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                paddingHorizontal: 18,
                paddingVertical: 36,
              }}>
              Discount %
            </Text>
          </View>
          <View style={{ flex: 0.72 }}>
            <FlatList
              data={[{ discount: '10%' }, { discount: '15%' }, { discount: '20%' }]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderDiscount(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              horizontal
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginVertical: RfH(20),
        }}>
        <Button
          onPress={onUpdateDemoOffering}
          style={[commonStyles.buttonPrimary, { width: RfW(150), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default ClassPriceMatrix;
