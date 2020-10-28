/* eslint-disable no-plusplus */
import { FlatList, Image, ScrollView, StatusBar, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Icon, Input, Item, Thumbnail } from 'native-base';
import Swiper from 'react-native-swiper';
import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { IconButtonWrapper, CustomRadioButton } from '../../../../components';
import { userDetails } from '../../../../apollo/cache';
import NavigationRouteNames from '../../../../routes/screenNames';

function StudentDashboard() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  const [studyAreaModalVisible, setStudyAreaModalVisible] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const [favouriteTutor, setFavouriteTutor] = useState([
    { name: 'Ritesh Jain', subject: 'English, Maths', imageUrl: '' },
    { name: 'Simran Rai', subject: 'Chemistry', imageUrl: '' },
    { name: 'Priyam', subject: 'Maths', imageUrl: '' },
  ]);

  const [studyArea, setStudyArea] = useState([
    { name: 'CBSE, Class 6', checked: true },
    { name: 'IIT-JEE Foundation', checked: false },
    { name: 'NEET', checked: false },
  ]);

  // useEffect(() => {
  //  if (userInfo && userInfo.isFirstTime) {
  //    navigation.navigate(routeNames.STUDENT.STUDY_AREA);
  //  }
  // }, [userInfo]);

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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Maths
            </Text>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
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
          <Text style={{ marginTop: 1, color: Colors.primaryText }}>{item.name}</Text>
          <Text style={{ marginTop: 1, color: Colors.secondaryText, fontSize: 12 }}>{item.subject}</Text>
        </View>
      </View>
    );
  };

  const setChecked = (item, index) => {
    const studyArr = studyArea;
    for (let i = 0; i < studyArr.length; i++) {
      studyArr[i].checked = false;
    }
    studyArr[index].checked = !studyArr[index].checked;
    setStudyArea(studyArr);
    setRefreshList(!refreshList);
  };

  const renderItem = (item, index, showSeparator) => {
    return (
      <View style={{ paddingLeft: RfW(16), marginTop: RfH(24) }}>
        <View style={{ flexDirection: 'row' }}>
          <CustomRadioButton enabled={item.checked} submitFunction={() => setChecked(item, index)} />
          <Text style={{ color: Colors.inputLabel, marginLeft: RfW(8) }}>{item.name}</Text>
        </View>
        {showSeparator && <View style={commonStyles.lineSeparator} />}
      </View>
    );
  };

  const addStudyArea = () => {
    setStudyAreaModalVisible(false);
    navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
  };

  const showStudyAreaModel = () => {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={studyAreaModalVisible}
        onRequestClose={() => {
          setStudyAreaModalVisible(false);
        }}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
          <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
          <View
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              position: 'absolute',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              backgroundColor: Colors.white,
              paddingHorizontal: RfW(16),
              paddingVertical: RfW(16),
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: RfW(16) }}>Choose your study area</Text>
              <TouchableWithoutFeedback onPress={() => setStudyAreaModalVisible(false)}>
                <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
              </TouchableWithoutFeedback>
            </View>
            <FlatList
              data={studyArea}
              extraData={refreshList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderItem(item, index, studyArea.length - 1 > index)}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginBottom: RfH(40) }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginBottom: RfH(24),
              }}>
              <Button block style={{ flex: 0.5, backgroundColor: Colors.brandBlue2, marginRight: RfW(4) }}>
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '600' }}>Select</Text>
              </Button>
              <Button
                bordered
                style={{ flex: 0.5, borderColor: Colors.brandBlue2, justifyContent: 'center', marginLeft: RfW(4) }}
                onPress={() => addStudyArea()}>
                <Text style={{ color: Colors.brandBlue2, fontSize: 16, fontWeight: '600' }}>Add study area</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView>
      <StatusBar barStyle="dark-content" />
      <View style={[commonStyles.mainContainer]}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: RfH(0) }}>
          <View style={{ flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
            <Text style={{ fontFamily: 'SegoeUI-Semibold', fontSize: 28, color: Colors.primaryText }}>
              Hi {userInfo.firstName}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={{ color: Colors.darkGrey, fontSize: 16, marginTop: RfH(4) }}>CBSE Class 9</Text>
              <TouchableOpacity onPress={() => setStudyAreaModalVisible(true)}>
                {/* <Icon */}
                {/*  type="MaterialIcons" */}
                {/*  name="keyboard-arrow-down" */}
                {/*  style={{ marginTop: RfH(8), marginLeft: RfW(4), color: Colors.secondaryText }} */}
                {/* /> */}
                <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 0.1, marginRight: RfW(16) }}>
            <Image
              source={Images.user}
              style={{ height: RfH(48), width: RfW(48), borderRadius: 12, marginBottom: RfH(8) }}
            />
          </View>
        </View>
        <View style={{ marginTop: RfW(16) }}>
          <Item
            style={{
              backgroundColor: '#F3F4F9',
              borderRadius: 10,
              paddingHorizontal: RfW(10),
              borderColor: 'transparent',
              height: RfH(48),
            }}>
            <Icon type="MaterialIcons" name="search" style={{ color: Colors.brandBlue2 }} />
            <Input placeholder="Search" />
          </Item>
        </View>

        <View style={{ height: RfH(210), marginTop: RfH(29) }}>
          <Swiper horizontal>
            <View>
              <View style={{ height: RfH(170), backgroundColor: '#ceecfe', borderRadius: 20 }} />
            </View>
            <View>
              <View style={{ height: RfH(170), backgroundColor: '#ceecfe', borderRadius: 20 }} />
            </View>
          </Swiper>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ color: Colors.primaryText, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Upcoming Classes</Text>
          <Text style={{ color: Colors.brandBlue2, fontSize: 10 }}>View All</Text>
        </View>
        <View
          style={{ height: RfH(140), backgroundColor: '#ceecfe', borderRadius: 20, marginTop: RfH(20), padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <View style={{ flex: 0.3 }}>
              <Image style={{ height: RfH(88), width: RfW(78), zIndex: 5, borderRadius: 8 }} source={Images.kushal} />
            </View>
            <View style={{ flex: 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
              <Text style={{ fontSize: 16, color: Colors.primaryText, fontFamily: 'SegoeUI-Semibold' }}>
                Science by Rahul Das
              </Text>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>CBSE Class 9</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="calendar-o"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                />
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>Sunday , June 10 </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="Feather"
                  name="clock"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                />
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>7:00-8:00 PM</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                />
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>Online Class</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: RfH(25) }}>
          <Text style={{ color: Colors.primaryText, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>
            Tutors By Subjects
          </Text>
        </View>
        {renderSubjects()}
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: RfH(25) }}>
          <Text style={{ color: Colors.primaryText, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>Favourite Tutors</Text>
          <Text style={{ color: Colors.brandBlue2, fontSize: 10 }}>View All</Text>
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
          <Text style={{ color: Colors.primaryText, fontFamily: 'SegoeUI-Bold', fontSize: 20 }}>
            Recommended Tutors
          </Text>
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
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.primaryText, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                3 years of Experience
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
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
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.primaryText, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                3 years of Experience
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="AntDesign"
                    name="home"
                    style={{ fontSize: 18, marginRight: RfW(8), color: Colors.secondaryText }}
                  />
                  <Icon
                    type="MaterialIcons"
                    name="computer"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
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
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ alignSelf: 'center', color: Colors.primaryText, fontWeight: '600' }}>4.5</Text>
                </View>
              </View>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                3 years of Experience
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  English, Maths , Science
                </Text>
                <Icon
                  type="MaterialIcons"
                  name="computer"
                  style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      {showStudyAreaModel()}
    </ScrollView>
  );
}

export default StudentDashboard;
