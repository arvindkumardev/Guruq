/* eslint-disable import/no-cycle */
/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, FlatList, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Textarea, Button } from 'native-base';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { useMutation } from '@apollo/client';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { ADD_REVIEW } from '../../containers/student/tutor-mutation';
import Loader from '../Loader';

const ReviewModal = (props) => {
  const navigation = useNavigation();
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
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        onClose(false);
      }
    },
  });

  const setlistRating = (item, index, rate) => {
    const array = [];
    ratings.map((obj) => {
      array.push(obj);
    });
    array[index].rating = rate;
    setRatings(array);
  };

  const renderRatings = (item, index) => {
    return (
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
            onFinishRating={(rate) => setlistRating(item, index, rate)}
          />
        </View>
      </View>
    );
  };

  const ratingCompleted = (d) => {
    setRate(d);
  };

  const onAddReview = () => {
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
  };

  return (
    <Modal
      animationType="fade"
      transparent
      backdropOpacity={1}
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column' }} />
      <View
        style={[
          commonStyles.verticallyStretchedItemsView,
          { backgroundColor: Colors.white, paddingTop: RfH(32), height: '95%' },
        ]}>
        <Loader isLoading={reviewLoading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={commonStyles.verticallyCenterItemsView}>
            <IconButtonWrapper
              iconWidth={RfW(96)}
              iconHeight={RfH(96)}
              iconImage={Images.kushal}
              styling={{ borderRadius: 8 }}
            />
            <Text style={[commonStyles.headingPrimaryText, { marginTop: RfH(8) }]}>
              {classDetails?.tutor?.contactDetail?.firstName} {classDetails.tutor.contactDetail.lastName}
            </Text>
            <Text style={commonStyles.mediumMutedText}>
              {`${classDetails?.offering?.displayName} (${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName})`}
            </Text>
            <View style={{ height: RfH(32) }} />
            <Text style={commonStyles.mediumMutedText}>Rate Your Tutor</Text>
            <View style={{ height: RfH(24) }} />
            <View>
              <AirbnbRating
                count={5}
                showRating={false}
                defaultRating={0}
                size={40}
                onFinishRating={(r) => ratingCompleted(r)}
              />
            </View>
          </View>
          <View style={{ paddingHorizontal: RfW(16) }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                marginTop: RfH(16),
                paddingHorizontal: RfW(26),
              }}>
              Rate us in detail to make your learning experience better
            </Text>
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={ratings}
                renderItem={({ item, index }) => renderRatings(item, index)}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginTop: RfH(16) }}
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
            <Button
              block
              onPress={() => onAddReview()}
              style={[
                commonStyles.buttonPrimary,
                { marginHorizontal: 0, alignSelf: 'center', marginVertical: RfH(34) },
              ]}>
              <Text style={commonStyles.textButtonPrimary}>Submit</Text>
            </Button>
          </View>
        </ScrollView>
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
