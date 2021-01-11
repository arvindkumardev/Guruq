import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../../theme/colors';
import { deviceHeight, deviceWidth, RfH, RfW } from '../../../utils/helpers';
import Images from '../../../theme/images';
import IconButtonWrapper from '../../../components/IconWrapper';
import commonStyles from '../../../theme/styles';

const VideoMoreAction = (props) => {
  const { visible, onClose, videoQuality, setVideoQuality } = props;

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
          <View style={{ backgroundColor: Colors.white, opacity: 0.5, flex: 1 }} />
          <View
            style={{
              top: 0,
              left: 0,
              // right: 0,
              position: 'absolute',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: deviceWidth(),
              height: deviceHeight(),
              // backgroundColor: Colors.white,
              paddingHorizontal: RfW(16),
              // paddingVertical: RfW(16),
            }}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <View
                style={{
                  // height: 44,
                  //   flex:1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  // backgroundColor: Colors.orangeRed,
                  paddingHorizontal: RfH(16),
                  paddingVertical: RfH(16),
                }}>
                {/* <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>More Options</Text> */}
                <TouchableOpacity onPress={() => onClose(false)}>
                  <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(20)} iconHeight={RfH(20)} />
                </TouchableOpacity>
              </View>

              {/* <View style={{ height: 8 }} /> */}

              {/* <View */}
              {/*  style={{ */}
              {/*    flexDirection: 'column', */}
              {/*    // height: RfH(300), */}
              {/*    // flex: 1, */}
              {/*    // alignItems: 'flex-start', */}
              {/*    backgroundColor: Colors.lightBlack, */}
              {/*    justifyContent: 'center', */}
              {/*    // paddingVertical: RfH(16), */}
              {/*  }}> */}

              <View style={{ paddingHorizontal: RfH(16), marginBottom: RfH(34) }}>
                <Text style={commonStyles.headingPrimaryText}>Video Quality</Text>

                <TouchableOpacity
                  onPress={() => {
                    setVideoQuality('high');
                    onClose(false);
                  }}
                  style={[commonStyles.horizontalChildrenStartView, { alignItems: 'center', marginTop: RfH(24) }]}>
                  <IconButtonWrapper
                    iconImage={videoQuality === 'high' ? Images.radio : Images.radio_button_null}
                    iconWidth={RfW(16)}
                    iconHeight={RfH(16)}
                    imageResizeMode="contain"
                  />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>High Resolution</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setVideoQuality('low');
                    onClose(false);
                  }}
                  style={[commonStyles.horizontalChildrenStartView, { alignItems: 'center', marginTop: RfH(16) }]}>
                  <IconButtonWrapper
                    iconImage={videoQuality === 'high' ? Images.radio_button_null : Images.radio}
                    iconWidth={RfW(16)}
                    iconHeight={RfH(16)}
                    imageResizeMode="contain"
                  />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Low Resolution</Text>
                </TouchableOpacity>

                {/* </View> */}
                {/* <View style={{ height: 34 }} /> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

VideoMoreAction.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  setVideoQuality: PropTypes.func,
  videoQuality: PropTypes.string,
};

export default VideoMoreAction;
