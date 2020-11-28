import React, { Component } from 'react';
import { Platform, ScrollView, StatusBar, Text, TouchableWithoutFeedback, View, Alert } from 'react-native';
import RtcEngine, {
  AudioProfile,
  AudioScenario,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import styles from './style';

import requestCameraAndAudioPermission from './permission';
import { RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';
import IconButtonWrapper from '../IconWrapper';
import Images from '../../theme/images';
import commonStyles from '../../theme/styles';
import BackArrow from '../BackArrow';

interface Props {}

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
  appId: string;
  token: string;
  channelName: string;
  joinSucceed: boolean;
  peerIds: number[];
  currentUserId: '';
  audioMuted: false;
  videoMuted: false;
  audioStates: [];
  videoStates: [];
  previewVideo: true;
  showDetailedActions: true;
  selectedUid: '';
}

export default class Video extends Component<Props, State> {
  _engine: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      appId: '20be4eff902f4d9ea78c2f8c168556cd',
      token:
        '00620be4eff902f4d9ea78c2f8c168556cdIADrLe1fOmnKczvkci/7ToKB7B/ZkKCxt4Hl9rs1Qc4prZWfxlgAAAAAEAA1BQ7X7GnDXwEAAQDracNf',
      channelName: 'DUMMY_CLASS',
      joinSucceed: false,
      peerIds: [],
      currentUserId: '',
      audioOn: true,
      videoOn: true,
      audioStates: [],
      videoStates: [],
      previewVideo: true,

      showDetailedActions: true,
      selectedUid: '',
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    this.init();
    console.log('starting video');
  }

  componentWillUnmount() {
    console.log('stopping video');

    // this._engine?.leaveChannel().then(()=>{
    //   this.setState({ peerIds: [], joinSucceed: false });
    //   this.startCall();
    // });
  }

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    const { appId } = this.state;
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();
    await this._engine.setAudioProfile(AudioProfile.Default, AudioScenario.Education);

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
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

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
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

    // await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0);
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
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(this.state.token, this.state.channelName, null, this.props.userInfo.id);

    // console.log(await this._engine.getUserInfoByUid(10));
    // console.log(await this._engine.getUserInfoByUid(11));
    // console.log(await this._engine.getCallId());
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });

    this.props.onCallEnd();
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
    const { navigation } = this.props;

    this.props.onCallEnd(true);
    navigation.goBack();
  };

  toggleDetailedActions = async () => {
    this.setState({ showDetailedActions: !this.state.showDetailedActions });
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
                height: 88,
                paddingTop: 44,
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
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <IconButtonWrapper iconImage={Images.arrow_down} iconWidth={RfW(20)} iconHeight={RfH(20)} />
              <Text
                style={[commonStyles.headingPrimaryText, { marginLeft: RfW(8), color: Colors.white }]}
                numberOfLines={1}>
                Class 10 Mathematics by Roshan Singh
              </Text>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: RfW(24) }}>
              <TouchableWithoutFeedback onPress={() => Alert.alert('camera switch')}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    // borderRadius: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IconButtonWrapper iconImage={Images.camera_switch} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => Alert.alert('speaker')}>
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
                  <IconButtonWrapper iconImage={Images.speaker} iconWidth={RfW(24)} iconHeight={RfH(24)} />
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
                  <Text style={[commonStyles.headingPrimaryText, { fontSize: 15, color: Colors.white }]}>End</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {this.state.peerIds.length <= 1 && (
          <View
            style={{
              width: 100,
              height: 150,
              top: this.state.showDetailedActions ? 16 : 60,
              left: 20,
              borderRadius: 20,
              zIndex: 2,
            }}>
            {!this.state.videoMuted ? (
              <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={this.state.channelName}
                renderMode={VideoRenderMode.Hidden}
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
                  <Text style={{ color: Colors.primaryText, fontSize: 48 }}>{this.props.userInfo.firstName[0]}</Text>
                </View>
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
                  <Text style={[commonStyles.xSmallPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>
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
                  <Text style={[commonStyles.xSmallPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>
                    {this.state.audioMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.endCall}>
                <View
                  style={{
                    // width: 60,
                    flex: 1,
                    height: 54,
                    // backgroundColor: Colors.orangeRed,
                    // borderRadius: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 8,
                  }}>
                  <IconButtonWrapper iconImage={Images.share_screen} iconWidth={RfW(28)} iconHeight={RfH(28)} />
                  <Text style={[commonStyles.xSmallPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>
                    Share Screen
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.audioToggle}>
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
                  <Text style={[commonStyles.xSmallPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>
                    Messaging
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={this.audioToggle}>
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
                  <Text style={[commonStyles.xSmallPrimaryText, { marginTop: RfH(8), color: Colors.white }]}>More</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {this.state.peerIds.length > 1 ? (
          this._renderRemoteVideos()
        ) : this.state.peerIds.length >= 1 ? (
          this._renderRemoteVideo()
        ) : (
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
              You're the first one here
            </Text>
            <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>
              Wait for other members to join the class.
            </Text>
          </View>
        )}
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
        <View style={{ width: 80, height: 120, borderRadius: 20 }}>
          {!this.state.videoMuted ? (
            <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}
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
                <Text style={{ color: Colors.primaryText, fontSize: 36 }}>{this.props.userInfo.firstName[0]}</Text>
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
        </View>

        {peerIds
          .filter((uid) => uid !== this.state.selectedUid)
          .map((value, index, array) => {
            const audioItem = this.state.audioStates.find((s) => s.uid === value);
            const videoItem = this.state.videoStates.find((s) => s.uid === value);

            console.log('videoItem', videoItem, peerIds);
            return (
              <>
                <TouchableWithoutFeedback onPress={() => this.setState({ selectedUid: value })}>
                  {videoItem && videoItem.status ? (
                    <RtcRemoteView.SurfaceView
                      // style={styles.remyesote}
                      style={[styles.remote, { borderRadius: 20 }]}
                      uid={value}
                      channelId={this.state.channelName}
                      renderMode={VideoRenderMode.Hidden}
                      zOrderMediaOverlay
                    />
                  ) : (
                    <View
                      style={[
                        styles.remote,
                        {
                          flex: 1,
                          backgroundColor: '#444444',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}>
                      <View
                        style={{
                          height: RfH(60),
                          width: RfW(60),
                          borderRadius: 100,
                          backgroundColor: Colors.lightBlue,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}>
                        <Text style={{ color: Colors.primaryText, fontSize: 36 }}>R</Text>
                      </View>
                      <Text style={[commonStyles.mediumPrimaryText, { color: Colors.white }]}>Remote</Text>
                    </View>
                  )}
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
              </>
            );
          })}
      </ScrollView>
    );
  };

  _renderRemoteVideo = () => {
    const { peerIds, selectedUid } = this.state;

    // const value = selectedUid;
    const audioItem = this.state.audioStates.find((s) => s.uid === selectedUid);
    const videoItem = this.state.videoStates.find((s) => s.uid === selectedUid);

    console.log('videoItem', videoItem, peerIds);

    return (
      <>
        {selectedUid ? (
          <View style={[styles.fullView, { position: 'absolute', top: 0 }]}>
            <TouchableWithoutFeedback onPress={this.toggleDetailedActions}>
              {videoItem && videoItem.status ? (
                <RtcRemoteView.SurfaceView
                  // style={styles.remyesote}
                  style={[styles.max, { borderRadius: 20 }]}
                  uid={selectedUid}
                  channelId={this.state.channelName}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay
                />
              ) : (
                <View
                  style={[
                    // styles.remote,
                    {
                      flex: 1,
                      backgroundColor: '#222222',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <View
                    style={{
                      height: RfH(100),
                      width: RfW(100),
                      borderRadius: 100,
                      backgroundColor: Colors.lightBlue,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                    <Text style={{ color: Colors.primaryText, fontSize: 48 }}>R</Text>
                  </View>
                  <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>Remote</Text>
                </View>
              )}
            </TouchableWithoutFeedback>

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
                <Text style={[commonStyles.mediumPrimaryText, { color: Colors.white, paddingHorizontal: 8 }]}>
                  Arun
                </Text>
              </View>
            )}
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  render() {
    const { joinSucceed } = this.state;

    return (
      <View style={[styles.max, { backgroundColor: Colors.brandBlue2 }]}>
        <StatusBar barStyle="light-content" />

        {!joinSucceed && (
          <>
            <View style={{ height: 44, marginTop: 44, paddingHorizontal: 16, justifyContent: 'center' }}>
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
                        width: RfW(100),
                        borderRadius: 100,
                        backgroundColor: Colors.lightBlue,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: Colors.primaryText, fontSize: 48 }}>A</Text>
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
                        width: RfW(54),
                        height: RfH(54),
                        backgroundColor: this.state.videoMuted ? Colors.white : '#222222',
                        borderRadius: 54,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: RfW(8),
                      }}>
                      <IconButtonWrapper
                        iconImage={this.state.videoMuted ? Images.video_call_mute : Images.video_call}
                        iconWidth={RfW(24)}
                        iconHeight={RfH(24)}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={this.audioToggle}>
                    <View
                      style={{
                        width: RfW(54),
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
                  flex: 0.5,
                  backgroundColor: Colors.lightPurple,
                  // paddingTop: RfH(44),
                  justifyContent: 'flex-start',
                  alignSelf: 'stretch',
                }}>
                <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
                  <View
                    style={{
                      height: RfH(72),
                      width: RfW(72),
                      backgroundColor: Colors.lightPurple,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconButtonWrapper iconHeight={RfH(48)} iconWidth={RfW(32)} iconImage={Images.book} />
                  </View>
                  <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
                    <Text style={commonStyles.headingPrimaryText}>Physics Class By John Smith</Text>
                    <Text style={commonStyles.mediumMutedText}>CBSE | Class 9</Text>
                    <Text style={commonStyles.mediumMutedText}>Nov 12, 9:30 pm</Text>
                  </View>
                  <View>
                    <IconButtonWrapper />
                  </View>
                </View>

                <View style={styles.buttonHolder}>
                  <TouchableWithoutFeedback onPress={this.startCall}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}> Join Class </Text>
                    </View>
                  </TouchableWithoutFeedback>

                  {/* FIXME: REMOVE ME */}
                  <TouchableWithoutFeedback onPress={this.endCall}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}> End Call </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </>
        )}

        {joinSucceed && this._renderVideos()}
      </View>
    );
  }
}
