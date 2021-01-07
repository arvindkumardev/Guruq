import { gql } from '@apollo/client';

export const GET_PARENT_DETAILS = gql`
  query GetStudentDetails {
    getStudentDetails {
      id
      guardians {
        id
        type
        contactDetail {
          firstName
          lastName
          email
          phoneNumber {
            countryCode
            number
          }
        }
      }
    }
  }
`;
