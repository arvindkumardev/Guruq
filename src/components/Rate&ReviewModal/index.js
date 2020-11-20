/* eslint-disable import/no-cycle */
/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, FlatList, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Textarea, Button } from 'native-base';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

const dateSlotModal = (props) => {
  const navigation = useNavigation();
  const [ratings, setRatings] = useState([
    { category: 'Course Understanding', rating: 4 },
    { category: 'Helpfullness', rating: 4 },
    { category: 'Teaching Methodology', rating: 4 },
    { category: 'Accessibility', rating: 4 },
    { category: 'Improvement in results', rating: 4 },
    { category: 'Professionalism & Attitude', rating: 4 },
  ]);

  const { visible, onClose } = props;

  const renderRatings = (item) => {
    const rating = [];
    for (let i = 1; i <= 5; i++) {
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={commonStyles.verticallyCenterItemsView}>
            <IconButtonWrapper
              iconWidth={RfW(96)}
              iconHeight={RfH(96)}
              iconImage={Images.kushal}
              styling={{ borderRadius: 8 }}
            />
            <Text style={[commonStyles.headingPrimaryText, { marginTop: RfH(8) }]}>Gurbani Singh</Text>
            <Text style={commonStyles.mediumMutedText}>English ( Class 6-12 I CBSE)</Text>
            <View style={{ height: RfH(32) }} />
            <Text style={commonStyles.mediumMutedText}>Rate Your Tutor</Text>
            <View style={{ height: RfH(24) }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <IconButtonWrapper
                iconHeight={RfH(42)}
                iconWidth={RfW(42)}
                iconImage={Images.golden_star}
                styling={{ marginHorizontal: RfW(8) }}
              />
              <IconButtonWrapper
                iconHeight={RfH(42)}
                iconWidth={RfW(42)}
                iconImage={Images.golden_star}
                styling={{ marginHorizontal: RfW(8) }}
              />
              <IconButtonWrapper
                iconHeight={RfH(42)}
                iconWidth={RfW(42)}
                iconImage={Images.golden_star}
                styling={{ marginHorizontal: RfW(8) }}
              />
              <IconButtonWrapper
                iconHeight={RfH(42)}
                iconWidth={RfW(42)}
                iconImage={Images.golden_star}
                styling={{ marginHorizontal: RfW(8) }}
              />
              <IconButtonWrapper
                iconHeight={RfH(42)}
                iconWidth={RfW(42)}
                iconImage={Images.grey_star}
                styling={{ marginHorizontal: RfW(8) }}
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
            <Textarea rowSpan={3} bordered style={{ borderRadius: 8, backgroundColor: Colors.lightGrey }} />
            <Button
              block
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

dateSlotModal.defaultProps = {
  visible: false,
  onClose: null,
};

dateSlotModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default dateSlotModal;
