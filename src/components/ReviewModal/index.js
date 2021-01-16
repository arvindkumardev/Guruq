import { useMutation } from '@apollo/client';
import { Button, Icon, Textarea } from 'native-base';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, ScrollView, Text, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { isEmpty } from 'lodash';
import { Loader } from '..';
import { ADD_REVIEW } from '../../containers/student/tutor-mutation';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import { alertBox, getFullName, printDate, printTime, RfH, RfW } from '../../utils/helpers';
import Fonts from '../../theme/fonts';
import TutorImageComponent from '../TutorImageComponent';

const ReviewModal = (props) => {
  const [ratings, setRatings] = useState([
    { category: 'Course Understanding', rating: 0 },
    { category: 'Helpfullness', rating: 0 },
    { category: 'Teaching Methodology', rating: 0 },
    { category: 'Accessibility', rating: 0 },
    { category: 'Improvement in results', rating: 0 },
    { category: 'Professionalism & Attitude', rating: 0 },
  ]);
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState('');

  const { visible, onClose, classDetails } = props;

  const [addReview, { loading: reviewLoading }] = useMutation(ADD_REVIEW, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Thank you for providing your valuable feedback', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            onClose(false);
          },
        });
      }
    },
  });

  const setRatingValue = (index, value) => {
    setRatings((ratings) =>
      ratings.map((rateObj, rateIndex) => ({ ...rateObj, rating: rateIndex === index ? value : rateObj.rating }))
    );
  };

  const renderRatings = (item, index) => (
    <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
      <View style={{ flex: 0.5 }}>
        <Text style={commonStyles.mediumMutedText}>{item.category}</Text>
      </View>
      <View style={[commonStyles.horizontalChildrenCenterView, { flex: 0.5, justifyContent: 'flex-end' }]}>
        <AirbnbRating
          count={5}
          showRating={false}
          defaultRating={item.rating}
          size={20}
          onFinishRating={(value) => setRatingValue(index, value)}
        />
      </View>
    </View>
  );

  const ratingCompleted = (d) => {
    setRate(d);
  };

  const onAddReview = () => {
    if (ratings.find((rate) => rate.rating === 0) || rate === 0) {
      alertBox('Please provide all the ratings', '');
    } else if (isEmpty(review)) {
      alertBox('Please provide review', '');
    } else {
      addReview({
        variables: {
          review: {
            tutor: {
              id: classDetails.tutor.id,
            },
            classes: {
              id: classDetails.id,
            },
            courseUnderstanding: ratings[0].rating,
            helpfulness: ratings[1].rating,
            professionalAttitude: ratings[5].rating,
            teachingMethodology: ratings[2].rating,
            accessibility: ratings[3].rating,
            resultImprovement: ratings[4].rating,
            overallRating: rate,
            text: review,
          },
        },
      });
    }
  };

  return (
    <Modal animationType="fade" transparent backdropOpacity={1} visible={visible}>
      <View
        style={[
          commonStyles.verticallyStretchedItemsView,
          { backgroundColor: Colors.white, paddingTop: RfH(60), flex: 1 },
        ]}>
        <Loader isLoading={reviewLoading} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'position' })} enabled>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={commonStyles.verticallyCenterItemsView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  paddingHorizontal: RfW(15),
                }}>
                <View style={{ marginRight: RfW(8) }}>
                  <TutorImageComponent tutor={classDetails.tutor} />
                  {/* <IconButtonWrapper */}
                  {/*  iconWidth={RfH(98)} */}
                  {/*  iconHeight={RfH(98)} */}
                  {/*  iconImage={getTutorImage(classDetails.tutor)} */}
                  {/*  imageResizeMode="cover" */}
                  {/*  styling={{ alignSelf: 'center', borderRadius: RfH(49) }} */}
                  {/* /> */}
                </View>
                <View
                  style={{
                    // flex: 0.7,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    marginLeft: RfW(8),
                  }}>
                  <Text style={{ fontSize: 16, color: Colors.primaryText, fontFamily: Fonts.semiBold }}>
                    {`${classDetails?.offering?.displayName} by ${getFullName(classDetails?.tutor?.contactDetail)}`}
                  </Text>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    {`${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="calendar-o"
                      style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                    />
                    <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                      {printDate(classDetails.startDate)}, {printTime(classDetails.startDate)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="MaterialIcons"
                      name="computer"
                      style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                    />
                    <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                      {classDetails.onlineClass ? 'Online' : 'Offline'} Class
                    </Text>
                  </View>
                </View>
              </View>
              {/* <IconButtonWrapper */}
              {/*  iconWidth={RfW(96)} */}
              {/*  iconHeight={RfH(96)} */}
              {/*  iconImage={getTutorImage(classDetails?.tutor)} */}
              {/*  styling={{ borderRadius: 8 }} */}
              {/* /> */}
              {/* <Text style={[commonStyles.headingPrimaryText, { marginTop: RfH(8) }]}> */}
              {/*  {classDetails?.tutor?.contactDetail?.firstName} {classDetails.tutor.contactDetail.lastName} */}
              {/* </Text> */}
              {/* <Text style={commonStyles.mediumMutedText}> */}
              {/*  {`${classDetails?.offering?.displayName} (${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName})`} */}
              {/* </Text> */}
              <View style={{ paddingVertical: RfH(20) }}>
                <Text style={commonStyles.mediumMutedText}>Rate Your Class</Text>
              </View>
              <View style={{ marginBottom: RfH(16) }}>
                <AirbnbRating
                  count={5}
                  showRating={false}
                  defaultRating={0}
                  size={34}
                  onFinishRating={(r) => ratingCompleted(r)}
                />
              </View>
            </View>

            <View style={{ padding: RfH(16), paddingTop: RfH(24), backgroundColor: Colors.lightGrey }}>
              <Text style={[commonStyles.headingPrimaryText]}>Rate the tutor on various parameters.</Text>
            </View>
            <View style={{ paddingHorizontal: RfW(16), marginBottom: RfH(34) }}>
              <View>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={ratings}
                  renderItem={({ item, index }) => renderRatings(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              </View>
              <View style={{ marginTop: RfH(32) }}>
                <Text>Write a Review</Text>
              </View>
              <Textarea
                rowSpan={3}
                value={review}
                onChangeText={(text) => setReview(text)}
                bordered
                style={{ borderRadius: 8, backgroundColor: Colors.lightGrey }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={[
            commonStyles.horizontalChildrenCenterView,
            {
              paddingTop: RfH(8),
              borderTopColor: Colors.borderColor,
              borderTopWidth: 0.8,
              paddingBottom: RfH(34),
            },
          ]}>
          <Button
            block
            onPress={onAddReview}
            style={[commonStyles.buttonPrimary, { marginHorizontal: 0, alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

ReviewModal.defaultProps = {
  visible: false,
  onClose: null,
  classDetails: null,
};

ReviewModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  classDetails: PropTypes.object,
};

export default ReviewModal;
