import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Switch, Input, Button } from 'native-base';
import { isEmpty } from 'lodash';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, Loader } from '../../../../components';
import { alertBox, RfW, RfH } from '../../../../utils/helpers';
import { Colors } from '../../../../theme';
import styles from './styles';
import CustomCheckBox from '../../../../components/CustomCheckBox';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../tutor.mutation';
import commonStyles from '../../../../theme/styles';

const PM = {
  online: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
  offline: { 1: 0, 6: 0, 11: 0, 26: 0, 51: 0 },
};
const DemoPriceMatrix = (props) => {
  const { route } = props;
  const offering = route?.params.offering;
  const [isDemoClass, setIsDemoClass] = useState(offering.demoClass);
  const [isOnlineDemo, setOnlineDemo] = useState(false);
  const [isOfflineDemo, setOfflineDemo] = useState(false);
  const [isOnlineFree, setOnlineFree] = useState(false);
  const [isOnlinePaid, setOnlinePaid] = useState(false);
  const [isOfflineFree, setOfflineFree] = useState(false);
  const [isOfflinePaid, setOfflinePaid] = useState(false);
  const [demoClassPm, setDemoClassPM] = useState({ online: 0, offline: 0 });
  const [priceMatrix, setPriceMatrix] = useState(PM);
  const navigation = useNavigation();

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
      console.log('Bugdet array is ', offering.budgets);
      offering.budgets.forEach((budget) => {
        if (budget.demo) {
          demoPrice[budget.onlineClass ? 'online' : 'offline'] = budget.price;
          eligibleDemo[budget.onlineClass ? 'online' : 'offline'] = true;
          if (budget.price === 0) {
            if (budget.onlineClass) {
              setOnlineFree(true);
            } else {
              setOfflineFree(true);
            }
          } else if (budget.onlineClass) {
            setOnlinePaid(true);
          } else {
            setOfflinePaid(true);
          }
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
      setOnlineDemo(eligibleDemo.online);
      setOfflineDemo(eligibleDemo.offline);
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
            // check for offline and show the relevant popup
            navigation.goBack();
            // if (priceMatrix.offline['1'] > 0) {
            //   // show message
            //   // setOfflineClassEnabled(true);
            // } else {
            //   // navigation.goBack();
            // }
          },
        });
      }
    },
  });
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
      if (isDemoClass) {
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
  const handleOfflineSwitch = () => {
    setOfflineDemo((isOfflineDemo) => !isOfflineDemo);
    setOfflineFree(false);
    setOfflinePaid(false);
  };
  const handleOnlineSwitch = () => {
    setOnlineDemo((isOnlineDemo) => !isOnlineDemo);
    setOnlineFree(false);
    setOnlinePaid(false);
  };
  const handleIsDemoSwitch = () => {
    setIsDemoClass((isDemoClass) => !isDemoClass);
    setOnlinePaid(false);
    setOnlineFree(false);
    setOfflinePaid(false);
    setOfflineFree(false);
    setOfflineDemo(false);
    setOnlineDemo(false);
  };
  return (
    <View style={styles.mainContainer}>
      <ScreenHeader label="Demo Class Price" homeIcon horizontalPadding={RfW(16)} />
      <Loader isLoading={offeringLoading} />
      <View style={styles.labelContainer}>
        <Text style={styles.isDemoClassText}>Is Demo Class Available</Text>
        <Switch value={isDemoClass} onValueChange={() => handleIsDemoSwitch()} />
      </View>
      {isDemoClass ? (
        <View>
          <View style={styles.labelContainer}>
            <Text style={styles.isDemoClassText}>Online Demo</Text>
            <Switch value={isOnlineDemo} onValueChange={() => handleOnlineSwitch()} />
          </View>
          {isOnlineDemo ? (
            <View style={styles.checkboxContainer}>
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
                style={styles.pressableStyle}
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
            <View style={styles.boxMainContainer}>
              <View style={styles.boxHeadingContainer}>
                <Text style={styles.boxHeadingText}>Online Demo Price</Text>
              </View>
              <View style={styles.boxInputContainer}>
                <Input
                  value={demoClassPm.online.toString()}
                  onChangeText={(value) =>
                    setDemoClassPM((demoClassPm) => ({
                      ...demoClassPm,
                      online: value ? parseInt(value, 10) : 0,
                    }))
                  }
                  style={styles.boxInputStyle}
                  placeholder="Price"
                  placeholderTextColor={Colors.darkGrey}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          ) : null}
          <View style={styles.labelContainer}>
            <Text style={styles.isDemoClassText}>Offline Demo</Text>
            <Switch value={isOfflineDemo} onValueChange={() => handleOfflineSwitch()} />
          </View>
        </View>
      ) : null}
      {isOfflineDemo ? (
        <View style={styles.checkboxContainer}>
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
            style={styles.pressableStyle}
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
        <View style={styles.boxMainContainer}>
          <View style={styles.boxHeadingContainer}>
            <Text style={styles.boxHeadingText}>Offline Demo Price</Text>
          </View>
          <View style={styles.boxInputContainer}>
            <Input
              value={demoClassPm.offline.toString()}
              onChangeText={(value) =>
                setDemoClassPM((demoClassPm) => ({
                  ...demoClassPm,
                  offline: value ? parseInt(value, 10) : 0,
                }))
              }
              style={styles.boxInputStyle}
              placeholder="Price"
              placeholderTextColor={Colors.darkGrey}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>
      ) : null}
      <View style={styles.buttonContainer}>
        <Button
          onPress={onUpdateDemoOffering}
          style={[commonStyles.buttonPrimary, { width: RfW(150), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default DemoPriceMatrix;
