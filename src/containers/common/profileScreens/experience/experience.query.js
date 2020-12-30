import { gql } from '@apollo/client';

export const GET_EXPERIENCE_LIST = gql`
  query GetTutorDetails {
    getTutorDetails {
      experienceDetails {
        id
        employmentType
        institution {
          name
        }
        title
        startDate
        endDate
        current
      }
    }
  }
`;
