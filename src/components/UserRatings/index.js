/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { Rating } from 'react-native-ratings';
import ProgressCircle from 'react-native-progress-circle';
import { GET_AVERAGE_RATINGS, SEARCH_REVIEW } from '../../containers/student/tutor-query';
import { IconButtonWrapper } from '..';
import { getUserImageUrl, RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { Colors, Fonts, Images } from '../../theme';
import commonStyles from '../../theme/styles';

function UserRatings(props) {
  const { submitFunction, tutorId } = props;
  const [overallRating, setOverallRating] = useState(0);
  const [reviewProgress, setReviewProgress] = useState([
    { typeName: 'Course Understanding', image: Images.methodology, percentage: 0, key: 'courseUnderstanding' },
    { typeName: 'Helpfulness', image: Images.chat, percentage: 0, key: 'helpfulness' },
    { typeName: 'Professional Attitude', image: Images.professional, percentage: 0, key: 'professionalAttitude' },
    { typeName: 'Teaching Methodology', image: Images.methodology, percentage: 0, key: 'teachingMethodology' },
    { typeName: 'Accessibility', image: Images.thumb_range, percentage: 0, key: 'accessibility' },
    { typeName: 'Improvement in Results', image: Images.stats, percentage: 0, key: 'resultImprovement' },
  ]);

  const getPercentage = (value) => value * 20;

  const [getAverageRating, { loading: ratingLoading }] = useLazyQuery(GET_AVERAGE_RATINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log(data);
        let ratingArray = reviewProgress;
        Object.keys(data.getAverageRating).forEach((key) => {
          ratingArray = ratingArray.map((item) => ({
            ...item,
            percentage: item.key === key ? getPercentage(data.getAverageRating[key]) : item.percentage,
          }));
        });
        setReviewProgress(ratingArray);
        setOverallRating(data.getAverageRating.overallRating);
      }
    },
  });

  useEffect(() => {
    getAverageRating({ variables: { reviewSearchDto: { tutorId } } });
  }, []);

  const renderProgress = (item) => (
    <View style={{ flex: 0.33, alignItems: 'center', marginTop: RfH(16) }}>
      <ProgressCircle
        percent={item.percentage}
        radius={32}
        borderWidth={6}
        color={Colors.brandBlue2}
        shadowColor={Colors.lightGrey}
        bgColor={Colors.white}>
        <IconButtonWrapper iconWidth={RfW(22)} iconHeight={RfH(22)} imageResizeMode="contain" iconImage={item.image} />
      </ProgressCircle>
      <Text
        style={{
          fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
          textAlign: 'center',
          marginTop: RfH(8),
          color: Colors.darkGrey,
        }}>
        {item.typeName}
      </Text>
    </View>
  );

  return (
    <View style={{}}>
      <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16) }]}>
        <Text style={{ fontFamily: Fonts.semiBold, fontSize: RFValue(20, STANDARD_SCREEN_SIZE) }}>
          {overallRating}/5
        </Text>
        <Rating
          style={{ paddingVertical: RfH(16), alignSelf: 'flex-start', marginHorizontal: RfW(16) }}
          imageSize={20}
          ratingCount={5}
          readonly
          startingValue={overallRating}
        />
      </View>
      <View style={{ paddingHorizontal: RfW(16) }}>
        <FlatList
          numColumns={3}
          data={reviewProgress}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderProgress(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

UserRatings.propTypes = {
  tutorId: PropTypes.number,
  submitFunction: PropTypes.func,
};

UserRatings.defaultProps = {
  tutorId: 0,
  submitFunction: null,
};

export default UserRatings;
