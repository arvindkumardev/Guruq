/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import { FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Item, Thumbnail } from 'native-base';
import Swiper from 'react-native-swiper';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { IconButtonWrapper } from '../../../../components';
import { userDetails } from '../../../../apollo/cache';
import NavigationRouteNames from '../../../../routes/screenNames';
import Fonts from '../../../../theme/fonts';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import StudentOfferingModal from './studentOfferingModal';
import SubjectsModal from './subjectsModal';
import { GET_INTERESTED_OFFERINGS, GET_OFFERINGS_MASTER_DATA } from '../../dashboard-query';
import { MARK_INTERESTED_OFFERING_SELECTED } from '../../dashboard-mutation';
import Loader from '../../../../components/Loader';

function StudentDashboard(props) {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const { refetchStudentOfferings } = props;

  const [studentOfferingModalVisible, setStudentOfferingModalVisible] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState({});

  const [favouriteTutor, setFavouriteTutor] = useState([
    { name: 'Ritesh Jain', subject: 'English, Maths', imageUrl: '' },
    { name: 'Simran Rai', subject: 'Chemistry', imageUrl: '' },
    { name: 'Priyam', subject: 'Maths', imageUrl: '' },
  ]);

  const { loading: loadingOfferingMasterData, error: offeringMasterError, data: offeringMasterData } = useQuery(
    GET_OFFERINGS_MASTER_DATA
  );

  const { loading: loadingOfferings, error: offeringError, data: offerings, refetch: _refetchOffering } = useQuery(
    GET_INTERESTED_OFFERINGS
  );
  const refetchOffering = (args) => _refetchOffering(args);

  const [markInterestedOffering] = useMutation(MARK_INTERESTED_OFFERING_SELECTED, {
    fetchPolicy: 'no-cache',

    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      }
    },
    onCompleted: (data) => {
      if (data) {
        if (refetchOffering) {
          refetchOffering({ fetchPolicy: 'network-only' });
        }
      }
    },
  });

  useEffect(() => {
    console.log(offeringError);
    if (offeringError && offeringError.graphQLErrors && offeringError.graphQLErrors.length > 0) {
      navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
    }
  }, [offeringError]);

  useEffect(() => {
    console.log(offerings);

    if (offerings && offerings.getInterestedOfferings.length > 0) {
      const selectedOffering = offerings.getInterestedOfferings.find((s) => s.selected);
      setSelectedOffering(selectedOffering ? selectedOffering.offering : {});
    } else if (!loadingOfferings && offerings.getInterestedOfferings.length === 0) {
      navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
    }
  }, [offerings]);

  const onOfferingSelect = (offering) => {
    setStudentOfferingModalVisible(false);

    setSelectedOffering(offering);

    console.log('offering selected', offering);

    // call mutation
    markInterestedOffering({ variables: { offeringId: offering.id } });

    // refetchOffering();
  };

  useEffect(() => {
    if (refetchOffering) {
      refetchOffering({ fetchPolicy: 'network-only' });
    }
    // console.log('refetchStudentOfferings', refetchStudentOfferings);
  }, [refetchStudentOfferings]);

  useEffect(() => {
    // refetch everything

    console.log('selectedOffering updated', selectedOffering);
  }, [selectedOffering]);

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const renderSubjects = (item) => {
    return (
      <View style={{ marginTop: RfH(20), flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => gotoTutors(item)}
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                item.id % 4 === 0
                  ? '#E7E5F2'
                  : item.id % 4 === 1
                  ? '#FFF7F0'
                  : item.id % 4 === 2
                  ? 'rgb(230,252,231)'
                  : 'rgb(203,231,255)',
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
            {item.displayName}
          </Text>
        </TouchableWithoutFeedback>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('Physics')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
        </View> */}

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: RfH(20),
          }}>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
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
          </TouchableWithoutFeedback>
        </View> */}
      </View>
    );
  };

  const subjectModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={showAllSubjects}
        onRequestClose={() => {
          setShowAllSubjects(false);
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
              paddingTop: RfH(16),
            }}>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={commonStyles.titleText}>All Subjects</Text>
              <IconButtonWrapper
                iconHeight={RfH(24)}
                iconWidth={RfW(24)}
                styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
                iconImage={Images.cross}
                submitFunction={() => setShowAllSubjects(false)}
              />
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={
                offeringMasterData &&
                offeringMasterData.offerings &&
                offeringMasterData.offerings.edges &&
                offeringMasterData.offerings.edges.filter((s) => s?.parentOffering?.id === selectedOffering?.id)
              }
              renderItem={({ item }) => renderSubjects(item)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(34) }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderTutors = (item) => {
    return (
      <View
        style={{
          width: RfW(109),
          borderRadius: 8,
          backgroundColor: 'rgb(245,245,245)',
          marginHorizontal: RfW(10),
          marginTop: RfH(20),
        }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Thumbnail large style={{ marginTop: RfH(11) }} source={Images.kushal} />
          <Text style={{ marginTop: 1, color: Colors.primaryText }}>{item.name}</Text>
          <Text style={{ marginTop: 1, color: Colors.secondaryText, fontSize: 12, marginBottom: RfH(16) }}>
            {item.subject}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <Loader isLoading={loadingOfferingMasterData || loadingOfferings} />

      <View style={[commonStyles.mainContainer]}>
        <View style={{ height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {selectedOffering && (
              <Text style={{ color: Colors.primaryText, fontSize: 17, marginTop: RfH(4) }}>
                {selectedOffering?.parentOffering?.displayName} - {selectedOffering?.displayName}
              </Text>
            )}

            <TouchableOpacity onPress={() => setStudentOfferingModalVisible(true)}>
              <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => {}}>
              <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 54,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{ fontFamily: Fonts.bold, fontSize: 34, color: Colors.primaryText }}>
                Hi {userInfo.firstName}
              </Text>
              {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}> */}
              {/*  <Text style={{ color: Colors.darkGrey, fontSize: 16, marginTop: RfH(4) }}>CBSE Class 9</Text> */}
              {/*  <TouchableOpacity onPress={() => setStudyAreaModalVisible(true)}> */}
              {/*    /!* <Icon *!/ */}
              {/*    /!*  type="MaterialIcons" *!/ */}
              {/*    /!*  name="keyboard-arrow-down" *!/ */}
              {/*    /!*  style={{ marginTop: RfH(8), marginLeft: RfW(4), color: Colors.secondaryText }} *!/ */}
              {/*    /!* /> *!/ */}
              {/*    <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} /> */}
              {/*  </TouchableOpacity> */}
              {/* </View> */}
            </View>
            <View>
              <Image
                source={Images.user}
                style={{
                  height: RfH(32),
                  width: RfW(32),
                  borderTopLeftRadius: RfH(32),
                  borderTopRightRadius: RfH(32),
                  borderBottomLeftRadius: RfH(32),
                  borderBottomRightRadius: RfH(32),
                }}
              />
            </View>
          </View>
          <View style={{ height: 44 }}>
            <Item
              style={{
                backgroundColor: '#F3F4F9',
                borderRadius: 10,
                paddingHorizontal: RfW(10),
                borderColor: 'transparent',
                height: RfH(36),
                marginTop: 4,
                marginBottom: 4,
              }}>
              <Icon type="MaterialIcons" name="search" style={{ color: Colors.brandBlue2 }} />
              <Input placeholder="Search" />
            </Item>
          </View>

          <View style={{ height: RfH(220), marginTop: RfH(29) }}>
            <Swiper horizontal>
              <View>
                <View style={{ height: RfH(185), backgroundColor: '#ceecfe', borderRadius: 20 }}>
                  <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(317)} iconImage={Images.dash_img} />
                </View>
              </View>
            </Swiper>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>Upcoming Classes</Text>
            <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.RATE_AND_REVIEW)}>
              <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>View All</Text>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              backgroundColor: '#ceecfe',
              borderRadius: 20,
              marginTop: RfH(20),
              padding: 16,
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <View style={{ flex: 0.3 }}>
                <Image style={{ height: RfH(88), width: RfW(78), zIndex: 5, borderRadius: 8 }} source={Images.kushal} />
              </View>
              <View
                style={{
                  flex: 0.7,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                }}>
                <Text style={{ fontSize: 16, color: Colors.primaryText, fontFamily: Fonts.semiBold }}>
                  Science by Rahul Das
                </Text>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>CBSE Class 9</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Icon
                    type="FontAwesome"
                    name="calendar-o"
                    style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    Sunday , June 10{' '}
                  </Text>
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
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: RfH(25),
            }}>
            <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>Tutors By Subjects</Text>
            <TouchableWithoutFeedback onPress={() => setShowAllSubjects(true)}>
              <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>View All</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={
                offeringMasterData &&
                offeringMasterData.offerings &&
                offeringMasterData.offerings.edges &&
                offeringMasterData.offerings.edges
                  .filter((s) => s?.parentOffering?.id === selectedOffering?.id)
                  .slice(0, 8)
              }
              renderItem={({ item }) => renderSubjects(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: RfH(25),
            }}>
            <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>Favourite Tutors</Text>
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
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              marginTop: RfH(25),
            }}>
            <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>Recommended Tutors</Text>
          </View>
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(230,252,231)',
              borderRadius: 8,
              marginTop: RfH(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingVertical: RfH(13),
                marginRight: RfW(16),
              }}>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
              </View>
              <View
                style={{
                  flex: 0.7,
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      type="FontAwesome"
                      name="star"
                      style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: Colors.primaryText,
                        fontWeight: '600',
                      }}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
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
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(231,229,242)',
              borderRadius: 8,
              marginTop: RfH(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingVertical: RfH(13),
                marginRight: RfW(16),
              }}>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
              </View>
              <View
                style={{
                  flex: 0.7,
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Tushar Das</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      type="FontAwesome"
                      name="star"
                      style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: Colors.primaryText,
                        fontWeight: '600',
                      }}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
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
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(255,247,240)',
              borderRadius: 8,
              marginTop: RfH(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingVertical: RfH(13),
                marginRight: RfW(16),
              }}>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
              </View>
              <View
                style={{
                  flex: 0.7,
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      type="FontAwesome"
                      name="star"
                      style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: Colors.primaryText,
                        fontWeight: '600',
                      }}>
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
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
          <View style={{ marginTop: RfH(16) }}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: 0,
                height: 0,
                borderBottomWidth: 13,
                borderBottomColor: 'transparent',
                borderLeftWidth: 55,
                borderLeftColor: Colors.lightBlue,
                borderRightWidth: 55,
                borderRightColor: Colors.lightBlue,
              }}
            />
          </View>
        </ScrollView>
        {subjectModal()}
      </View>

      <StudentOfferingModal
        onClose={setStudentOfferingModalVisible}
        visible={studentOfferingModalVisible}
        onSelect={onOfferingSelect}
        offerings={offerings && offerings.getInterestedOfferings}
      />
      {/* <SubjectsModal
        onClose={setShowAllSubjects(false)}
        visible={showAllSubjects}
        subjects={
          offeringMasterData &&
          offeringMasterData.offerings &&
          offeringMasterData.offerings.edges &&
          offeringMasterData.offerings.edges.filter((s) => s?.parentOffering?.id === selectedOffering?.id)
        }
      /> */}
    </>
  );
}

StudentDashboard.propTypes = {
  refetchStudentOfferings: PropTypes.bool,
};

StudentDashboard.defaultProps = {
  refetchStudentOfferings: false,
};

export default StudentDashboard;
