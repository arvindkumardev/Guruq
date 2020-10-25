import { Alert, FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Icon, Input, Item, Thumbnail } from 'native-base';
import Swiper from 'react-native-swiper';
import commonStyles from '../../../../common/styles';
import { Colors, Images } from '../../../../theme';
import { getSaveData, removeData, RfH, RfW } from '../../../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../../../utils/constants';
import { IconButtonWrapper } from '../../../../components';
import { AuthContext } from '../../../../common/context';

function dashboard() {
  const [userName, setUserName] = useState('');

  const getFirstName = async () => {
    const firstName = await getSaveData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME);
    setUserName(firstName);
  };

  useEffect(() => {
    getFirstName();
  });

  const { signOut } = React.useContext(AuthContext);

  const [favouriteTutor, setFavouriteTutor] = useState([
    { name: 'Ritesh Jain', subject: 'English, Maths', imageUrl: '' },
    { name: 'Simran Rai', subject: 'Chemistry', imageUrl: '' },
    { name: 'Priyam', subject: 'Maths', imageUrl: '' },
  ]);

  const logout = () => {
    // Alert.alert('Logout!')

    signOut();
  };

  const renderSubjects = () => {
    return (
      <View style={{ marginTop: RfH(20) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E7E5F2',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.book}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              English
            </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF7F0',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.physics}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              Physics
            </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(230,252,231)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.beaker}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              Chemistry
            </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(203,231,255)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.dna}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              Biology
            </Text>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: RfH(20) }}>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(230,252,231)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.math}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>Maths</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E7E5F2',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.civic}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              Civics
            </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(203,231,255)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.history}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              History
            </Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF7F0',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.geo}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.darktitle, marginTop: RfH(5) }}>
              Geography
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTutors = (item) => {
    return (
      <View
        style={{
          height: RfH(141),
          width: RfW(109),
          borderRadius: 8,
          backgroundColor: 'rgb(245,245,245)',
          marginHorizontal: RfW(10),
          marginTop: RfH(20),
        }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Thumbnail large style={{ marginTop: RfH(11) }} source={Images.kushal} />
          <Text style={{ marginTop: 1, color: Colors.darktitle }}>{item.name}</Text>
          <Text style={{ marginTop: 1, color: Colors.inputLabel, fontSize: 12 }}>{item.subject}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <StatusBar barStyle="dark-content" />
      <View style={[commonStyles.mainContainer]}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: RfH(18) }}>
          <View style={{ flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
            <Text style={{ fontFamily: 'SegoeUI-Semibold', fontSize: 28, color: Colors.darktitle }}>Hi {userName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={{ color: Colors.inputLabel, fontSize: 16, marginTop: RfH(4) }}>CBSE Class 9</Text>
              <Icon
                type="MaterialIcons"
                name="keyboard-arrow-down"
                style={{ marginTop: RfH(8), marginLeft: RfW(4), color: Colors.inputLabel }}
              />
            </View>
          </View>
          <View style={{ flex: 0.1, marginRight: RfW(16) }}>
            <Image
              source={Images.user}
              style={{ height: RfH(49), width: RfW(49), borderRadius: 12, marginBottom: RfH(8) }}
            />
          </View>
        </View>
        <View style={{ marginTop: RfW(26) }}>
          <Item
            style={{
              backgroundColor: '#F3F4F9',
              borderRadius: 10,
              paddingHorizontal: RfW(10),
              borderColor: 'transparent',
              height: RfH(50),
            }}>
            <Icon type="MaterialIcons" name="search" style={{ color: Colors.primaryButtonBackground }} />
            <Input placeholder="Search" />
          </Item>
        </View>

        {/* // FIXME: remove me */}
        <TouchableOpacity onPress={() => logout()}>
          <Text className="h5">Logout</Text>
        </TouchableOpacity>

        <View style={{ height: RfH(210), marginTop: RfH(29) }}>
          <Swiper horizontal autoplay autoplayTimeout={5}>
            <View>
              <View style={{ height: RfH(170), backgroundColor: '#ceecfe', borderRadius: 20 }} />
            </View>
            <View>
              <View style={{ height: RfH(170), backgroundColor: '#ceecfe', borderRadius: 20 }} />
            </View>
          </Swiper>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ color: Colors.darktitle, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Upcoming Classes</Text>
          <Text style={{ color: Colors.primaryButtonBackground, fontSize: 10 }}>View All</Text>
        </View>
        <View
          style={{ height: RfH(140), backgroundColor: '#ceecfe', borderRadius: 20, marginTop: RfH(20), padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <View style={{ flex: 0.3 }}>
              <Image style={{ height: RfH(88), width: RfW(78), zIndex: 5, borderRadius: 8 }} source={Images.kushal} />
            </View>
            <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
              <Text style={{ fontSize: 16, color: Colors.darktitle, fontFamily: 'SegoeUI-Semibold' }}>
                Science by Rahul Das
              </Text>
              <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>CBSE Class 9</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="calendar-o"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                />
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>Sunday , June 10 </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="Feather"
                  name="clock"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                />
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>7:00-8:00 PM</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                />
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>Online Class</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: RfH(25) }}>
          <Text style={{ color: Colors.darktitle, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Tutors By Subjects</Text>
        </View>
        {renderSubjects()}
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: RfH(25) }}>
          <Text style={{ color: Colors.darktitle, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Favourite Tutors</Text>
          <Text style={{ color: Colors.primaryButtonBackground, fontSize: 10 }}>View All</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favouriteTutor}
          renderItem={({ item }) => renderTutors(item)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: RfH(25) }}>
          <Text style={{ color: Colors.darktitle, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Recommended Tutors</Text>
        </View>
        <View style={{ height: RfH(92), backgroundColor: 'rgb(230,252,231)', borderRadius: 8, marginTop: RfH(20) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: RfH(13),
              marginRight: RfW(16),
            }}>
            <View style={{ flex: 0.3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
            </View>
            <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="FontAwesome"
                    name="star"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.darktitle, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>3 years of Experience</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 20, marginRight: RfW(8), color: Colors.inputLabel }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(92), backgroundColor: 'rgb(231,229,242)', borderRadius: 8, marginTop: RfH(20) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: RfH(13),
              marginRight: RfW(16),
            }}>
            <View style={{ flex: 0.3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
            </View>
            <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Tushar Das</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="FontAwesome"
                    name="star"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.darktitle, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>3 years of Experience</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="AntDesign"
                    name="home"
                    style={{ fontSize: 18, marginRight: RfW(8), color: Colors.inputLabel }}
                  />
                  <Icon
                    type="MaterialIcons"
                    name="computer"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.inputLabel }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(92), backgroundColor: 'rgb(255,247,240)', borderRadius: 8, marginTop: RfH(20) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: RfH(13),
              marginRight: RfW(16),
            }}>
            <View style={{ flex: 0.3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
            </View>
            <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="FontAwesome"
                    name="star"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.primaryButtonBackground }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.darktitle, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>3 years of Experience</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.inputLabel, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 20, marginRight: RfW(8), color: Colors.inputLabel }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default dashboard;
