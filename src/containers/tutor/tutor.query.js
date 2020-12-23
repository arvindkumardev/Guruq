import { gql } from '@apollo/client';

export const GET_INTERVIEW_SCHEDULE_AVAILABILITY = gql`
  query GetAvailabilityForInterview($availabilityDto: AvailabilityDto!) {
    getAvailabilityForInterview(availabilityDto: $availabilityDto) {
      startDate
      endDate
      active
    }
  }
`;
