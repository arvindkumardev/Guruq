import React from 'react';
import { View, Text } from 'react-native';

import commonStyles from '../../../theme/styles';
import { Fonts, Images, Colors } from '../../../theme';
import { RfH, RfW, getFullName } from '../../../utils/helpers';
import { IconButtonWrapper } from '../../../components';
import moment from 'moment';
import StudentImageComponent from '../../../components/StudentImageComponent';

const RatingView = ({ student,reviewArray }) => {
  const reviewData = reviewArray[0]  
  return (
    <View style={{ marginBottom: RfH(30) }}>
      <Text
        style={[
          commonStyles.regularPrimaryText,
          { fontFamily: Fonts.bold, marginBottom: RfH(16) },
        ]}>
        Rating & Reviews
      </Text>
      <View
        style={{
          backgroundColor: Colors.lightGrey,
          paddingVertical: RfH(16),
          paddingHorizontal: RfW(8),
        }}>
        <View style={{ flexDirection: 'row' }}>
          <StudentImageComponent
            student={student}
            styling={{
              borderRadius: RfH(20),
              height: RfH(40),
              width: RfH(40),
              marginRight: RfW(8),
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.semiBold,
                color: Colors.black,
              }}>
              {getFullName(student?.contactDetail)}
            </Text>
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 10 }}>
                {moment(reviewData.createdDate).format('DD-MMM-YYYY')} |
              </Text>
              <IconButtonWrapper
                iconImage={Images.star_orange}
                iconWidth={RfW(11)}
                iconHeight={RfH(10)}
                containerStyling={{
                  alignSelf: 'center',
                  paddingHorizontal: 2,
                }}
              />
              <Text style={{ fontSize: 10 }}>{reviewData.overallRating}</Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            marginTop: RfH(10),
            marginBottom: RfH(8),
            lineHeight: 18,
            fontSize: 14,
            letterSpacing: 0.28,
            alignSelf: 'flex-start',
            color: Colors.darkGrey,
          }}>
          {reviewData.text}
        </Text>
      </View>
      {/* <Text
        style={[
          commonStyles.mediumPrimaryText,
          { marginTop: 8, alignSelf: 'flex-end', color: Colors.brandBlue2 },
        ]}>
        View All
      </Text> */}
    </View>
  );
};

export default RatingView;
