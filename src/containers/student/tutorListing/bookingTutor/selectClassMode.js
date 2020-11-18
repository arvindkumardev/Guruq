import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, FlatList, Switch } from 'react-native';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { ScreenHeader, IconButtonWrapper, CustomRadioButton } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Images, Colors } from '../../../../theme';
import { RfH, RfW, titleCaseIfExists } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import Loader from '../../../../components/Loader';
import styles from '../styles';
import { ADD_TO_CART } from '../../booking.mutation';

const selectClassMode = (props) => {
  const navigation = useNavigation();

  const { route } = props;

  const tutorData = route?.params?.tutorData;

  const budgetDetails = route?.params?.budgetDetails;

  const parentOfferingName = route?.params?.parentOfferingName;
  const parentParentOfferingName = route?.params?.parentParentOfferingName;
  const selectedSubject = route?.params?.selectedSubject;

  const [numberOfClass, setNumberOfClass] = useState(1);
  const [amount, setAmount] = useState(100);
  const [classMode, setClassMode] = useState(false);
  const [onlineClassPrices, setOnlineClassPrices] = useState([]);
  const [offlineClassPrices, setOfflineClassPrices] = useState([]);

  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(routeNames.STUDENT.MY_CART);
      }
    },
  });

  useEffect(() => {
    const bdata = [];
    const odata = [];
    for (const b of budgetDetails) {
      if (!b.onlineClass) {
        odata.push({ classes: b.groupSize, pricePerHour: b.price, totalPrice: b.price * b.groupSize });
        setClassMode(false);
      } else {
        bdata.push({ classes: b.groupSize, pricePerHour: b.price, totalPrice: b.price * b.groupSize });
        setClassMode(true);
      }
    }
    setOnlineClassPrices(bdata);
    setOfflineClassPrices(odata);
  }, [budgetDetails]);

  const addClass = () => {
    const cls = numberOfClass + 1;
    setNumberOfClass(numberOfClass + 1);
    if (cls < 5) {
      setAmount(100 * cls);
    } else if (cls > 4 && cls < 10) {
      setAmount(100 * cls);
    } else if (cls > 9 && cls < 20) {
      setAmount(100 * cls);
    } else if (cls > 19) {
      setAmount(100 * cls);
    } else {
      setAmount(0);
    }
  };

  const removeClass = () => {
    if (numberOfClass > 1) {
      setNumberOfClass(numberOfClass - 1);
      const cls = numberOfClass - 1;
      if (cls < 5) {
        setAmount(100 * cls);
      } else if (cls > 4 && cls < 10) {
        setAmount(90 * cls);
      } else if (cls > 9 && cls < 20) {
        setAmount(80 * cls);
      } else if (cls > 19) {
        setAmount(70 * cls);
      } else {
        setAmount(0);
      }
    }
  };

  const onClassItemClick = (item) => {
    setAmount(item.totalPrice);
    setNumberOfClass(item.classes);
  };

  const renderClasses = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => onClassItemClick(item)}>
        <View
          style={[
            commonStyles.borderBottom,
            {
              marginTop: RfH(24),
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingBottom: RfH(8),
            },
          ]}>
          <View style={{}}>
            <Text style={commonStyles.secondaryText}>{item.classes}</Text>
          </View>
          <View>
            <Text style={commonStyles.secondaryText}>{item.pricePerHour}</Text>
          </View>
          <View>
            <Text style={commonStyles.secondaryText}>{item.totalPrice}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const getTutorImage = (tutor) => {
    return tutor && tutor.profileImage && tutor.profileImage.filename
      ? `https://guruq.in/api/${tutor?.profileImage?.filename}`
      : `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
          tutor.id % 4
        }.png`;
  };

  const changeClassMode = (value) => {
    if (onlineClassPrices.length > 0 && offlineClassPrices.length > 0) {
      setClassMode(value);
      const bdata = [];
      const odata = [];
      for (const b of budgetDetails) {
        if (!b.onlineClass) {
          odata.push({ classes: b.groupSize, pricePerHour: b.price, totalPrice: b.price * b.groupSize });
        } else {
          bdata.push({ classes: b.groupSize, pricePerHour: b.price, totalPrice: b.price * b.groupSize });
        }
      }
      setOnlineClassPrices(bdata);
      setOfflineClassPrices(odata);
    }
  };

  const onAddingIntoCart = () => {
    const cartCreate = {
      tutorOfferingId: selectedSubject.offeringId,
      count: numberOfClass,
      groupSize: 1,
      demo: false,
      onlineClass: classMode,
      price: amount,
    };
    addToCart({
      variables: { cartCreateDto: cartCreate },
    });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScreenHeader label="Book Class" homeIcon />
      <Loader isLoading={cartLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: RfH(44) }} />
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper
            iconWidth={RfW(87)}
            iconHeight={RfH(80)}
            iconImage={getTutorImage(tutorData)}
            imageResizeMode="cover"
            styling={{ borderRadius: 8 }}
          />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={[styles.compareTutorName, { alignSelf: 'flex-start', marginTop: 0 }]}>
              {tutorData.contactDetail.firstName} {tutorData.contactDetail.lastName}
            </Text>
            <Text style={styles.tutorDetails}>
              {selectedSubject.name} ( {parentOfferingName} | {parentParentOfferingName} )
            </Text>

            {tutorData.educationDetails.length > 0 && (
              <Text style={styles.tutorDetails}>
                {titleCaseIfExists(tutorData.educationDetails[0].degree?.degreeLevel)}
                {' - '}
                {titleCaseIfExists(tutorData.educationDetails[0].fieldOfStudy)}
              </Text>
            )}
            <Text style={styles.tutorDetails}>{tutorData.teachingExperience} years of Teaching Experience </Text>
          </View>
        </View>
        <Text style={[styles.compareTutorName, { alignSelf: 'flex-start' }]}>
          Select mode of class and number of Classes
        </Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12), alignItems: 'flex-start' }]}>
          <Text style={styles.tutorDetails}>Mode of Class</Text>
          <View style={commonStyles.horizontalChildrenCenterView}>
            {onlineClassPrices.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <CustomRadioButton enabled={classMode} submitFunction={() => changeClassMode(!classMode)} />
                <Text
                  style={[
                    styles.appliedFilterText,
                    {
                      marginLeft: RfH(8),
                    },
                  ]}>
                  Online
                </Text>
              </View>
            )}
            {offlineClassPrices.length > 0 && (
              <View style={{ flexDirection: 'row', marginLeft: RfW(16) }}>
                <CustomRadioButton enabled={!classMode} submitFunction={() => changeClassMode(!classMode)} />
                <Text
                  style={[
                    styles.appliedFilterText,
                    {
                      marginLeft: RfH(8),
                    },
                  ]}>
                  Offline
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{ marginTop: RfH(16), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <Text>Classes</Text>
          <Text>Price/Hour</Text>
          <Text>Total Price</Text>
        </View>
        <View style={commonStyles.borderBottom}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={classMode ? onlineClassPrices : offlineClassPrices}
            renderItem={({ item, index }) => renderClasses(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(40) }]}>
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Total Classes</Text>
          <View style={styles.bookingSelectorParent}>
            <TouchableWithoutFeedback onPress={() => removeClass()}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass()}
              />
            </TouchableWithoutFeedback>
            <Text>{numberOfClass}</Text>
            <IconButtonWrapper
              iconWidth={RfW(12)}
              iconHeight={RfH(12)}
              iconImage={Images.plus_blue}
              submitFunction={() => addClass()}
            />
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Amount Payable</Text>
          <Text>₹{amount}</Text>
        </View>
        <View style={{ alignSelf: 'center', marginTop: RfH(32), marginBottom: RfH(32) }}>
          <Button onPress={() => onAddingIntoCart()} style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default selectClassMode;
