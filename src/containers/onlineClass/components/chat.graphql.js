import { gql } from '@apollo/client';

export const NEW_CHAT_MESSAGE = gql`
  subscription {
    chatMessageSent {
      id
      uuid
      channel
      createdBy {
        firstName
        lastName
        profileImage {
          filename
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
        firstName
        lastName
        profileImage {
          filename
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
        firstName
        lastName
        profileImage {
          filename
        }
      }
      createdDate
      text
    }
  }
`;
