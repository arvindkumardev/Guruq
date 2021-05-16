import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Switch, Input } from 'native-base';
import { ScreenHeader } from '../../../components';
import { RfW, RfH } from '../../../utils/helpers';
import { Colors } from '../../../theme';
import styles from './styles';
import CustomCheckBox from '../../../components/CustomCheckBox';

const DemoPriceMatrix = () => {
  const [isDemoClass, setIsDemoClass] = useState(false);
  const [isOnlineDemo, setOnlineDemo] = useState(false);
  const [isOfflineDemo, setOfflineDemo] = useState(false);
  const [isOnlineFree, setOnlineFree] = useState(false);
  const [isOnlinePaid, setOnlinePaid] = useState(false);
  const [isOfflineFree, setOfflineFree] = useState(false);
  const [isOfflinePaid, setOfflinePaid] = useState(false);
  let value = 0;
  return (
    <View style={{ backgroundColor: Colors.white, height: '100%' }}>
      <ScreenHeader label="Demo Class Price" homeIcon horizontalPadding={RfW(16)} />
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginTop: 16,
        }}>
        <Text style={styles.isDemoClassText}>Is Demo Class Available</Text>
        <Switch value={isDemoClass} onValueChange={() => setIsDemoClass((isDemoClass) => !isDemoClass)} />
      </View>
      {isDemoClass ? (
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 16,
              marginTop: 16,
            }}>
            <Text style={styles.isDemoClassText}>Online Demo</Text>
            <Switch value={isOnlineDemo} onValueChange={() => setOnlineDemo((isOnlineDemo) => !isOnlineDemo)} />
          </View>
          {isOnlineDemo ? (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 16,
                justifyContent: 'flex-start',
              }}>
              <Pressable
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  setOnlineFree(!isOnlineFree);
                  setOnlinePaid(false);
                }}>
                <CustomCheckBox
                  enabled={isOnlineFree}
                  submitFunction={() => {
                    setOnlineFree(!isOnlineFree);
                    setOnlinePaid(false);
                  }}
                />
                <Text style={styles.isDemoCheckBoxText}>Free</Text>
              </Pressable>
              <Pressable
                style={{ flexDirection: 'row', paddingLeft: 64 }}
                onPress={() => {
                  setOnlinePaid(!isOnlinePaid);
                  setOnlineFree(false);
                }}>
                <CustomCheckBox
                  enabled={isOnlinePaid}
                  submitFunction={() => {
                    setOnlinePaid(!isOnlinePaid);
                    setOnlineFree(false);
                  }}
                />
                <Text style={styles.isDemoCheckBoxText}>Online</Text>
              </Pressable>
            </View>
          ) : null}
          {isOnlinePaid ? (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                marginTop: RfH(16),
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.lightBlue,
                  height: RfH(44),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: Colors.lightGrey2,
                  borderWidth: 0.5,
                }}>
                <Text style={{ paddingHorizontal: 24, paddingVertical: 36 }}>Online Demo Price</Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.white,
                  height: RfH(44),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: Colors.lightGrey2,
                  borderWidth: 0.5,
                }}>
                <Input
                  value={value}
                  style={{
                    textAlign: 'center',
                    width: RfW(150),
                    fontSize: 14,
                  }}
                  placeholder="Price"
                  placeholderTextColor={Colors.darkGrey}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          ) : null}
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 16,
              marginTop: 16,
            }}>
            <Text style={styles.isDemoClassText}>Offline Demo</Text>
            <Switch value={isOfflineDemo} onValueChange={() => setOfflineDemo((isOfflineDemo) => !isOfflineDemo)} />
          </View>
        </View>
      ) : null}
      {isOfflineDemo ? (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 16,
            justifyContent: 'flex-start',
          }}>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={() => {
              setOfflineFree(!isOfflineFree);
              setOfflinePaid(false);
            }}>
            <CustomCheckBox
              enabled={isOfflineFree}
              submitFunction={() => {
                 setOfflineFree(!isOfflineFree);
                 setOfflinePaid(false);
              }}
            />
            <Text style={styles.isDemoCheckBoxText}>Free</Text>
          </Pressable>
          <Pressable
            style={{ flexDirection: 'row', paddingLeft: 64 }}
            onPress={() => {
              setOfflinePaid(!isOfflinePaid);
              setOfflineFree(false);
            }}>
            <CustomCheckBox
              enabled={isOfflinePaid}
              submitFunction={() => {
                setOfflinePaid(!isOfflinePaid);
                setOfflineFree(false);
              }}
            />
            <Text style={styles.isDemoCheckBoxText}>Offline</Text>
          </Pressable>
        </View>
      ) : null}
      {isOfflinePaid ? (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginTop: RfH(16),
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.lightBlue,
              height: RfH(44),
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey2,
              borderWidth: 0.5,
            }}>
            <Text style={{ paddingHorizontal: 24, paddingVertical: 36 }}>Offline Demo Price</Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              height: RfH(44),
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.lightGrey2,
              borderWidth: 0.5,
            }}>
            <Input
              value={value}
              style={{
                textAlign: 'center',
                width: RfW(150),
                fontSize: 14,
              }}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default DemoPriceMatrix;
