import { gql } from '@apollo/client';

export const GET_EXPERIENCE_LIST = gql`
  query GetTutorExperienceDetails {
    getTutorExperienceDetails {
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
