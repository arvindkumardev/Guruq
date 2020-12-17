import { Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item } from 'native-base';
import { RfH, RfW } from '../../../../../utils/helpers';
import commonStyles from '../../../../../theme/styles';
import { Colors } from '../../../../../theme';

function PriceMatrixView() {
  const [martixValues, setMartixValues] = useState([
    { count: '1', online: '', home: '' },
    { count: '5', online: '', home: '' },
    { count: '10', online: '', home: '' },
    { count: '25', online: '', home: '' },
    { count: '50', online: '', home: '' },
  ]);

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
        <Button style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

export default PriceMatrixView;
