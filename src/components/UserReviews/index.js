/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { SEARCH_REVIEW } from '../../containers/student/tutor-query';
import { IconButtonWrapper } from '..';
import { getFullName, getUserImageUrl, RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { Colors, Images, Fonts } from '../../theme';
import commonStyles from '../../theme/styles';
import ActionSheet from '../ActionSheet';
import StudentImageComponent from '../StudentImageComponent';

function UserReviews(props) {
  const { submitFunction, tutorId } = props;
  const [userReviews, setUserReviews] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const sortReviews = () => {};
  const [menuItem, setMenuItem] = useState([
    { label: 'Recent', handler: sortReviews, isEnabled: true },
    { label: 'Relevant', handler: sortReviews, isEnabled: true },
    { label: 'Highest Rating', handler: sortReviews, isEnabled: true },
    { label: 'Lowest Rating', handler: sortReviews, isEnabled: true },
  ]);

  const renderReviews = (item) => {
    return (
      <View
        style={{
          paddingHorizontal: RfW(16),
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <StudentImageComponent student={item.createdBy} height={40} width={40} styling={{ borderRadius: RfH(20) }} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: RfW(8),
            }}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.date} |{' '}
              </Text>
              <IconButtonWrapper
                iconWidth={RfW(10)}
                iconHeight={RfH(10)}
                iconImage={Images.golden_star}
                imageResizeMode="contain"
              />
              <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {' '}
                {parseFloat(item.rating).toFixed(1)}
              </Text>
            </View>
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
      console.log(e);
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
      <View
        style={[
          commonStyles.horizontalChildrenSpaceView,
          {
            padding: RfH(16),
            borderBottomColor: Colors.darkGrey,
            borderBottomWidth: 0.5,
            marginBottom: RfH(16),
          },
        ]}>
        <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Reviews</Text>
        <TouchableWithoutFeedback onPress={() => setOpenMenu(true)}>
          <View
            style={[
              commonStyles.horizontalChildrenView,
              { borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 16, padding: RfH(8) },
            ]}>
            <IconButtonWrapper iconHeight={RfH(12)} iconWidth={RfW(16)} iconImage={Images.sort} />
            <Text style={[commonStyles.smallMutedText, { marginLeft: RfW(12) }]}>Sort</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        data={userReviews}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => renderReviews(item)}
        keyExtractor={(item, index) => index.toString()}
      />
      <ActionSheet
        actions={menuItem}
        cancelText="Dismiss"
        handleCancel={() => setOpenMenu(false)}
        isVisible={openMenu}
        topLabel="Sort by"
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
