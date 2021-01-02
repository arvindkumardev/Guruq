import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Colors, Images } from '../../../theme';
import { getFullName, RfH, RfW, titleCaseIfExists } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import styles from '../tutorListing/styles';
import { IconButtonWrapper, ScreenHeader, SelectSubjectModal, TutorImageComponent } from '../../../components';
import { GET_FAVOURITE_TUTORS } from '../tutor-query';
import { REMOVE_FAVOURITE } from '../tutor-mutation';
import Loader from '../../../components/Loader';
import { interestingOfferingData } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';

function FavouriteTutors() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [favouriteTutors, setFavouriteTutors] = useState([]);
  const [refreshTutorList, setRefreshTutorList] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedOffering, setSelectedOfferings] = useState({});
  const interestedOfferings = useReactiveVar(interestingOfferingData);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        setIsEmpty(true);
      }
    },
    onCompleted: (data) => {
      if (data) {
        setFavouriteTutors(data?.getFavouriteTutors);
        setRefreshTutorList(!refreshTutorList);
        setIsEmpty(data?.getFavouriteTutors.length === 0);
      }
    },
  });

  const [removeFavourite, { loading: removeFavouriteLoading }] = useMutation(REMOVE_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getFavouriteTutors({
          variables: {
            parentOfferingId: selectedOffering?.id,
          },
        });
        setRefreshTutorList(!refreshTutorList);
      }
    },
  });

  useEffect(() => {
    if (interestedOfferings) {
      setSelectedOfferings(interestedOfferings.find((item) => item.selected)?.offering);
    }
  }, [interestedOfferings]);

  useEffect(() => {
    if (selectedOffering && isFocussed) {
      getFavouriteTutors({
        variables: {
          parentOfferingId: selectedOffering?.id,
        },
      });
    }
  }, [selectedOffering, isFocussed]);

  const removeFavouriteTutor = (tutorId) => {
    removeFavourite({
      variables: { tutorFavourite: { tutor: { id: tutorId } } },
    });
  };

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const goToTutorDetails = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorData: item.tutor,
      parentOffering: selectedOffering?.id,
      parentParentOffering: selectedOffering?.parentOffering?.id,
      parentOfferingName: selectedOffering?.parentOffering?.displayName,
      parentParentOfferingName: selectedOffering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const renderItem = (item) => (
    <View style={styles.listItemParent}>
      <TouchableOpacity
        onPress={() => goToTutorDetails(item)}
        style={commonStyles.horizontalChildrenStartView}
        activeOpacity={1}>
        <View style={styles.userIconParent}>
          <TutorImageComponent tutor={item?.tutor} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
              <Text style={styles.tutorName}>{getFullName(item?.tutor?.contactDetail)}</Text>
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
                  <IconButtonWrapper
                    iconImage={item?.tutor.averageRating > 0 ? Images.filledStar : Images.unFilledStar}
                    iconHeight={RfH(15)}
                    iconWidth={RfW(15)}
                    imageResizeMode="contain"
                    styling={{ marginRight: RfW(4) }}
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
              <TouchableOpacity onPress={() => removeFavouriteTutor(item?.tutor?.id)} activeOpacity={1}>
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingFavouriteTutors || removeFavouriteLoading} />
      <ScreenHeader label="Favourite Tutors" homeIcon horizontalPadding={16} />
      {!isEmpty && (
        <FlatList
          data={favouriteTutors}
          showsVerticalScrollIndicator={false}
          extraData={refreshTutorList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: RfH(16), marginTop: RfH(24), paddingBottom: RfH(34) }}
        />
      )}
      {isEmpty && (
        <View>
          <Image
            source={Images.emptyFavTutor}
            style={{
              margin: RfH(56),
              alignSelf: 'center',
              height: RfH(200),
              width: RfW(216),
              marginBottom: RfH(32),
            }}
            resizeMode="contain"
          />
          <Text
            style={[
              commonStyles.pageTitleThirdRow,
              { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
            ]}>
            No Tutor found
          </Text>
          <Text
            style={[
              commonStyles.regularMutedText,
              { marginHorizontal: RfW(60), textAlign: 'center', marginTop: RfH(16) },
            ]}>
            Looks like you haven't create list of your favourite tutors.
          </Text>
          <View style={{ height: RfH(40) }} />
          <Button
            block
            style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
            onPress={() => setShowAllSubjects(true)}>
            <Text style={commonStyles.textButtonPrimary}>Mark Favourites</Text>
          </Button>
        </View>
      )}
      <SelectSubjectModal
        onClose={() => setShowAllSubjects(false)}
        onSelectSubject={gotoTutors}
        visible={showAllSubjects}
      />
    </View>
  );
}

export default FavouriteTutors;
