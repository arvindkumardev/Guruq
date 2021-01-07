import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { BackArrow, ScreenHeader, TutorImageComponent } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import {
  ABOUT_US_URL,
  ACADEMIC_BOARD_URL,
  CEO_MESSAGE_URL,
  CSR_URL,
  IN_NEWS_URL,
  STANDARD_SCREEN_SIZE,
} from '../../../utils/constants';
import { getFileUrl, RfH, RfW } from '../../../utils/helpers';
import styles from './styles';
import CustomImage from '../../../components/CustomImage';

function AboutUs() {
  const aboutUsData = [
    {
      name: 'Founders',
      color: 'rgb(231,229,242)',
      url: CEO_MESSAGE_URL,
    },
    { name: 'Top Stories', color: 'rgb(230,252,231)', url: IN_NEWS_URL },
    { name: 'Academic Team', color: 'rgb(255,247,240)', url: ACADEMIC_BOARD_URL },
    { name: 'GuruQ CSR', color: 'rgb(203,231,255)', url: CSR_URL },
  ];

  const founderMessages = [
    {
      name: 'Minal Anand',
      // eslint-disable-next-line global-require
      image: require('../../../assets/images/minal.png'),
      designation: 'Founder & CEO',
      desc:
        'Minal is the Founder and Chief Executive Officer at GuruQ, a unique and ' +
        'integrated digital platform that promises to bring high quality standards and new age methodologies ' +
        'to the way education is imparted in India. A graduate in Business Administration from the School ' +
        'of Management at Boston University...',
    },
    {
      name: 'Jai Karan Anand',
      // eslint-disable-next-line global-require
      image: require('../../../assets/images/jai.png'),
      designation: 'Co-Founder',
      desc:
        'Jai Karan Anand is the co-founder of GuruQ and perfectly complements ' +
        "Minal Anand's Business and Strategy acumen with his creative expertise and out-of-the-box tactical planning abilities...",
    },
  ];

  const renderAboutDetail = (item, index) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(item.url)}
      style={{
        flexDirection: 'column',
        marginTop: RfH(20),
        marginRight: index % 2 === 0 ? RfH(16) : 0,
        paddingVertical: RfW(24),
        borderRadius: RfH(8),
        flex: 0.5,
        backgroundColor: item.color,
      }}
      activeOpactity={0.8}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(5),
          borderRadius: RfW(8),
        }}>
        <Text style={styles.aboutDetailLabel}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFounderMessage = (item, index) => (
    <View style={{ marginTop: RfH(16), flex: 1 }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: RfH(13),
            }}>
            <View
              style={{
                flex: 0.2,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <CustomImage
                imageWidth={RfH(64)}
                imageHeight={RfH(64)}
                image={item.image}
                imageResizeMode="cover"
                styling={{ borderRadius: RfH(64) }}
              />
            </View>
            <View
              style={{
                flex: 0.8,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.name}</Text>
              </View>
              <Text
                style={{
                  color: Colors.secondaryText,
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  marginTop: RfH(2),
                }}>
                {item.designation}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(2),
                }}>
                <Text
                  style={{
                    color: Colors.secondaryText,
                    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
                    marginTop: RfH(2),
                  }}>
                  {item.desc}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  marginTop: RfH(8),
                }}
                activeOpacity={0.8}
                onPress={() => Linking.openURL(CEO_MESSAGE_URL)}>
                <Text
                  style={{
                    color: Colors.brandBlue2,
                    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
                    marginTop: RfH(2),
                  }}>
                  Know More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {index !== founderMessages.length - 1 && <View style={[commonStyles.lineSeparator]} />}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[{ backgroundColor: Colors.white, flex: 1, paddingHorizontal: 0 }]}>
      <ScreenHeader label="About GuruQ" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ height: RfH(16) }} />
      <View style={[commonStyles.mainContainer]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={[styles.aboutText]}>
              GuruQ is India’s best tutoring platform that connects students with the right tutors. With the GuruQ
              platform, students can personalize their tuitions classes with respect to the mode of class (Home or
              online), type of class (individual or group) and budget.
            </Text>
          </View>
          <View style={{ height: RfH(8) }} />

          <TouchableOpacity
            onPress={() => Linking.openURL(ABOUT_US_URL)}
            style={{ marginTop: RfH(20) }}
            activeOpacity={0.8}>
            <Image
              style={{
                width: Dimensions.get('window').width - 32,
                height: RfH(185),
              }}
              source={Images.aboutUs}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <View style={{ height: RfH(24) }} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              data={aboutUsData}
              renderItem={({ item, index }) => renderAboutDetail(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View>
            <View style={styles.labelHeader}>
              <Text style={styles.labelText}>Founders Message</Text>
            </View>

            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={founderMessages}
                renderItem={({ item, index }) => renderFounderMessage(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View style={{ height: RfH(24) }} />
        </ScrollView>
      </View>
    </View>
  );
}

export default AboutUs;
