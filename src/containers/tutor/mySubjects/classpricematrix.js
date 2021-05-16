import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Input, Item } from 'native-base';
import { ScreenHeader } from '../../../components';
import { RfW, RfH } from '../../../utils/helpers';
import { Colors } from '../../../theme';
import commonStyles from '../../../theme/styles';
import styles from './styles';

const ClassPriceMatrix = (props) => {
  const { route } = props;
  const isOnline = route?.params.isOnline;
  const title = isOnline ? 'Online Class Price' : 'Offline Class Price';

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
            borderWidth: 0.5,
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
            borderWidth: 0.5,
          }}>
          <Item>
            {/* <Input
              value={priceMatrix.offline[`${item.value}`].toString()}
              onChangeText={(text) => onOfflineChange(text, `${item.value}`)}
              style={{ textAlign: 'center' }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
              keyboardType="numeric"
              returnKeyType="done"
            /> */}
          </Item>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.white, height: '100%' }}>
      <ScreenHeader label={title} homeIcon horizontalPadding horizontalPadding={RfW(16)} />
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
              borderWidth: 0.5,
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
              borderWidth: 0.5,
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
        />
      </View>
      <View style={{ marginTop: 36, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, color: Colors.black }}>Group Class</Text>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16) }]}>
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

          <View
            style={{
              backgroundColor: Colors.subjectBlue,
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
              2-5
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.subjectBlue,
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
              6-10
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.subjectBlue,
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
              11-25
            </Text>
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

          <View
            style={{
              backgroundColor: Colors.lightGrey,
              height: RfH(55),
              flex: 0.24,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey,
              borderWidth: 0.5,
            }}></View>
          <View
            style={{
              backgroundColor: Colors.lightGrey,
              height: RfH(55),
              flex: 0.24,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey,
              borderWidth: 0.5,
            }}></View>
          <View
            style={{
              backgroundColor: Colors.lightGrey,
              height: RfH(55),
              flex: 0.24,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey,
              borderWidth: 0.5,
            }}></View>
        </View>
      </View>
    </View>
  );
};

export default ClassPriceMatrix;
