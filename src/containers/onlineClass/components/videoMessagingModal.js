import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import Colors from '../../../theme/colors';
import { RfH, RfW } from '../../../utils/helpers';
import Images from '../../../theme/images';
import IconButtonWrapper from '../../../components/IconWrapper';
import Fonts from '../../../theme/fonts';
import { dimensions } from './style';
import SlackMessage from '../../../components/Chat/SlackMessage';
import { GET_CHAT_MESSAGES, NEW_CHAT_MESSAGE, SEND_CHAT_MESSAGE } from './chat.graphql';

const messages = [
  {
    _id: 1,
    text: 'This is a system message',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    system: true,
  },
  {
    _id: 2,
    text: 'Hello developer',
    createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
  {
    _id: 3,
    text: 'Hi! I work from home today!',
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'React',
      avatar: 'https://placeimg.com/140/140/any',
    },
    image: 'https://placeimg.com/960/540/any',
  },
  {
    _id: 4,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
    },
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
  },
  {
    _id: 5,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
    },
    quickReplies: {
      type: 'checkbox', // or 'radio',
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: 'Nope. What?',
          value: 'no',
        },
      ],
    },
  },
  {
    _id: 6,
    text: 'Come on!',
    createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
  {
    _id: 7,
    text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
        But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
        And the magic number is 42!
        #react #react-native`,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'React',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
];

const VideoMessagingModal = (props) => {
  const { visible, onClose, channelName } = props;

  const [chatMessages, setChatMessages] = useState(messages);

  const getMessageToRender = (message) => {
    return {
      ...message,
      _id: message.id,
      createdAt: message.createdDate,
      user: { _id: message.createdBy.id, name: `${message.createdBy.firstName} ${message.createdBy.lastName}` },
    };
  };

  const [sendMessage, { loading: loadingSendMessage }] = useMutation(SEND_CHAT_MESSAGE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      console.log(data);
      if (data && data?.sendChatMessage) {
        const message = data.sendChatMessage;
        setChatMessages(GiftedChat.append(chatMessages, getMessageToRender(message)));
      }
    },
  });

  const [getChatMessages, { loading: loadingGetChatMessage, refetch: fetchMessages }] = useLazyQuery(
    GET_CHAT_MESSAGES,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        console.log(e);
        if (e.graphQLErrors && e.graphQLErrors.length > 0) {
          const error = e.graphQLErrors[0].extensions.exception.response;
        }
      },
      onCompleted: (data) => {
        console.log(data);
        if (data) {
          if (data?.getChatMessages) {
            setChatMessages(
              GiftedChat.append(
                chatMessages,
                data.getChatMessages.map((message) => getMessageToRender(message))
              )
            );
          }
        }
      },
    }
  );
  useEffect(() => {
    getChatMessages({ variables: { channelName: props.channelName } });
  }, []);

  const { loading: loadingNewMessageEvent } = useSubscription(NEW_CHAT_MESSAGE, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      console.log(data);
      if (data && data?.chatMessageSent) {
        const message = data.chatMessageSent;
        setChatMessages(GiftedChat.append(chatMessages, getMessageToRender(message)));
      }
    },
  });

  const onSend = (newMessages = []) => {
    console.log(newMessages);

    sendMessage({
      variables: {
        chatMessageDto: {
          channel: channelName,
          text: newMessages[0].text,
        },
      },
    });
  };

  // fetch chat messages in app startup
  // useEffect(() => {}, [initialMessages]);

  // handles new message subscription event
  // useEffect(() => {
  //   console.log(newMessageEvent);
  //   if (newMessageEvent?.chatMessageSent) {
  //     setChatMessages([...chatMessages, newMessageEvent.chatMessageSent]);
  //   }
  // }, [newMessageEvent]);

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
            <Text
              style={{
                color: Colors.primaryText,
                fontSize: 18,
                fontFamily: Fonts.semiBold,
              }}>
              Messages
            </Text>
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
  channelName: PropTypes.string,
};

export default VideoMessagingModal;
