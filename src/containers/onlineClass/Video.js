import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RtcEngine, {
  AudioProfile,
  AudioScenario,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import moment from 'moment';
import { isEmpty } from 'lodash';
import BackArrow from '../../components/BackArrow';
import IconButtonWrapper from '../../components/IconWrapper';
import { Colors } from '../../theme';
import Images from '../../theme/images';
import commonStyles from '../../theme/styles';
import { alertBox, deviceWidth, printDate, printDateTime, printTime, RfH, RfW } from '../../utils/helpers';
import MeetingDetailsModal from './components/meetingDetailsModal';
import requestCameraAndAudioPermission from './components/permission';
import styles from './components/style';
import VideoMessagingModal from './components/videoMessagingModal';
import VideoMoreAction from './components/videoMoreAction';
import Whiteboard from './components/whiteboard';
import { UserTypeEnum } from '../../common/userType.enum';

interface Props {}

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
  joinSucceed: boolean;
  peerIds: number[];
  currentUserId: '';
  audioMuted: false;
  speakerPhoneEnabled: false;
  videoMuted: false;
  audioStates: [];
  videoStates: [];
  previewVideo: true;
  showDetailedActions: true;
  selectedUid: '';
  showClassDetails: false;
  showMessageBox: false;
  showMoreActions: false;

  whiteboardEnabled: false;
  videoQuality: string;
  messageCount: number;
}

// const appId = '20be4eff902f4d9ea78c2f8c168556cd';

export default class Video extends Component<Props, State> {
  _engine: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      joinSucceed: false,
      peerIds: [],
      currentUserId: '',
      audioMuted: false,
      speakerPhoneEnabled: false,
      videoMuted: false,
      audioStates: [],
      videoStates: [],
      previewVideo: true,

      showDetailedActions: true,
      selectedUid: '',

      showClassDetails: false,
      showMessageBox: false,
      showMoreActions: false,

      whiteboardEnabled: false,

      videoQuality: 'high',
      messageCount: 0,
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.init();
  }

  componentDidMount() {
    console.log('starting video');
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    console.log('stopping video');
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._engine?.leaveChannel().then(() => {
      this.setState({ peerIds: [], joinSucceed: false });
      // this.startCall();
    });
  }

  backAction = () => {
    if (this.state.joinSucceed) {
      this.endCall();
      return true;
    }
    return false;
  };

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    console.log('this.props.meetingDetails', this.props.meetingDetails);
    console.log('this.props.meetingDetails.appId', this.props.meetingDetails.appId);
    this._engine = await RtcEngine.create(this.props.meetingDetails.appId);
    await this._engine.enableVideo();
    await this._engine.setAudioProfile(AudioProfile.Default, AudioScenario.Education);

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('RemoteAudioStateChanged', (uid, state, reason, elapsed) => {
      console.log('RemoteAudioStateChanged', uid, state);

      this.setState({
        audioStates: [...this.state.audioStates.filter((s) => s.uid !== uid), { uid, status: state > 0 }],
      });

      console.log(this.state.audioStates);
    });

    this._engine.addListener('RemoteVideoStateChanged', (uid, state, reason, elapsed) => {
      console.log('RemoteVideoStateChanged', uid, state);

      this.setState({
        videoStates: [...this.state.videoStates.filter((s) => s.uid !== uid), { uid, status: state > 0 }],
      });

      console.log(this.state.videoStates);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIds } = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
          selectedUid: uid,
        });
      }

      this.setState({ currentUserId: uid });
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;

      const newPs = peerIds.filter((id) => id !== uid);
      this.setState({
        // Remove peer ID from state array
        peerIds: newPs,
        selectedUid: newPs.length > 0 ? newPs[0] : '',
      });

      this.setState({ currentUserId: '' });
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });

    // await this._engine?.joinChannel(this.props.token, this.props.channelName, null, 0);
    await this._engine.startPreview();

    // console.log(await this._engine.getUserInfoByUid(10));
  };

  togglePreview = async () => {
    if (this.state.previewVideo) {
      await this._engine.stopPreview();
    } else {
      await this._engine.startPreview();
    }
    this.setState({ videoMuted: !this.state.videoMuted });
    this.setState({ previewVideo: !this.state.previewVideo });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    console.log('state', this.state);
    console.log('this.props', this.props);
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      this.props.meetingDetails.token,
      this.props.meetingDetails.channel,
      null,
      this.props.userInfo.id
    );

    // console.log(await this._engine.getUserInfoByUid(10));
    // console.log(await this._engine.getUserInfoByUid(11));
    // console.log(await this._engine.getCallId());
  };

  callEndedHandle = () => {
    alertBox('Do you really want to end the session?', '', {
      positiveText: 'Yes',
      onPositiveClick: async () => {
        await this._engine?.leaveChannel();
        this.setState({ peerIds: [], joinSucceed: false });
        this.props.onCallEnd(true);
      },
      negativeText: 'No',
    });
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    this.callEndedHandle();
  };

  switchCamera = async () => {
    await this._engine?.switchCamera();

    // await this._engine.setEnableSpeakerphone(true);
  };

  toggleSpeakerPhone = async () => {
    const speakerState = !this.state.speakerPhoneEnabled;

    this.setState({ speakerPhoneEnabled: speakerState });

    await this._engine.setEnableSpeakerphone(speakerState);
  };

  audioToggle = async () => {
    console.log('toggle audio', this.state.audioMuted, this.state.currentUserId);

    // console.log(await this._engine.getUserInfoByUid(10));
    // console.log(await this._engine.getUserInfoByUid(11));
    // console.log(await this._engine.getCallId());

    const newState = !this.state.audioMuted;
    // await this._engine.muteRemoteAudioStream(this.state.currentUserId, newState);
    await this._engine.muteLocalAudioStream(newState);

    this.setState({ audioMuted: newState });
  };

  videoToggle = async () => {
    console.log('toggle video', this.state.videoMuted, this.state.currentUserId);

    const newState = !this.state.videoMuted;
    // await this._engine.muteRemoteVideoStream(this.state.currentUserId, newState);
    await this._engine.muteLocalVideoStream(newState);

    this.setState({ videoMuted: newState });
  };

  onBackPress = () => {
    this.props.onCallEnd(false);
  };

  toggleDetailedActions = async () => {
    this.setState({ showDetailedActions: !this.state.showDetailedActions });
  };

  toggleMessageBox = () => {
    this.setState({ showMessageBox: !this.state.showMessageBox });
    this.setState({ messageCount: 0 });
  };

  toggleClassDetails = () => {
    this.setState({ showClassDetails: !this.state.showClassDetails });
  };

  toggleMoreAction = () => {
    this.setState({ showMoreActions: !this.state.showMoreActions });
  };

  toggleWhiteboard = (show) => {
    this.setState({ whiteboardEnabled: show });

    if (show && this.state.peerIds.length > 0) {
      this.setState({ selectedUid: ' ' });
    }

    if (!show && this.state.peerIds && this.state.peerIds.length > 0) {
      this.setState({ selectedUid: this.state.peerIds[0] });
    }
  };

  messageReceived = () => {
    this.setState({ messageCount: this.state.messageCount + 1 });
  };

  getParticipant = (id) => {
    const participants = [
      ...this.props.meetingDetails.guests,
      this.props.meetingDetails.host,
      {
        firstName: 'Screen',
        lastName: 'Share',
        id: this.props.meetingDetails.shareId,
      },
    ];

    console.log('participants', participants, id);

    return participants.find((p) => p.id === id);
  };

  changeVideoStreamType = (type) => {
    this.setState({ videoQuality: type });

    this._engine.enableDualStreamMode(type === 'low');
    for (const peerId of this.state.peerIds) {
      this._engine.setRemoteVideoStreamType(peerId, type === 'high' ? 0 : 1);
    }
  };

  changeSelectedVideo = (value) => {
    this.toggleWhiteboard(false);
    this.setState({ selectedUid: value });
  };

  _renderVideos = () => {
    return (
      <View style={[styles.fullView, { backgroundColor: '#222222' }]}>
        {/* <View style={[commonStyles.blankViewSmall, { height: 44 }]} /> */}

        {this.state.showDetailedActions && (
          <View
            style={[
              commonStyles.regularPrimaryText,
              {
                paddingTop: Platform.OS === 'ios' ? RfH(44) : RfH(10),
                // marginTop: 16,
                color: Colors.white,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                top: 0,
                zIndex: 2,
                backgroundColor: Colors.brandBlue2,
              },
            ]}>
            <TouchableWithoutFeedback onPress={this.toggleClassDetails}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <IconButtonWrapper iconImage={Images.arrow_down} iconWidth={RfW(20)} iconHeight={RfH(20)} />
                <Text
                  style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8), color: Colors.white }]}
                  numberOfLines={1}>
                  {this.props.meetingDetails?.title} | {this.props.meetingDetails?.description}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginLeft: RfW(24),
              }}>
              <TouchableWithoutFeedback onPress={this.switchCamera}>
                <View
                  style={{
                    width: RfH(44),
                    height: RfH(44),
                    // borderRadius: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper
                    iconImage={Images.camera_switch}
                    iconWidth={RfW(24)}
                    iconHeight={RfH(24)}
                    imageResizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.toggleSpeakerPhone}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    // backgroundColor: '#222222',
                    // borderRadius: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: RfW(8),
                  }}>
                  <IconButtonWrapper
                    iconImage={this.state.speakerPhoneEnabled ? Images.speaker_enabled : Images.speaker}
                    iconWidth={RfW(24)}
                    iconHeight={RfH(24)}
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.endCall}>
                <View
                  style={{
                    // width: 44,
                    height: 24,
                    // backgroundColor: '#222222',
                    paddingHorizontal: 8,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.orangeRed,
                    marginLeft: RfW(16),
                  }}>
                  <Text
                    style={[
                      commonStyles.headingPrimaryText,
                      {
                        fontSize: 15,
                        color: Colors.white,
                      },
                    ]}>
                    End
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {this.state.showDetailedActions && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
              paddingBottom: 34,
              paddingTop: 8,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
              backgroundColor: Colors.brandBlue2,
            }}>
            <View
              style={{
                flex: 1,
                height: 54,
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-evenly',
              }}>
              <TouchableWithoutFeedback onPress={this.videoToggle}>
                <View
                  style={{
                    flex: 1,
                    // width: 48,
                    // flex:1,
                    height: 54,
                    // backgroundColor: this.state.videoMuted ? Colors.white : '#444444',
                    // borderRadius: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper
                    iconImage={this.state.videoMuted ? Images.video_call_mute_white : Images.video_call}
                    iconWidth={RfW(24)}
                    iconHeight={RfH(24)}
                  />
                  <Text
                    style={[
                      commonStyles.smallPrimaryText,
                      {
                        marginTop: RfH(8),
                        color: Colors.white,
                      },
                    ]}>
                    {this.state.videoMuted ? 'Start Video' : 'Stop Video'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.audioToggle}>
                <View
                  style={{
                    // width: 48,
                    flex: 1,
                    height: 54,
                    // backgroundColor: this.state.audioMuted ? Colors.white : '#444444',
                    // borderRadius: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper
                    iconImage={this.state.audioMuted ? Images.microphone_mute_white : Images.microphone}
                    iconWidth={RfW(24)}
                    iconHeight={RfH(24)}
                  />
                  <Text
                    style={[
                      commonStyles.smallPrimaryText,
                      {
                        marginTop: RfH(8),
                        color: Colors.white,
                      },
                    ]}>
                    {this.state.audioMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => this.toggleWhiteboard(!this.state.whiteboardEnabled)}>
                <View
                  style={{
                    // width: 60,
                    flex: 1,
                    height: 54,
                    // backgroundColor: Colors.orangeRed,
                    // borderRadius: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // paddingBottom: 8,
                  }}>
                  <IconButtonWrapper iconImage={Images.whiteboard} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                  <Text
                    style={[
                      commonStyles.smallPrimaryText,
                      {
                        marginTop: RfH(8),
                        color: Colors.white,
                      },
                    ]}>
                    Whiteboard
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.toggleMessageBox}>
                <View
                  style={{
                    // width: 48,
                    flex: 1,
                    height: 54,
                    // backgroundColor: '#444444',
                    // borderRadius: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper iconImage={Images.messaging_white} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                  {this.state.messageCount > 0 && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: Colors.orangeRed,
                        position: 'absolute',
                        top: 0,
                        right: 20,
                        borderRadius: 10,
                      }}
                    />
                  )}
                  <Text
                    style={[
                      commonStyles.smallPrimaryText,
                      {
                        marginTop: RfH(8),
                        color: Colors.white,
                      },
                    ]}>
                    Messaging
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.toggleMoreAction}>
                <View
                  style={{
                    // width: 48,
                    flex: 1,
                    height: 54,
                    // backgroundColor: '#444444',
                    // borderRadius: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper iconImage={Images.vertical_dots} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                  <Text
                    style={[
                      commonStyles.smallPrimaryText,
                      {
                        marginTop: RfH(8),
                        color: Colors.white,
                      },
                    ]}>
                    More
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {this.state.peerIds.length > 0 && this._renderRemoteVideos()}
        {this.state.peerIds.length > 0 && this._renderRemoteVideo()}

        {this.state.peerIds.length === 0 && (
          <View
            style={{
              paddingHorizontal: RfW(16),
              position: 'absolute',
              bottom: '40%',
              left: 0,
              right: 0,
              zIndex: 2,
            }}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                {
                  color: Colors.white,
                  fontSize: 20,
                  marginBottom: 16,
                },
              ]}>
              You're the only one here
            </Text>
            <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>
              Please wait for other members to join the session.
            </Text>
          </View>
        )}

        <MeetingDetailsModal
          visible={this.state.showClassDetails}
          onClose={this.toggleClassDetails}
          meetingDetails={this.props.meetingDetails}
        />
        {this.props.channelName && (
          <VideoMessagingModal
            visible={this.state.showMessageBox}
            onClose={this.toggleMessageBox}
            channelName={this.props.meetingDetails.channel}
            callbacks={{
              showWhiteboardCallback: () => this.toggleWhiteboard(true),
              hideWhiteboardCallback: () => this.toggleWhiteboard(false),
              onToggleWhiteboard: this.state.whiteboardEnabled,
              isHost: this.props.userInfo.type === UserTypeEnum.TUTOR.label,
              messageReceived: () => this.messageReceived(),
            }}
          />
        )}
        <VideoMoreAction
          visible={this.state.showMoreActions}
          onClose={this.toggleMoreAction}
          setVideoQuality={this.changeVideoStreamType}
          videoQuality={this.state.videoQuality}
        />
      </View>
    );
  };

  _renderVideoMutedView = (firstName, remote = false, selected = false) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: selected ? '#222222' : '#444444',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: RfH(selected ? 100 : 60),
            width: RfW(selected ? 100 : 60),
            borderRadius: 100,
            backgroundColor: Colors.lightBlue,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Text style={{ color: Colors.primaryText, fontSize: selected ? 48 : 36 }}>{firstName && firstName[0]}</Text>
        </View>
        <Text style={[commonStyles.mediumPrimaryText, { color: Colors.white }]}>{firstName}</Text>
      </View>
    );
  };

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView
        style={[styles.remoteContainer, { bottom: this.state.showDetailedActions ? 100 : 44 }]}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.toggleDetailedActions}
          style={{ flex: 1, width: 100, height: 120, marginHorizontal: RfW(8) }}>
          {!this.state.videoMuted ? (
            <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={this.props.meetingDetails.channel}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: '#444444',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: RfH(60),
                  width: RfW(60),
                  borderRadius: 60,
                  backgroundColor: Colors.lightBlue,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.primaryText,
                    fontSize: 36,
                  }}>
                  {this.props.userInfo.firstName[0]}
                </Text>
              </View>
              <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>
                {this.props.userInfo.firstName}
              </Text>
            </View>
          )}

          {this.state.audioMuted && (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}>
              <IconButtonWrapper iconImage={Images.microphone_mute_white} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </View>
          )}
        </TouchableOpacity>

        {peerIds
          .filter((uid) => uid !== this.state.selectedUid)
          .map((value, index, array) => {
            const audioItem = this.state.audioStates.find((s) => s.uid === value);
            const videoItem = this.state.videoStates.find((s) => s.uid === value);

            const participant = this.getParticipant(value);

            console.log('videoItem', videoItem, peerIds, participant);
            return (
              <View style={{ flex: 1, marginRight: RfW(8) }}>
                <TouchableWithoutFeedback onPress={() => this.changeSelectedVideo(value)}>
                  <View style={{ width: 100, height: 120 }}>
                    {videoItem &&
                    videoItem.status &&
                    participant.firstName !== 'Screen' &&
                    participant.lastName !== 'Share' ? (
                      <RtcRemoteView.SurfaceView
                        style={[{ flex: 1, width: 100, height: 120 }]}
                        uid={value}
                        channelId={this.props.meetingDetails.channel}
                        renderMode={
                          participant.firstName === 'Screen' && participant.lastName === 'Share'
                            ? VideoRenderMode.Fit
                            : VideoRenderMode.Hidden
                        }
                        zOrderMediaOverlay
                      />
                    ) : (
                      this._renderVideoMutedView(participant?.firstName, true)
                    )}
                  </View>
                </TouchableWithoutFeedback>
                {audioItem && !audioItem.status && (
                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      // bottom: 8,
                      right: 8,
                      zIndex: 2,
                    }}>
                    <IconButtonWrapper
                      iconImage={Images.microphone_mute_white}
                      iconWidth={RfW(24)}
                      iconHeight={RfH(24)}
                    />
                  </View>
                )}
              </View>
            );
          })}
      </ScrollView>
    );
  };

  _renderRemoteVideo = () => {
    const { peerIds, selectedUid } = this.state;

    // const value = selectedUid;
    const audioItem = this.state.audioStates.find((s) => s.uid === this.state.selectedUid);
    const videoItem = this.state.videoStates.find((s) => s.uid === this.state.selectedUid);

    const participant = this.getParticipant(this.state.selectedUid);

    console.log('videoItem _renderRemoteVideo', this.state.selectedUid, videoItem, peerIds);

    return (
      <>
        {selectedUid && (
          <View style={[styles.fullView, { position: 'absolute', top: 0 }]}>
            {this.state.whiteboardEnabled ? (
              <Whiteboard uuid={this.props.meetingDetails.channel} />
            ) : (
              <TouchableWithoutFeedback onPress={this.toggleDetailedActions}>
                {videoItem && videoItem.status ? (
                  <RtcRemoteView.SurfaceView
                    // style={styles.remyesote}
                    style={[styles.max, { borderRadius: 20 }]}
                    uid={selectedUid}
                    channelId={this.props.meetingDetails.channel}
                    renderMode={
                      participant.firstName === 'Screen' && participant.lastName === 'Share'
                        ? VideoRenderMode.Fit
                        : VideoRenderMode.Hidden
                    }
                    zOrderMediaOverlay={false}
                  />
                ) : (
                  this._renderVideoMutedView(participant?.firstName, false, true)
                )}
              </TouchableWithoutFeedback>
            )}
            {audioItem && !audioItem.status && (
              <View
                style={
                  this.state.peerIds.length <= 1
                    ? {
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: this.state.showDetailedActions ? 120 : 44,
                        left: 16,
                        zIndex: 1,
                      }
                    : {
                        flexDirection: 'row',
                        position: 'absolute',
                        top: this.state.showDetailedActions ? 120 : 60,
                        left: 16,
                        zIndex: 1,
                      }
                }>
                <IconButtonWrapper iconImage={Images.microphone_mute_white} iconWidth={RfW(20)} iconHeight={RfH(20)} />
                <Text
                  style={[
                    commonStyles.mediumPrimaryText,
                    {
                      color: Colors.white,
                      paddingHorizontal: 8,
                    },
                  ]}>
                  {participant?.firstName}
                </Text>
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  _renderWaitingScreen = () => {
    return (
      <>
        <View
          style={{
            paddingVertical: Platform.OS === 'ios' ? RfH(44) : RfH(15),
            paddingHorizontal: RfW(16),
            justifyContent: 'center',
          }}>
          <BackArrow action={this.onBackPress} whiteArrow />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'stretch' }}>
            {this.state.previewVideo ? (
              <RtcLocalView.SurfaceView style={{ flex: 1 }} renderMode={VideoRenderMode.Hidden} />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#444444',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: RfH(100),
                    width: RfH(100),
                    borderRadius: 100,
                    backgroundColor: Colors.lightBlue,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontSize: 48,
                    }}>
                    {this.props.userInfo.firstName[0]}
                  </Text>
                </View>
              </View>
            )}

            <View
              style={{
                marginTop: RfH(-100),
                marginBottom: RfH(34),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback onPress={this.togglePreview}>
                <View
                  style={{
                    width: RfH(54),
                    height: RfH(54),
                    backgroundColor: this.state.videoMuted ? Colors.white : '#222222',
                    borderRadius: 54,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: RfW(8),
                  }}>
                  <IconButtonWrapper
                    iconImage={this.state.videoMuted ? Images.video_call_mute : Images.video_call}
                    iconWidth={RfH(24)}
                    iconHeight={RfH(24)}
                    imageResizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.audioToggle}>
                <View
                  style={{
                    width: RfH(54),
                    height: RfH(54),
                    backgroundColor: this.state.audioMuted ? Colors.white : '#222222',
                    borderRadius: 54,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: RfW(8),
                  }}>
                  <IconButtonWrapper
                    iconImage={this.state.audioMuted ? Images.microphone_mute : Images.microphone}
                    iconWidth={RfW(24)}
                    iconHeight={RfH(24)}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View
            style={{
              flex: 0.4,
              backgroundColor: Colors.lightPurple,
              // paddingTop: RfH(44),
              justifyContent: 'flex-start',
              alignSelf: 'stretch',
            }}>
            {!isEmpty(this.props.meetingDetails) && (
              <View
                style={[
                  commonStyles.verticallyStretchedItemsView,
                  { alignItems: 'center', marginTop: RfW(16), marginLeft: RfW(8) },
                ]}>
                <Text style={commonStyles.headingPrimaryText}>{this.props.meetingDetails.title}</Text>
                <Text style={commonStyles.mediumMutedText}>{this.props.meetingDetails.description}</Text>
                <Text style={commonStyles.mediumMutedText}>
                  {printDate(this.props.meetingDetails?.startDate)}
                  {' at '}
                  {printTime(this.props.meetingDetails?.startDate)} {' - '}
                  {printTime(this.props.meetingDetails?.endDate)}
                </Text>
              </View>
            )}

            <View style={styles.buttonHolder}>
              {moment(this.props.meetingDetails.allowedStartDate).isBefore(moment()) &&
                moment(this.props.meetingDetails.allowedEndDate).isAfter(moment()) && (
                  <TouchableWithoutFeedback onPress={this.startCall}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}> Join Session </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

              {isEmpty(this.props.meetingDetails) ||
                (moment(this.props.meetingDetails.allowedEndDate).isBefore(moment()) && <Text>Session Has Ended</Text>)}
            </View>
          </View>
        </View>
      </>
    );
  };

  render() {
    const { joinSucceed } = this.state;

    return (
      <View style={[styles.max, { backgroundColor: Colors.brandBlue2 }]}>
        <StatusBar barStyle="light-content" />

        {!joinSucceed && this._renderWaitingScreen()}

        {joinSucceed && this._renderVideos()}
      </View>
    );
  }
}
