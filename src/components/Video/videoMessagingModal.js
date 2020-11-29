import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import Images from '../../theme/images';
import IconButtonWrapper from '../IconWrapper';
import Fonts from '../../theme/fonts';
import { dimensions } from './style';
import Chats from './Chats';
import messages from './messages';
import SlackMessage from './SlackMessage';

const VideoMessagingModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose } = props;

  const [chatMessages, setChatMessages] = useState(messages);

  const onSend = (newMessages = []) => {
    setChatMessages(GiftedChat.append(chatMessages, newMessages));
  };

  const renderMessage = (props) => {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View
        style={{
          flex: 1,
          paddingBottom: 34,
          backgroundColor: 'transparent',
          flexDirection: 'column',
        }}>
        <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: RfH(dimensions.height - 150),
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            // paddingVertical: RfW(16),
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: RfW(16),
              borderBottomColor: Colors.borderColor,
              borderBottomWidth: 0.5,
            }}>
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>Messages</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              paddingTop: 10,
              // backgroundColor: '#ccc',
            }}>
            <GiftedChat
              messages={chatMessages}
              onSend={(messages) => onSend(messages)}
              user={{
                _id: 10,
              }}
              renderMessage={renderMessage}
            />
          </View>

          <View style={{ height: 34 }} />
        </View>
      </View>
    </Modal>
  );
};

VideoMessagingModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoMessagingModal;
