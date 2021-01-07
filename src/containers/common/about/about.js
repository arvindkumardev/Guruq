import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { BackArrow, TutorImageComponent } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './styles';

function AboutUs({navigation}) {
  const [aboutUsData, setAboutUsData] = useState([
    {
      name: 'Founders',
      color: 'rgb(231,229,242)',
    },
    { name: 'Top Stories', color: 'rgb(230,252,231)' },
    { name: 'Academic Team', color: 'rgb(255,247,240)' },
    { name: 'GuruQ CSR', color: 'rgb(203,231,255)' },
  ]);

  const [founderMessages,setFounderMessages] = useState([1,1])

  const renderAboutDetail = (item, index) => (
    <TouchableOpacity
      onPress={() => alert('coming')}
      style={{
        flexDirection: 'column',
        marginTop: RfH(20),
        marginRight: index % 2 == 0 ? RfH(16) : 0,
        paddingVertical: RfW(24),
        borderRadius: RfH(8),
        flex: 0.5,
        backgroundColor: item.color,
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(5),
          borderRadius: RfW(8),
        }}>
        <Text
          style={styles.aboutDetailLabel}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFounderMessage = (item,index) => (
    <View style={{ marginTop: RfH(16), flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => alert('coming')}
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
              <TutorImageComponent
                tutor={item?.tutor}
                height={64}
                width={64}
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
                <Text
                  style={[
                    commonStyles.regularPrimaryText,
                    { fontFamily: Fonts.semiBold },
                  ]}>
                  {'Minal Anand'}
                </Text>
              </View>
              <Text
                style={{
                  color: Colors.secondaryText,
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  marginTop: RfH(2),
                }}>
                {`Founder & CEO`}
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
                  {`Minal is the found and CEO of Guruq, a unique and integrated digital platform that promises the ...`}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  marginTop: RfH(8),
                }}>
                <Text
                  style={{
                    color: Colors.brandBlue2,
                    fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
                    marginTop: RfH(2),
                  }}>
                  {`Know More`}
                </Text>
              </View>
            </View>
          </View>
          {index != founderMessages.length -1 && <View style={[commonStyles.lineSeparator]} />}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );


  return (
    <View
      style={[
        { backgroundColor: Colors.white, flex: 1, paddingHorizontal: 0 },
      ]}>
      <View
        style={{
          height: RfH(44),
          marginHorizontal: RfW(10),
          alignItems: 'flex-start',
          flexDirection: 'row',
          marginTop: RfH(32),
        }}>
        <BackArrow action={() => navigation.goBack()} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <Text
            style={{
              color: Colors.primaryText,
              fontFamily: Fonts.bold,
              fontSize: 20,
            }}>
            About GuruQ
          </Text>
        </View>
      </View>
      <View style={{ height: RfH(16) }} />
      <View style={{ paddingHorizontal: RfW(16) }} />
      <View style={[commonStyles.mainContainer]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text
              style={[
                styles.aboutText,
              ]}>{`GuruQ is India’s best tutoring platform that connects students with the right tutors. With the GuruQ platform, students can personalize their tuitions classes with respect to the mode of class (Home or online), type of class (individual or group) and budget.`}</Text>
          </View>
          <View style={{ height: RfH(8) }} />

          <TouchableOpacity
            onPress={() => alert('coming')}
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
            <View
              style={styles.labelHeader}>
              <Text
                style={styles.labelText}>
                Founders Message
              </Text>
            </View>

            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={founderMessages}
                renderItem={({ item, index }) =>
                  renderFounderMessage(item, index)
                }
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
