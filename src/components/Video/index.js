import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import styles from './style';

import requestCameraAndAudioPermission from './permission';
import { RfH, RfW } from '../../utils/helpers';
import { Colors } from '../../theme';
import IconButtonWrapper from '../IconWrapper';
import Images from '../../theme/images';
import commonStyles from '../../theme/styles';

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
}

export default class Video extends Component<Props, State> {
  _engine: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      appId: '20be4eff902f4d9ea78c2f8c168556cd',
      token:
        '00620be4eff902f4d9ea78c2f8c168556cdIACK2kadEofay+bsCjCkGCKv+GdLOUFa+wkFAoGELbRhCaaOhcgAAAAAEAApyLkYCjuuXwEAAQAKO65f',
      channelName: 'TESTING_AGORA_CALL_GURUQ',
      joinSucceed: false,
      peerIds: [],
      currentUserId: '',
      audioOn: true,
      videoOn: true,
      audioStates: [],
      videoStates: [],
      previewVideo: true,
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
    await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0);
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

  render() {
    const { joinSucceed } = this.state;

    return (
      <View style={styles.max}>
        {!joinSucceed && (
          <>
            <View style={{ height: 44, marginTop: 44, paddingHorizontal: 16, justifyContent: 'center' }}>
              <IconButtonWrapper
                styling={{ marginRight: RfW(16) }}
                iconImage={Images.backArrow}
                iconHeight={RfH(20)}
                iconWidth={RfW(20)}
                submitFunction={() => this.props.onCallEnd(true)}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 0.8, justifyContent: 'flex-end', alignSelf: 'stretch' }}>
                {this.state.previewVideo ? (
                  <RtcLocalView.SurfaceView style={{ flex: 1 }} renderMode={VideoRenderMode.Hidden} mirrorMode />
                ) : (
                  <View style={{ flex: 1, backgroundColor: Colors.black }} />
                )}

                <View
                  style={{
                    marginTop: RfH(-70),
                    marginBottom: 34,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={this.togglePreview} style={{ marginHorizontal: RfW(8) }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: this.state.videoMuted ? Colors.white : Colors.darkGrey,
                        borderRadius: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <IconButtonWrapper
                        iconImage={this.state.videoMuted ? Images.video_call_mute : Images.video_call}
                        iconWidth={RfW(24)}
                        iconHeight={RfH(24)}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.audioToggle} style={{ marginHorizontal: RfW(8) }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: this.state.audioMuted ? Colors.white : Colors.darkGrey,
                        borderRadius: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <IconButtonWrapper
                        iconImage={this.state.audioMuted ? Images.microphone_mute : Images.microphone}
                        iconWidth={RfW(24)}
                        iconHeight={RfH(24)}
                      />
                    </View>
                  </TouchableOpacity>
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
                    <Text style={commonStyles.headingText}>Physics Class By John Smith</Text>
                    <Text style={commonStyles.secondaryText}>CBSE | Class 9</Text>
                    <Text style={commonStyles.secondaryText}>Nov 12, 9:30 pm</Text>
                  </View>
                  <View>
                    <IconButtonWrapper />
                  </View>
                </View>

                <View style={styles.buttonHolder}>
                  <TouchableOpacity onPress={this.startCall} style={styles.button}>
                    <Text style={styles.buttonText}> Join Class </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={this.endCall} style={styles.button}> */}
                  {/*  <Text style={styles.buttonText}> End Call </Text> */}
                  {/* </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </>
        )}

        {joinSucceed && this._renderVideos()}
      </View>
    );
  }

  _renderVideos = () => {
    return (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={this.state.channelName}
          renderMode={VideoRenderMode.Hidden}
        />

        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 34,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={this.endCall} style={{ marginHorizontal: RfW(8) }}>
            <View
              style={{
                width: 54,
                height: 54,
                backgroundColor: Colors.orangeRed,
                borderRadius: 54,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButtonWrapper iconImage={Images.phone} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.videoToggle} style={{ marginHorizontal: RfW(8) }}>
            <View
              style={{
                width: 44,
                height: 44,
                backgroundColor: this.state.videoMuted ? Colors.white : Colors.darkGrey,
                borderRadius: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButtonWrapper
                iconImage={this.state.videoMuted ? Images.video_call_mute : Images.video_call}
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.audioToggle} style={{ marginHorizontal: RfW(8) }}>
            <View
              style={{
                width: 44,
                height: 44,
                backgroundColor: this.state.audioMuted ? Colors.white : Colors.darkGrey,
                borderRadius: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButtonWrapper
                iconImage={this.state.audioMuted ? Images.microphone_mute : Images.microphone}
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
              />
            </View>
          </TouchableOpacity>
        </View>

        {this._renderRemoteVideos()}
      </View>
    );
  };

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView style={styles.remoteContainer} contentContainerStyle={{ paddingHorizontal: 2.5 }} horizontal>
        {peerIds.map((value, index, array) => {
          const audioItem = this.state.audioStates.find((s) => s.uid === value);
          const videoItem = this.state.videoStates.find((s) => s.uid === value);

          return (
            <>
              {videoItem && videoItem.status ? (
                <RtcRemoteView.SurfaceView
                  style={styles.remote}
                  uid={value}
                  channelId={this.state.channelName}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay
                />
              ) : (
                <View style={[styles.remote, { backgroundColor: Colors.black }]} />
              )}

              {audioItem && !audioItem.status && (
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 8, right: 8 }}>
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
}
