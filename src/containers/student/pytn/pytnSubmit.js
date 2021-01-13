import { KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
import { Colors, Images } from '../../../theme';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../../components';
import { CREATE_STUDENT_PYTN } from './pytn.mutation';
import routeNames from '../../../routes/screenNames';
import Loader from '../../../components/Loader';

function PytnSubmit(props) {
  const { route } = props;

  const subjectData = route?.params?.subjectData;
  const navigation = useNavigation();
  const [noOfClasses, setNoOfClasses] = useState(1);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isIndividual, setIsIndividual] = useState(true);
  const [noOfGroupClasses, setNoOfGroupClasses] = useState(2);

  const [createPYTN, { loading: pytnLoading }] = useMutation(CREATE_STUDENT_PYTN, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        navigation.navigate(routeNames.PYTN_LISTING);
      }
    },
  });

  const submitPYTN = () => {
    if (maxPrice === 0) {
      alertBox('Please provide minimum and maximum price');
      // } else if (parseFloat(maxPrice) < parseFloat(minPrice)) {
      //   alertBox('Maximum price should be greater than or equal to minimum price');
    } else {
      const offeringArray = [];
      if (!isEmpty(subjectData?.subject)) {
        subjectData?.subject?.map((obj) => {
          offeringArray.push({ id: obj?.id });
        });
      } else {
        offeringArray.push({ id: subjectData?.class?.id });
      }

      createPYTN({
        variables: {
          studentPYTNDto: {
            offerings: offeringArray,
            count: noOfClasses,
            groupSize: noOfGroupClasses,
            onlineClass: isOnline,
            minPrice: parseFloat(maxPrice),
            maxPrice: parseFloat(maxPrice),
          },
        },
      });
    }
  };

  const addNoOfClass = () => {
    setNoOfClasses((noOfClasses) => noOfClasses + 1);
  };

  const removeNoOfClass = () => {
    if (noOfClasses > 1) {
      setNoOfClasses((noOfClasses) => noOfClasses - 1);
    }
  };

  const addNoOfGroupClass = () => {
    setNoOfGroupClasses(noOfGroupClasses + 1);
  };

  const removeNoOfGroupClass = () => {
    if (noOfGroupClasses > 2) {
      setNoOfGroupClasses(noOfGroupClasses - 1);
    }
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={pytnLoading} />
      <ScreenHeader homeIcon label="Post Your Tuition Need" horizontalPadding={RfW(16)} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'position' })} enabled>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: RfH(16), paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(34) }} />
          <Text style={commonStyles.headingPrimaryText}>Subject Details</Text>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <View>
            <Text style={[commonStyles.headingMutedText]}>
              {subjectData?.studyArea?.displayName}
              {' | '}
              {subjectData?.board?.displayName}
              {' | '}
              {subjectData?.class?.displayName}
            </Text>
            {!isEmpty(subjectData.subject) &&
              subjectData?.subject?.map((obj) => {
                return <Text style={[commonStyles.headingMutedText, { marginTop: RfW(8) }]}>{obj.displayName}</Text>;
              })}
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
          <Text style={commonStyles.headingPrimaryText}>Mode of Class</Text>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <View>
            <TouchableWithoutFeedback onPress={() => setIsOnline(true)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton
                  iconWidth={RfW(20)}
                  iconHeight={RfH(20)}
                  enabled={isOnline}
                  submitFunction={() => setIsOnline(true)}
                />
                <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Online</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setIsOnline(false)}>
              <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(16) }]}>
                <CustomRadioButton
                  iconWidth={RfW(20)}
                  iconHeight={RfH(20)}
                  enabled={!isOnline}
                  submitFunction={() => setIsOnline(false)}
                />
                <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Offline</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
          <Text style={commonStyles.headingPrimaryText}>Type of Tuition</Text>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <View>
            <TouchableWithoutFeedback onPress={() => setIsIndividual(true)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton
                  iconWidth={RfW(20)}
                  iconHeight={RfH(20)}
                  enabled={isIndividual}
                  submitFunction={() => setIsIndividual(true)}
                />
                <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Individual Class</Text>
              </View>
            </TouchableWithoutFeedback>
            {/*<View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>*/}
            {/*  <TouchableWithoutFeedback onPress={() => setIsIndividual(false)}>*/}
            {/*    <View style={commonStyles.horizontalChildrenView}>*/}
            {/*      <CustomRadioButton*/}
            {/*        iconWidth={RfW(20)}*/}
            {/*        iconHeight={RfH(20)}*/}
            {/*        enabled={!isIndividual}*/}
            {/*        submitFunction={() => setIsIndividual(false)}*/}
            {/*      />*/}
            {/*      <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Group Class</Text>*/}
            {/*    </View>*/}
            {/*  </TouchableWithoutFeedback>*/}
            {/*  {!isIndividual && (*/}
            {/*    <View>*/}
            {/*      <View style={styles.bookingSelectorParent}>*/}
            {/*        <View style={styles.bookingSelectorParent}>*/}
            {/*          <TouchableWithoutFeedback onPress={() => removeNoOfGroupClass()}>*/}
            {/*            <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>*/}
            {/*              <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />*/}
            {/*            </View>*/}
            {/*          </TouchableWithoutFeedback>*/}

            {/*          <Text>{noOfGroupClasses}</Text>*/}

            {/*          <TouchableWithoutFeedback onPress={() => addNoOfGroupClass()}>*/}
            {/*            <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>*/}
            {/*              <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />*/}
            {/*            </View>*/}
            {/*          </TouchableWithoutFeedback>*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*    </View>*/}
            {/*  )}*/}
            {/*</View>*/}
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
          <Text style={commonStyles.headingPrimaryText}>No of Classes Required</Text>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          <View>
            <View style={styles.bookingSelectorParent}>
              <View style={styles.bookingSelectorParent}>
                <TouchableWithoutFeedback onPress={removeNoOfClass}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                  </View>
                </TouchableWithoutFeedback>
                <Text>{noOfClasses}</Text>
                <TouchableWithoutFeedback onPress={addNoOfClass}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
          <Text style={commonStyles.headingPrimaryText}>Maximum price/ hour you are willing to pay </Text>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(10) }]} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            {/* <Item floatingLabel style={{ flex: 0.48 }}> */}
            {/*  <Input */}
            {/*    placeholder="Min Price" */}
            {/*    value={minPrice} */}
            {/*    onChangeText={(text) => setMinPrice(text)} */}
            {/*    keyboardType="numeric" */}
            {/*  /> */}
            {/* </Item> */}
            <Item floatingLabel style={{ flex: 0.48, marginLeft: RfW(8) }}>
              <Input
                placeholder="Max Price per hour"
                value={maxPrice}
                onChangeText={(text) => setMaxPrice(text)}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </Item>
          </View>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        onPress={submitPYTN}
        block
        style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </Button>
    </View>
  );
}

export default PytnSubmit;
