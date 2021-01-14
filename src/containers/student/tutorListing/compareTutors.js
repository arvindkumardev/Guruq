/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Colors, Images } from '../../../theme';
import { getFullName, getSaveData, getTutorImage, removeData, RfH, RfW, storeData } from '../../../utils/helpers';
import styles from './styles';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';
import { GET_FAVOURITE_TUTORS } from '../tutor-query';

function compareTutors(props) {
  const navigation = useNavigation();
  const [tutorData, setTutorData] = useState([]);
  const [isFirstFav, setIsFirstFav] = useState(false);
  const [isSecondFav, setIsSecondFav] = useState(false);
  const [tutorClicked, setTutorClicked] = useState(0);
  const { route } = props;
  const offeringId = route?.params?.offeringId;

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setIsFirstFav(data?.getFavouriteTutors.find((ft) => ft?.tutor?.id === tutorData[0]?.id));
        setIsSecondFav(data?.getFavouriteTutors.find((ft) => ft?.tutor?.id === tutorData[1]?.id));
      }
    },
  });

  useEffect(() => {
    if (tutorData) {
      getFavouriteTutors({
        variables: {
          parentOfferingId: offeringId,
        },
      });
    }
  }, [tutorData]);

  const removeFromCompare = async (index) => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    compareArray.splice(index, 1);
    await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
    if (compareArray.length > 0) {
      storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(compareArray)).then(() => {});
    }
    navigation.goBack();
  };

  const [markFavourite, { loading: favouriteLoading }] = useMutation(MARK_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        if (tutorClicked === 0) {
          setIsFirstFav(true);
        } else {
          setIsSecondFav(true);
        }
      }
    },
  });

  const [removeFavourite, { loading: removeFavouriteLoading }] = useMutation(REMOVE_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        if (tutorClicked === 0) {
          setIsFirstFav(false);
        } else {
          setIsSecondFav(false);
        }
      }
    },
  });

  const markFavouriteTutor = (tutorId, tutorClicked) => {
    if (tutorClicked === 0) {
      setTutorClicked(0);
      if (isFirstFav) {
        removeFavourite({
          variables: { tutorFavourite: { tutor: { id: tutorId } } },
        });
      } else {
        markFavourite({
          variables: { tutorFavourite: { tutor: { id: tutorId } } },
        });
      }
    } else {
      setTutorClicked(1);
      if (isSecondFav) {
        removeFavourite({
          variables: { tutorFavourite: { tutor: { id: tutorId } } },
        });
      } else {
        markFavourite({
          variables: { tutorFavourite: { tutor: { id: tutorId } } },
        });
      }
    }
  };

  const renderTutorView = (item, index) => {
    return (
      <View style={commonStyles.verticallyStretchedItemsView}>
        <IconButtonWrapper
          iconWidth={RfH(20)}
          iconHeight={RfH(20)}
          iconImage={Images.delete}
          imageResizeMode="contain"
          styling={styles.crossIcon}
          submitFunction={() => removeFromCompare(index)}
        />
        <IconButtonWrapper
          iconWidth={RfH(70)}
          iconHeight={RfH(70)}
          iconImage={getTutorImage(item)}
          imageResizeMode="contain"
          styling={{ alignSelf: 'center', borderRadius: RfH(12) }}
        />
        {/* FIXME */}
        <Text style={styles.compareTutorName}>{getFullName(item?.contactDetail)}</Text>
        <View style={[commonStyles.horizontalChildrenCenterView, { marginVertical: RfH(8) }]}>
          <IconButtonWrapper
            iconImage={item?.averageRating > 0 ? Images.filledStar : Images.unFilledStar}
            iconHeight={RfH(15)}
            iconWidth={RfW(15)}
            imageResizeMode="contain"
            styling={{ marginRight: RfW(4) }}
          />
          {item?.averageRating > 0 ? (
            <Text style={styles.chargeText}>{parseFloat(item?.averageRating).toFixed(1)}</Text>
          ) : (
            <Text
              style={{
                color: Colors.secondaryText,
                fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
              }}>
              NOT RATED
            </Text>
          )}
          {item?.reviewCount > 0 && (
            <Text
              style={{
                color: Colors.secondaryText,
                fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                marginLeft: RfW(8),
              }}>
              {item?.reviewCount} Reviews
            </Text>
          )}
        </View>

        <View style={[commonStyles.horizontalChildrenCenterView, { marginTop: RfH(8) }]}>
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfH(18)} iconImage={Images.user_board} />
          <IconButtonWrapper
            iconHeight={RfH(18)}
            iconWidth={RfH(18)}
            iconImage={
              index === 0 && isFirstFav
                ? Images.heartFilled
                : index === 1 && isSecondFav
                ? Images.heartFilled
                : Images.heart
            }
            imageResizeMode="contain"
            styling={{ marginHorizontal: RfW(16) }}
            submitFunction={() => markFavouriteTutor(item.id, index)}
          />
        </View>
        <Button block bordered style={{ marginHorizontal: RfW(16), marginTop: RfH(24) }}>
          <Text style={{ color: Colors.brandBlue2 }}>Book Class</Text>
        </Button>
      </View>
    );
  };
  //
  // const getTutorData=(offerings)=>{
  //     const data = {online:false,offline:false,demo:false,price:0}
  //     offerings.forEach(offering=>{
  //         offering.budgets.forEach()
  //
  //     })
  //
  // }

  const checkCompare = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    setTutorData(compareArray);
    console.log(compareArray);
  };

  useEffect(() => {
    checkCompare();
  }, []);

  const renderBasicInfoView = (item) => {
    return (
      <View style={styles.informationParentMargin}>
        <Text style={styles.switchText}>Basic Information</Text>
        <Text style={[styles.infoCategoryText, { marginTop: RfH(16) }]}>Price / Class</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.horizontalChildrenView}>
            <Text style={{ color: Colors.darkGrey, alignSelf: 'center' }}>
              ₹ {item[0].selectedSubject?.budgetDetails.find((b) => !b.demo && b.count === 1).price}/ hour
            </Text>
          </View>

          <View style={commonStyles.horizontalChildrenView}>
            <Text style={{ color: Colors.darkGrey, alignSelf: 'center' }}>
              ₹ {item[1].selectedSubject?.budgetDetails.find((b) => !b.demo && b.count === 1).price}/ hour
            </Text>
          </View>
        </View>
        {item[0]?.educationDetails &&
          item[0]?.educationDetails[0]?.degree &&
          item[1]?.educationDetails &&
          item[1]?.educationDetails[0]?.degree && (
            <View>
              <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
              <Text style={styles.infoCategoryText}>Qualification</Text>

              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={styles.qualificationItemText}>
                  {item[0]?.educationDetails &&
                    item[0]?.educationDetails[0]?.degree &&
                    item[0]?.educationDetails[0]?.degree?.name}
                </Text>
                <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>
                  {item[1]?.educationDetails &&
                    item[1]?.educationDetails[0]?.degree &&
                    item[1]?.educationDetails[0]?.degree?.name}
                </Text>
              </View>
            </View>
          )}
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Experience</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.qualificationItemText}>{item[0]?.teachingExperience} Years</Text>
          <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>
            {item[1]?.teachingExperience} Years
          </Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Mode of Tuition</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              {/* <IconButtonWrapper */}
              {/*  iconHeight={RfH(11)} */}
              {/*  iconWidth={RfW(18)} */}
              {/*  iconImage={Images.laptop} */}
              {/*  styling={{ alignSelf: 'center' }} */}
              {/*  imageResizeMode="contain" */}
              {/* /> */}

              <Text style={styles.typeItemText}>{item[0]?.selectedSubject?.onlineClass && 'Online'}</Text>
              <Text style={styles.typeItemText}>{item[0]?.selectedSubject?.offlineClass && 'Offline'}</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              {/* <IconButtonWrapper */}
              {/*  iconHeight={RfH(11)} */}
              {/*  iconWidth={RfW(18)} */}
              {/*  iconImage={Images.laptop} */}
              {/*  imageResizeMode="contain" */}
              {/*  styling={{ alignSelf: 'center' }} */}
              {/* /> */}
              <Text style={styles.typeItemText}>{item[1]?.selectedSubject?.onlineClass && 'Online'}</Text>
              <Text style={styles.typeItemText}>{item[1]?.selectedSubject?.offlineClass && 'Offline'}</Text>
            </View>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Type</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            {item[0].tutorOfferings[0].budgets[0].groupSize === 1 && (
              <View style={commonStyles.horizontalChildrenView}>
                <IconButtonWrapper
                  iconHeight={RfH(11)}
                  iconWidth={RfW(18)}
                  iconImage={Images.single_user}
                  imageResizeMode="contain"
                  styling={{ alignSelf: 'center' }}
                />
                <Text style={styles.typeItemText}>Individual</Text>
              </View>
            )}
            {item[0].tutorOfferings[0].budgets[0].groupSize > 1 && (
              <View style={commonStyles.horizontalChildrenView}>
                <IconButtonWrapper
                  iconHeight={RfH(13)}
                  iconWidth={RfW(18)}
                  iconImage={Images.multiple_user}
                  imageResizeMode="contain"
                  styling={{ alignSelf: 'center' }}
                />
                <Text style={styles.typeItemText}>Group</Text>
              </View>
            )}
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            {item[1].tutorOfferings[0].budgets[0].groupSize === 1 && (
              <View style={commonStyles.horizontalChildrenView}>
                <IconButtonWrapper
                  iconHeight={RfH(11)}
                  iconWidth={RfW(18)}
                  iconImage={Images.single_user}
                  imageResizeMode="contain"
                  styling={{ alignSelf: 'center' }}
                />
                <Text style={styles.typeItemText}>Individual</Text>
              </View>
            )}
            {item[1].tutorOfferings[0].budgets[0].groupSize > 1 && (
              <View style={commonStyles.horizontalChildrenView}>
                <IconButtonWrapper
                  iconHeight={RfH(13)}
                  iconWidth={RfW(18)}
                  iconImage={Images.multiple_user}
                  imageResizeMode="contain"
                  styling={{ alignSelf: 'center' }}
                />
                <Text style={styles.typeItemText}>Group</Text>
              </View>
            )}
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6), marginBottom: RfH(34) }]} />
      </View>
    );
  };
  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <ScreenHeader label="Compare Tutors" horizontalPadding={16} lineVisible homeIcon />
      {!isEmpty(tutorData) && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8), paddingHorizontal: RfW(16) }]}>
            <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[0], 0)}</View>
            <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[1], 1)}</View>
          </View>
          <View>{renderBasicInfoView(tutorData)}</View>
        </ScrollView>
      )}
    </View>
  );
}

export default compareTutors;
