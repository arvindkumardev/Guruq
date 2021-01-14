import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';
import Images from '../../../theme/images';
import IconButtonWrapper from '../../../components/IconWrapper';
import commonStyles from '../../../theme/styles';

const VideoMoreAction = (props) => {
  const { visible, onClose } = props;

  return (
    <TouchableWithoutFeedback onPress={() => onClose(false)}>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => {
          onClose(false);
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
              // backgroundColor: Colors.white,
              // paddingHorizontal: RfW(16),
              // paddingVertical: RfW(16),
            }}>
            <View
              style={{
                // height: 44,
                //   flex:1,
                height: 44,
                width: 44,
                borderRadius: 44,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: Colors.white,
              }}>
              {/* <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>More Options</Text> */}
              <TouchableOpacity onPress={() => onClose(false)}>
                <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(20)} iconHeight={RfH(20)} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 8 }} />

            <View
              style={{
                flexDirection: 'column',
                // height: RfH(300),
                // flex: 1,
                // alignItems: 'flex-start',
                backgroundColor: Colors.lightBlack,
                justifyContent: 'center',
                // paddingVertical: RfH(16),
              }}>
              <View
                style={{
                  // flex: 1,
                  // height: 54,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-evenly',
                  marginVertical: RfH(16),
                }}>
                <TouchableWithoutFeedback onPress={() => console.log('button click')}>
                  <View
                    style={{
                      // flex: 1,
                      // width: 48,
                      // flex:1,
                      // height: 54,
                      // borderRadius: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <IconButtonWrapper iconImage={Images.video_call} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                    <Text
                      style={[
                        commonStyles.smallPrimaryText,
                        {
                          marginTop: RfH(8),
                          color: Colors.white,
                        },
                      ]}>
                      Stop Video
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => console.log('button click')}>
                  <View
                    style={{
                      // width: 48,
                      // flex: 1,
                      // height: 54,
                      // borderRadius: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <IconButtonWrapper iconImage={Images.microphone} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                    <Text
                      style={[
                        commonStyles.smallPrimaryText,
                        {
                          marginTop: RfH(8),
                          color: Colors.white,
                        },
                      ]}>
                      Mute
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => console.log('button click')}>
                  <View
                    style={{
                      // width: 60,
                      // flex: 1,
                      // height: 54,
                      // backgroundColor: Colors.orangeRed,
                      // borderRadius: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // paddingBottom: 8,
                    }}>
                    <IconButtonWrapper iconImage={Images.share_screen} iconWidth={RfW(24)} iconHeight={RfH(24)} />
                    <Text
                      style={[
                        commonStyles.smallPrimaryText,
                        {
                          marginTop: RfH(8),
                          color: Colors.white,
                        },
                      ]}>
                      Share Screen
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View
                style={{
                  // flex: 1,
                  // height: 54,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-evenly',
                  marginVertical: RfH(16),
                }}>
                <TouchableWithoutFeedback onPress={() => console.log('button click')}>
                  <View
                    style={{
                      // width: 48,
                      // flex: 1,
                      // height: 54,
                      // backgroundColor: '#444444',
                      // borderRadius: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <IconButtonWrapper iconImage={Images.messaging_white} iconWidth={RfW(24)} iconHeight={RfH(24)} />
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

                <TouchableWithoutFeedback onPress={() => console.log('button click')}>
                  <View
                    style={{
                      // width: 48,
                      // flex: 1,
                      // height: 54,
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

            <View style={{ height: 34 }} />
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

VideoMoreAction.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoMoreAction;
