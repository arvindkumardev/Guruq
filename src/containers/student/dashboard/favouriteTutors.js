import { Image, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Images, Colors, Fonts } from '../../../theme';
import { getUserImageUrl, RfH, RfW, titleCaseIfExists } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import styles from '../tutorListing/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { GET_FAVOURITE_TUTORS } from '../tutor-query';
import { REMOVE_FAVOURITE } from '../tutor-mutation';
import Loader from '../../../components/Loader';

function FavouriteTutors() {
  const [favouriteTutors, setFavouriteTutors] = useState([]);
  const [refreshTutorList, setRefreshTutorList] = useState(false);

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;

        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        setFavouriteTutors(data?.getFavouriteTutors);
        setRefreshTutorList(!refreshTutorList);
      }
    },
  });

  useEffect(() => {
    getFavouriteTutors();
  }, []);

  const [removeFavourite, { loading: removeFavouriteLoading }] = useMutation(REMOVE_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getFavouriteTutors();
        setRefreshTutorList(!refreshTutorList);
      }
    },
  });

  const removeFavouriteTutor = (tutorId) => {
    removeFavourite({
      variables: { tutorFavourite: { tutor: { id: tutorId } } },
    });
  };

  const renderItem = (item) => (
    <View style={styles.listItemParent}>
      <TouchableWithoutFeedback>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <IconButtonWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={getTutorImage(item?.tutor)}
              imageResizeMode="cover"
              styling={styles.userIcon}
            />
            {item?.id % 7 === 0 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  zIndex: 100,
                  borderRadius: RfW(20),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: RfW(8),
                }}>
                <View
                  style={{
                    backgroundColor: Colors.orange,
                    borderRadius: RfW(2),
                    paddingVertical: RfH(2),
                    paddingHorizontal: RfW(4),
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: Colors.white,
                      fontFamily: Fonts.bold,
                    }}>
                    Sponsored
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
                <Text style={styles.tutorName}>
                  {item?.tutor?.contactDetail?.firstName} {item?.tutor?.contactDetail?.lastName}
                </Text>
                {item?.tutor?.educationDetails?.length > 0 && (
                  <Text style={styles.tutorDetails} numberOfLines={1}>
                    {titleCaseIfExists(item?.tutor?.educationDetails[0]?.degree?.degreeLevel)}
                    {' - '}
                    {titleCaseIfExists(item?.tutor?.educationDetails[0]?.fieldOfStudy)}
                  </Text>
                )}
                <Text style={styles.tutorDetails}>{item?.tutor?.teachingExperience} Years of Experience</Text>
                <View style={[styles.iconsView, { marginTop: RfH(8) }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name={item?.tutor?.averageRating > 0 ? 'star' : 'star-o'}
                      style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
                    />
                    {item?.tutor?.averageRating > 0 ? (
                      <Text style={styles.chargeText}>{parseFloat(item?.tutor?.averageRating).toFixed(1)}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                        }}>
                        NOT RATED
                      </Text>
                    )}

                    {item?.tutor?.reviewCount > 0 && (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                          marginLeft: RfW(8),
                        }}>
                        {item?.tutor?.reviewCount} Reviews
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-start',
                }}>
                <TouchableWithoutFeedback onPress={() => removeFavouriteTutor(item?.tutor?.id)}>
                  <View
                    style={{
                      height: RfH(44),
                      width: RfW(44),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <IconButtonWrapper
                      iconWidth={RfW(16)}
                      iconHeight={RfH(16)}
                      iconImage={Images.heartFilled}
                      styling={{ marginHorizontal: RfW(16) }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingFavouriteTutors || removeFavouriteLoading} />
      <ScreenHeader label="Favourite Tutors" homeIcon horizontalPadding={16} />
      <FlatList
        data={favouriteTutors}
        showsVerticalScrollIndicator={false}
        extraData={refreshTutorList}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: RfH(16), marginTop: RfH(24), paddingBottom: RfH(34) }}
      />
    </View>
  );
}

export default FavouriteTutors;
