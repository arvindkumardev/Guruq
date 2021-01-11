import { gql } from '@apollo/client';

// FIXME: add filtering
export const NEW_CHAT_MESSAGE = gql`
  subscription {
    chatMessageSent {
      id
      uuid
      channel
      createdBy {
        id
        firstName
        lastName
        profileImage {
          filename
          original
        }
      }
      createdDate
      text
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($channelName: String!) {
    getChatMessages(channel: $channelName) {
      id
      uuid
      channel
      createdBy {
        id
        firstName
        lastName
        profileImage {
          filename
          original
        }
      }
      createdDate
      text
    }
  }
`;

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($chatMessageDto: ChatMessageDto!) {
    sendChatMessage(chatMessageDto: $chatMessageDto) {
      id
      uuid
      channel
      createdBy {
        id
        firstName
        lastName
        profileImage {
          filename
          original
        }
      }
      createdDate
      text
    }
  }
`;

export const ENTER_CHAT = gql`
  mutation {
    enterChat
  }
`;

export const LEAVE_CHAT = gql`
  mutation {
    leaveChat
  }
`;
