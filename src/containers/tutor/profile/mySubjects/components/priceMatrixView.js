/* eslint-disable radix */
import { Text, View, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { RfH, RfW } from '../../../../../utils/helpers';
import commonStyles from '../../../../../theme/styles';
import { Colors } from '../../../../../theme';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../../tutor.mutation';
import { tutorDetails } from '../../../../../apollo/cache';

function PriceMatrixView(props) {
  const [martixValues, setMartixValues] = useState([
    { count: '1', online: '', home: '' },
    { count: '5', online: '', home: '' },
    { count: '10', online: '', home: '' },
    { count: '25', online: '', home: '' },
    { count: '50', online: '', home: '' },
  ]);
  const tutorInfo = useReactiveVar(tutorDetails);
  const { selectedOffering, showLoader } = props;

  const onOnlineChange = (value, index) => {
    const arrOnline = [];
    martixValues.map((obj) => {
      arrOnline.push(obj);
    });
    arrOnline[index].online = value;
    setMartixValues(arrOnline);
  };

  const onHomeChange = (value, index) => {
    const arrHome = [];
    martixValues.map((obj) => {
      arrHome.push(obj);
    });
    arrHome[index].home = value;
    setMartixValues(arrHome);
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
        Alert.alert('Updated!');
      }
    },
  });

  const onUpdatingOffering = () => {
    showLoader(offeringLoading);
    const budgetArray = [];
    martixValues.map((obj) => {
      if (obj.online) {
        budgetArray.push({
          price: parseFloat(obj.online),
          count: parseInt(obj.count),
          groupSize: 1,
          demo: true,
          onlineClass: true,
        });
      }
      if (obj.home) {
        budgetArray.push({
          price: parseFloat(obj.home),
          count: parseInt(obj.count),
          groupSize: 1,
          demo: true,
          onlineClass: false,
        });
      }
    });
    updateOffering({
      variables: {
        tutorOfferingDto: {
          id: selectedOffering.id,
          offering: { id: selectedOffering?.offering?.id },
          budgets: budgetArray,
        },
      },
    });
  };

  const renderItem = (item, index) => {
    return (
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(8) }]}>
        <View
          style={{
            flex: 0.32,
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{item.count}</Text>
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
              value={item.online}
              onChangeText={(text) => onOnlineChange(text, index)}
              style={{ textAlign: 'center' }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
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
              value={item.home}
              onChangeText={(text) => onHomeChange(text, index)}
              style={{ textAlign: 'center' }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
            />
          </Item>
        </View>
      </View>
    );
  };

  return (
    <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1 }]}>
      <View style={{ height: RfH(32) }} />
      <View style={commonStyles.horizontalChildrenEqualSpaceView}>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Classes</Text>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Online Classes</Text>
        </View>
        <View
          style={{
            flex: 0.32,
            backgroundColor: Colors.lightBlue,
            height: RfH(64),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Home Tutions</Text>
        </View>
      </View>
      <View>
        <FlatList
          data={martixValues}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          bottom: RfH(32),
          left: 0,
          right: 0,
          position: 'absolute',
        }}>
        <Button
          onPress={() => onUpdatingOffering()}
          style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

export default PriceMatrixView;
