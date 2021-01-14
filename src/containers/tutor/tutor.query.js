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

export const GET_TUTOR_DETAILS = gql`
  query GetTutorDetails {
    getTutorDetails {
      addresses {
        id
        type
        street
        subArea
        city
        state
        country
        postalCode
        fullAddress
        landmark
      }
      educationDetails {
        id
        school {
          name
        }
        degree {
          name
        }
        fieldOfStudy
        board
        grade
      }
    }
  }
`;
