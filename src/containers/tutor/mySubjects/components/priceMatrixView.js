/* eslint-disable radix */
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, CheckBox, Input, Item, Switch } from 'native-base';
import { useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../tutor.mutation';

const PM = {
  online: { 1: 0, 5: 0, 10: 0, 25: 0, 50: 0 },
  offline: { 1: 0, 5: 0, 10: 0, 25: 0, 50: 0 },
};

function PriceMatrixView(props) {
  const navigation = useNavigation();
  const { offering, showLoader } = props;
  const [priceMatrix, setPriceMatrix] = useState(PM);
  const [demoClassPm, setDemoClassPM] = useState({
    online: 0,
    offline: 0,
  });
  const [isDemoClass, setIsDemoClass] = useState(offering.demoClass);
  const [modeDemoClass, setModeDemoClass] = useState(offering.onlineClass);


  useEffect(() => {
    if (!isEmpty(offering.budgets)) {
      const pm = {
        online: { 1: 0, 5: 0, 10: 0, 25: 0, 50: 0 },
        offline: { 1: 0, 5: 0, 10: 0, 25: 0, 50: 0 },
      };
      const demoPrice = {
        online: 0,
        offline: 0,
      };
      offering.budgets.forEach((budget) => {
        if (budget.demo) {
          demoPrice[budget.onlineClass ? 'online' : 'offline'] = budget.price;
        } else {
          pm[budget.onlineClass ? 'online' : 'offline'][`${budget.count}`] = budget.price;
        }
      });

      let maxValue = 0;
      Object.entries(pm.online).forEach(([key, value]) => {
        if (value !== 0) {
          maxValue = value;
        } else {
          pm.online[key] = maxValue;
        }
      });

      maxValue = 0;
      Object.entries(pm.offline).forEach(([key, value]) => {
        if (value !== 0) {
          maxValue = value;
        } else {
          pm.offline[key] = maxValue;
        }
      });
      setPriceMatrix(pm);
      setDemoClassPM(demoPrice);
    }
  }, [offering]);

  const onOnlineChange = (value, index) => {
    setPriceMatrix((priceMatrix) => ({
      ...priceMatrix,
      online: { ...priceMatrix.online, [index]: value ? parseInt(value) : 0 },
    }));
  };

  const onOfflineChange = (value, index) => {
    setPriceMatrix((priceMatrix) => ({
      ...priceMatrix,
      offline: { ...priceMatrix.offline, [index]: value ? parseInt(value) : 0 },
    }));
  };

  const [updateOffering, { loading: offeringLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Price matrix updated successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

    showLoader(offeringLoading);
  const onUpdatingOffering = () => {
    showLoader(offeringLoading);
    const budgetArray = [];
    Object.entries(priceMatrix.online).forEach(([key, value]) => {
      budgetArray.push({
        price: value,
        count: parseInt(key),
        groupSize: 1,
        demo: false,
        onlineClass: true,
      });
    });

    Object.entries(priceMatrix.offline).forEach(([key, value]) => {
      budgetArray.push({
        price: value,
        count: parseInt(key),
        groupSize: 1,
        demo: false,
        onlineClass: false,
      });
    });
    if (isDemoClass) {
      if (modeDemoClass !== 0) {
        budgetArray.push({
          price: demoClassPm.online,
          count: 1,
          groupSize: 1,
          demo: true,
          onlineClass: true,
        });
      }

      if (modeDemoClass !== 1) {
        budgetArray.push({
          price: demoClassPm.offline,
          count: 1,
          groupSize: 1,
          demo: true,
          onlineClass: false,
        });
      }
    }

    updateOffering({
      variables: {
        tutorOfferingDto: {
          id: offering.id,
          offering: { id: offering?.offering?.id },
          budgets: budgetArray,
        },
      },
    });
  };

  const renderItem = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(8) }]}>
        <View
          style={{
            flex: 0.32,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{item}</Text>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightGrey,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: RfH(8),
          }}>
          <Item>
            <Input
              value={priceMatrix.online[`${item}`].toString()}
              onChangeText={(text) => onOnlineChange(text, `${item}`)}
              style={{ textAlign: 'center' }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </Item>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightGrey,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: RfH(8),
          }}>
          <Item>
            <Input
              value={priceMatrix.offline[`${item}`].toString()}
              onChangeText={(text) => onOfflineChange(text, `${item}`)}
              style={{ textAlign: 'center' }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </Item>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ height: RfH(20) }} />
      <View style={commonStyles.horizontalChildrenEqualSpaceView}>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={commonStyles.regularPrimaryText}> # Classes</Text>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={commonStyles.regularPrimaryText}>Online Classes</Text>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={commonStyles.regularPrimaryText}>Offline Classes</Text>
        </View>
      </View>
      <View>
        <FlatList
          data={[1, 5, 10, 25, 50]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>
      <View style={{ marginTop: RfH(40), justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={commonStyles.regularPrimaryText}> Is Demo Class Available</Text>
        <Switch value={isDemoClass} onValueChange={() => setIsDemoClass((isDemoClass) => !isDemoClass)} />
      </View>
      {isDemoClass && (
        <View style={{ marginTop: RfH(30) }}>
          <Text style={commonStyles.regularPrimaryText}> Mode of Demo Class</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: RfH(15) }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setModeDemoClass(1)}
              activeOpacity={0.8}>
              <CheckBox
                checked={modeDemoClass === 1}
                onPress={() => setModeDemoClass(1)}
                style={{ marginRight: RfW(20) }}
                color={Colors.brandBlue}
              />
              <Text style={commonStyles.mediumPrimaryText}> Online</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setModeDemoClass(0)}
              activeOpacity={0.8}>
              <CheckBox
                checked={modeDemoClass === 0}
                onPress={() => setModeDemoClass(0)}
                style={{ marginRight: RfW(20) }}
                color={Colors.brandBlue}
              />
              <Text style={commonStyles.mediumPrimaryText}> Offline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setModeDemoClass(2)}
              activeOpacity={0.8}>
              <CheckBox
                checked={modeDemoClass === 2}
                onPress={() => setModeDemoClass(2)}
                style={{ marginRight: RfW(20) }}
                color={Colors.brandBlue}
              />
              <Text style={commonStyles.mediumPrimaryText}> Both</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isDemoClass && (
        <View style={{ marginTop: RfH(30), marginBottom: RfH(10) }}>
          <Text style={commonStyles.regularPrimaryText}>Demo Class Price Matrix</Text>
          <View style={{ flexDirection: 'row', marginTop: RfH(15), justifyContent: 'space-around' }}>
            {modeDemoClass !== 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={commonStyles.mediumPrimaryText}>Online</Text>
                <View
                  style={{
                    width: RfW(100),
                    backgroundColor: Colors.lightGrey,
                    height: RfH(44),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RfH(8),
                    marginLeft: RfW(10),
                  }}>
                  <Input
                    value={demoClassPm.online.toString()}
                    onChangeText={(value) =>
                      setDemoClassPM((demoClassPm) => ({ ...demoClassPm, online: value ? parseInt(value) : 0 }))
                    }
                    style={{ textAlign: 'center' }}
                    placeholder="Price"
                    placeholderTextColor={Colors.darkGrey}
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>
              </View>
            )}
            {modeDemoClass !== 1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={commonStyles.mediumPrimaryText}>Offline</Text>
                <View
                  style={{
                    width: RfW(100),
                    backgroundColor: Colors.lightGrey,
                    height: RfH(44),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RfH(8),
                    marginLeft: RfW(10),
                  }}>
                  <Input
                    value={demoClassPm.offline.toString()}
                    onChangeText={(value) =>
                      setDemoClassPM((demoClassPm) => ({ ...demoClassPm, offline: value ? parseInt(value) : 0 }))
                    }
                    style={{ textAlign: 'center' }}
                    placeholder="Price"
                    placeholderTextColor={Colors.darkGrey}
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginVertical: RfH(20),
        }}>
        <Button
          onPress={onUpdatingOffering}
          style={[commonStyles.buttonPrimary, { width: RfW(160), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Update price matrix</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

export default PriceMatrixView;
