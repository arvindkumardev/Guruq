/* eslint-disable no-nested-ternary */
import { Text, View, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { IconButtonWrapper } from '../../../components';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function tutorDetails() {
  const navigation = useNavigation();
  const [subjects, setSubjects] = useState([
    { id: 0, name: 'English' },
    { id: 1, name: 'Physics' },
    { id: 2, name: 'Chemistry' },
    { id: 3, name: 'Biology' },
  ]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderSubjects = (item) => {
    return (
      <View style={{ marginTop: RfH(20), flex: 1 }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: item.id % 4 === 0 ? '#E7E5F2' : 'rgb(203,231,255)',
            height: RfH(67),
            width: RfW(70),
            marginHorizontal: RfW(4),
            borderRadius: RfW(8),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(24.5)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(34.2)}
            iconImage={Images.book}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            width: RfW(70),
            color: Colors.primaryText,
            marginTop: RfH(5),
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0, paddingBottom: RfH(34) },
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.topView,
            { paddingTop: RfH(44), height: RfH(155), paddingHorizontal: RfW(16), alignItems: 'flex-start' },
          ]}>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.arrowRight}
            submitFunction={() => onBackPress()}
          />
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.rectangle} />
            <IconButtonWrapper
              iconWidth={RfW(16)}
              iconHeight={RfH(16)}
              iconImage={Images.heart}
              styling={{ marginHorizontal: RfW(16) }}
            />
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.share} />
          </View>
        </View>
        <IconButtonWrapper
          iconWidth={RfW(128)}
          iconHeight={RfH(128)}
          iconImage={Images.kushal}
          imageResizeMode="cover"
          styling={{ alignSelf: 'center', marginTop: RfH(-64), borderRadius: RfW(64) }}
        />
        <Text style={[styles.tutorName, { alignSelf: 'center', marginTop: RfH(12) }]}>Gurbani Singh</Text>
        <Text style={[styles.tutorDetails, { alignSelf: 'center' }]}>GURUQT133567</Text>
        <Text style={[styles.tutorDetails, { alignSelf: 'center' }]}>3 years of Teaching Experience </Text>
        <View
          style={{
            borderBottomColor: Colors.darkGrey,
            borderBottomWidth: 0.5,
            marginTop: RfH(16),
            borderTopWidth: 0.5,
            borderTopColor: Colors.darkGrey,
            flexDirection: 'row',
          }}>
          <View
            style={{ flex: 0.5, borderRightWidth: 0.5, borderRightColor: Colors.darkGrey, paddingVertical: RfH(16) }}>
            <View style={commonStyles.horizontalChildrenCenterView}>
              <IconButtonWrapper
                iconHeight={RfH(18)}
                iconWidth={RfW(11)}
                iconImage={Images.single_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Individual Class</Text>
            </View>
            <View style={commonStyles.horizontalChildrenCenterView}>
              <IconButtonWrapper
                iconHeight={RfH(16)}
                iconWidth={RfW(21)}
                iconImage={Images.multiple_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Group Class</Text>
            </View>
            <View style={commonStyles.horizontalChildrenCenterView}>
              <IconButtonWrapper
                iconHeight={RfH(16)}
                iconWidth={RfW(18)}
                iconImage={Images.user_board}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Demo Class</Text>
            </View>
          </View>
          <View style={{ flex: 0.5, paddingVertical: RfH(16) }}>
            <View style={commonStyles.horizontalChildrenCenterView}>
              <IconButtonWrapper
                iconHeight={RfH(18)}
                iconWidth={RfW(11)}
                iconImage={Images.single_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Online Class</Text>
            </View>
            <View style={commonStyles.horizontalChildrenCenterView}>
              <IconButtonWrapper
                iconHeight={RfH(18)}
                iconWidth={RfW(11)}
                iconImage={Images.multiple_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Home Tution</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>
          Educational Qualification
        </Text>
        <Text style={[styles.tutorDetails, { marginHorizontal: RfW(16), marginTop: RfH(10) }]}>Mass Communication</Text>
        <View
          style={{
            borderBottomColor: Colors.darkGrey,
            borderBottomWidth: 0.5,
            marginTop: RfH(16),
            borderTopWidth: 0.5,
            borderTopColor: Colors.darkGrey,
          }}>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Subjects</Text>
          <View style={{ marginBottom: RfH(16), paddingHorizontal: RfW(16) }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={subjects}
              renderItem={({ item }) => renderSubjects(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>
            Pace Matrix ( English )
          </Text>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(16) }]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Classes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50 ></Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(16) }]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Online Classes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50 ></Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(16) }]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Home Tutions</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50 ></Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: Colors.darkGrey,
            borderBottomWidth: 0.5,
            marginTop: RfH(16),
            borderTopWidth: 0.5,
            borderTopColor: Colors.darkGrey,
          }}>
          <Text
            style={[
              styles.tutorName,
              { marginHorizontal: RfW(16), marginVertical: RfH(16), color: Colors.brandBlue2 },
            ]}>
            View Availability of Classes
          </Text>
        </View>
        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Rating and Reviews</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenView, { marginVertical: RfH(16), marginHorizontal: RfW(16) }]}>
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), fontSize: RFValue(20, STANDARD_SCREEN_SIZE) }]}>
            {parseFloat(5).toFixed(1)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default tutorDetails;
