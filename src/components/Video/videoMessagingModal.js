import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatItem, MessageList } from 'react-chat-elements';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import Images from '../../theme/images';
import IconButtonWrapper from '../IconWrapper';
import Fonts from '../../theme/fonts';

const VideoMessagingModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose } = props;

  const messageSource = [];

  const [show, setShow] = useState(true);
  const [messageList, setMessageList] = useState([]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const token = () => {
    return parseInt((Math.random() * 10) % 6, 10);
  };

  const photo = (size) => {
    return require('../../assets/images/user.png');
  };

  const random = (type) => {
    switch (type) {
      case 'message':
        var type = token();
        var status = 'waiting';
        type = 'text';

        return {
          position: token() >= 1 ? 'right' : 'left',
          forwarded: true,
          type,
          theme: 'white',
          view: 'list',
          title: 'consectetur adipisicing elit',
          titleColor: getRandomColor(),
          text: 'Ab beatae odit deleniti dolor numquam nisi, non laboriosam sequi',
          data: {
            uri: require('../../assets/images/user.png'),
            status: {
              click: false,
              loading: 0,
            },
            width: 300,
            height: 300,
            latitude: '37.773972',
            longitude: '-122.431297',
          },
          status,
          date: new Date(),
          dateString: new Date().toTimeString().split(' ')[0],
          // avatar: require('./assets/chat-user.png'),
        };
      case 'chat':
        return {
          id: String(Math.random()),
          avatar: `data:image/png;base64,${photo()}`,
          avatarFlexible: true,
          statusColor: 'lightgreen',
          alt: 'dolore voluptate facilis nobis officia commodi quia',
          title: 'dolore voluptate facilis nobis officia commodi quia',
          date: new Date(),
          subtitle: 'eligendi quaerat nam ipsam tempora.',
          unread: parseInt((Math.random() * 10) % 3, 10),
          dateString: new Date().toTimeString().split(' ')[0],
        };
    }
  };

  messageSource.unshift(random('message'));

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View
        style={{ flex: 1, paddingBottom: 34, height: '90%', backgroundColor: 'transparent', flexDirection: 'column' }}>
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
            // paddingVertical: RfW(16),
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>Messages</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <View
            style={{
              flex: 1,
              marginTop: 10,
              backgroundColor: '#ccc',
            }}>
            <MessageList lockable dataSource={messageSource} />
            <Text>Gönder</Text>
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
