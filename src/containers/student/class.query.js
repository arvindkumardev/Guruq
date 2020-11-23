import { gql } from '@apollo/client';

export const GET_AVAILABILITY = gql`
  query GetAvailability($tutorAvailability: TutorAvailabilityDto!) {
    getAvailability(tutorAvailability: $tutorAvailability) {
      id
      active
      startDate
      endDate
    }
  }
`;
