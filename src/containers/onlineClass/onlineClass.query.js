import { gql } from '@apollo/client';

export const GET_AGORA_RTC_TOKEN = gql`
  query GenerateAgoraRTCToken($channelName: String!, $userId: Int!) {
    generateAgoraRTCToken(channelName: $channelName, userId: $userId)
  }
`;
