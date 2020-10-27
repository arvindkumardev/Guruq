import { gql } from '@apollo/client';

export const CHECK_USER_QUERY = gql`
  query CheckUser($countryCode: String!, $number: String!) {
    checkUser(phoneNumber: { countryCode: $countryCode, number: $number }) {
      isPasswordSet
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      isPasswordSet
      isFirstTime
      isPhoneNumberVerified
      isEmailVerified
      type
      role {
        name
      }
    }
  }
`;

export const GET_CURRENT_STUDENT_QUERY = gql`
  query GetCurrentStudent {
    getCurrentStudent {
      id
      contactDetail {
        firstName
        lastName
        phoneNumber {
          countryCode
          number
        }
        email
      }
    }
  }
`;

export const GET_CURRENT_TUTOR_QUERY = gql`
  query GetCurrentTutor {
    getCurrentTutor {
      id
      contactDetail {
        firstName
        lastName
        phoneNumber {
          countryCode
          number
        }
        email
      }
    }
  }
`;
