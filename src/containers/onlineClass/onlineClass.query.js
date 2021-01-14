import { gql } from '@apollo/client';

export const GET_AGORA_RTC_TOKEN = gql`
  query GenerateAgoraRTCToken($channelName: String!, $userId: Int!) {
    generateAgoraRTCToken(channelName: $channelName, userId: $userId)
  }
`;

export const GET_MEETING_DETAILS_FOR_CLASS = gql`
  query GetMeetingDetailsForClass($uuid: String!) {
    meetingDetails: getMeetingDetailsForClass(uuid: $uuid) {
      appId
      channel
      title
      description
      startDate
      endDate
      allowedStartDate
      allowedEndDate
      startTimeThreshold
      endTimeThreshold
      token
      shareId
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

export const GET_MEETING_DETAILS_FOR_INTERVIEW = gql`
  query GetMeetingDetailsForInterview($uuid: String!) {
    meetingDetails: getMeetingDetailsForInterview(uuid: $uuid) {
      appId
      channel
      title
      description
      startDate
      endDate
      allowedStartDate
      allowedEndDate
      startTimeThreshold
      endTimeThreshold
      token
      shareId
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
