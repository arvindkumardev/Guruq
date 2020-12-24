import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles';
import commonStyles from '../../../../theme/styles';
import { IconButtonWrapper } from '../../../../components';
import { getUserImageUrl, RfH, RfW, titleCaseIfExists } from '../../../../utils/helpers';
import { Colors, Images } from '../../../../theme';
import Fonts from '../../../../theme/fonts';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import routeNames from '../../../../routes/screenNames';

function TutorListCard(props) {
  const { tutor, offering, markFavouriteTutor, isFavourite, isSponsored } = props;
  const navigation = useNavigation();

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const goToTutorDetails = () => {
    navigation.navigate(routeNames.STUDENT.TUTOR_DETAILS, {
      tutorData: tutor,
      parentOffering: offering?.parentOffering?.id,
      parentParentOffering: offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: offering?.parentOffering?.displayName,
      parentParentOfferingName: offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const getTutorBudget = () => {
    const tutorOffering =
      tutor.tutorOfferings && tutor.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    const onlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === true);
    const offlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === false);
    if (onlineBudget && offlineBudget) {
      return onlineBudget.price > offlineBudget.price ? offlineBudget.price : onlineBudget.price;
    }
    if (onlineBudget) {
      return onlineBudget.price;
    }
    if (offlineBudget) {
      return offlineBudget.price;
    }
    return 0;
  };

  const getFreeDemoClassView = () => {
    const tutorOffering =
      tutor.tutorOfferings && tutor.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    return (
      tutorOffering?.freeDemo && (
        <View style={{ marginHorizontal: RfW(8), marginTop: RfH(8) }}>
          <View style={commonStyles.lineSeparator} />
          <Text style={{ fontSize: RFValue(13, STANDARD_SCREEN_SIZE), color: Colors.secondaryText }}>
            Free Demo Class
          </Text>
        </View>
      )
    );
  };

  return (
    <View style={styles.listItemParent}>
      <TouchableWithoutFeedback onPress={goToTutorDetails}>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <IconButtonWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={getTutorImage(tutor)}
              imageResizeMode="cover"
              styling={styles.userIcon}
            />
            {isSponsored && (
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
                      fontSize: 8,
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
                  {tutor.contactDetail.firstName} {tutor.contactDetail.lastName}
                </Text>
                {tutor.educationDetails.length > 0 && (
                  <Text style={styles.tutorDetails} numberOfLines={1}>
                    {titleCaseIfExists(tutor.educationDetails[0].degree?.degreeLevel)}
                    {' - '}
                    {titleCaseIfExists(tutor.educationDetails[0].fieldOfStudy)}
                  </Text>
                )}
                <Text style={styles.tutorDetails}>{tutor.teachingExperience} Years of Experience</Text>
                <View style={[styles.iconsView, { marginTop: RfH(8) }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name={tutor.averageRating > 0 ? 'star' : 'star-o'}
                      style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
                    />
                    {tutor.averageRating > 0 ? (
                      <Text style={styles.chargeText}>{parseFloat(tutor.averageRating).toFixed(1)}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                        }}>
                        NOT RATED
                      </Text>
                    )}

                    {tutor.reviewCount > 0 && (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                          marginLeft: RfW(8),
                        }}>
                        {tutor.reviewCount} Reviews
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
                <TouchableWithoutFeedback onPress={markFavouriteTutor}>
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
                      iconImage={isFavourite ? Images.heartFilled : Images.heart}
                      styling={{ marginHorizontal: RfW(16) }}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View>
                  <Text style={styles.chargeText}>₹ {getTutorBudget()}/Hr</Text>
                </View>
              </View>
            </View>
            {getFreeDemoClassView()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default TutorListCard;
