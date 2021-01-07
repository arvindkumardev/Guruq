/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { SEARCH_REVIEW } from '../../containers/student/tutor-query';
import { IconButtonWrapper } from '..';
import { getUserImageUrl, RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';

function UserReviews(props) {
  const { submitFunction, tutorId } = props;
  const [userReviews, setUserReviews] = useState([]);

  const renderReviews = (item) => {
    return (
      <View
        style={{
          paddingHorizontal: RfW(16),
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <IconButtonWrapper
            iconHeight={RfH(40)}
            iconWidth={RfH(40)}
            iconImage={getUserImageUrl(
              item?.createdBy?.profileImage?.filename,
              item?.createdBy?.gender,
              item?.createdBy?.id
            )}
            styling={{ borderRadius: RfH(20) }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: RfW(8),
            }}>
            <Text style={{ fontFamily: 'SegoeUI-Semibold' }}>{item.name}</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item.date} |{' '}
              <IconButtonWrapper
                iconWidth={RfW(10)}
                iconHeight={RfH(10)}
                iconImage={Images.golden_star}
                styling={{ alignSelf: 'center' }}
              />{' '}
              {parseFloat(item.rating).toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: RfH(8), color: Colors.darkGrey }}>{item.description}</Text>

        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
      </View>
    );
  };

  const [searchReview, { loading: reviewLoading }] = useLazyQuery(SEARCH_REVIEW, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const review = [];
        for (const obj of data.searchReview.edges) {
          const item = {
            name: getFullName(obj.createdBy),
            icon: obj.createdBy,
            rating: obj.overallRating,
            date: new Date(obj.createdDate).toDateString(),
            description: obj.text,
          };
          review.push(item);
        }
        setUserReviews(review);
      }
    },
  });

  useEffect(() => {
    searchReview({ variables: { reviewSearchDto: { tutorId } } });
  }, []);

  return (
    <View style={{}}>
      <FlatList
        data={userReviews}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => renderReviews(item)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

UserReviews.propTypes = {
  tutorId: PropTypes.number,
  submitFunction: PropTypes.func,
};

UserReviews.defaultProps = {
  tutorId: 0,
  submitFunction: null,
};

export default UserReviews;
