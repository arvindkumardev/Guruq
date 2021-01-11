import { gql } from '@apollo/client';

export const GET_AGORA_RTC_TOKEN = gql`
  query GenerateAgoraRTCToken($channelName: String!, $userId: Int!) {
    generateAgoraRTCToken(channelName: $channelName, userId: $userId)
  }
`;

export const GET_MEETING_DETAILS = gql`
  query GetMeetingDetailsForClass($uuid: String!) {
    meetingDetails: getMeetingDetailsForClass(uuid: $uuid) {
      channel
      title
      description
      startDate
      endDate
      startTimeThreshold
      endTimeThreshold
      token
      shareChannel
      shareToken
      host {
        id
        firstName
        lastName
        image
        current
      }
      guests {
        id
        firstName
        lastName
        image
        current
      }
    }
  }
`;
