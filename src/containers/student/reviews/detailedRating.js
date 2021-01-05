/* eslint-disable no-plusplus */
import { FlatList, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Textarea, Button } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Images, Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function DetailedRating() {
  const [ratings, setRatings] = useState([
    { category: 'Course Understanding', rating: 4 },
    { category: 'Helpfullness', rating: 4 },
    { category: 'Teaching Methodology', rating: 4 },
    { category: 'Accessibility', rating: 4 },
    { category: 'Improvement in results', rating: 4 },
    { category: 'Professionalism & Attitude', rating: 4 },
  ]);

  const renderRatings = (item) => {
    const rating = [];
    for (let i = 1; i < 6; i++) {
      if (i <= item.rating) {
        rating.push(
          <View>
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.golden_star} />
          </View>
        );
      } else {
        rating.push(
          <View>
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.grey_star} />
          </View>
        );
      }
    }
    return (
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
        <View style={{ flex: 0.5 }}>
          <Text style={commonStyles.mediumMutedText}>{item.category}</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenCenterView, { flex: 0.5, justifyContent: 'flex-end' }]}>
          {rating}
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyles.mainContainer}>
      <ScreenHeader homeIcon label="Rate & Review" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: RfH(44) }} />
        <Text style={[commonStyles.pageTitleThirdRow, { textAlign: 'center' }]}>GOOD</Text>
        <View style={{ height: RfH(24) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <IconButtonWrapper
            iconWidth={RfW(32)}
            iconHeight={RfH(32)}
            styling={{ marginHorizontal: RfW(8) }}
            iconImage={Images.golden_star}
          />
          <IconButtonWrapper
            iconWidth={RfW(32)}
            iconHeight={RfH(32)}
            styling={{ marginHorizontal: RfW(8) }}
            iconImage={Images.golden_star}
          />
          <IconButtonWrapper
            iconWidth={RfW(32)}
            iconHeight={RfH(32)}
            styling={{ marginHorizontal: RfW(8) }}
            iconImage={Images.golden_star}
          />
          <IconButtonWrapper
            iconWidth={RfW(48)}
            iconHeight={RfH(48)}
            styling={{ marginHorizontal: RfW(8) }}
            iconImage={Images.selected_star}
          />
          <IconButtonWrapper
            iconWidth={RfW(32)}
            iconHeight={RfH(32)}
            styling={{ marginHorizontal: RfW(8) }}
            iconImage={Images.grey_star}
          />
        </View>
        <View style={[commonStyles.borderBottom, { height: RfH(32) }]} />
        <Text
          style={{
            textAlign: 'center',
            fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
            marginTop: RfH(8),
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
        <Textarea rowSpan={3} bordered style={{ borderRadius: 8, backgroundColor: Colors.lightGrey }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(40), marginBottom: RfH(34) }]}>
          <Button
            block
            bordered
            style={[
              commonStyles.buttonPrimary,
              { backgroundColor: Colors.white, marginHorizontal: 0, marginRight: RfW(8), flex: 0.5 },
            ]}>
            <Text style={[commonStyles.textButtonPrimary, { color: Colors.brandBlue2 }]}>Skip</Text>
          </Button>
          <Button block style={[commonStyles.buttonPrimary, { marginHorizontal: 0, marginLeft: RfW(8), flex: 0.5 }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default DetailedRating;
