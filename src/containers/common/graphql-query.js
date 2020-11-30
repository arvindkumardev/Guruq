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
      phoneNumber {
        countryCode
        number
      }
      isPasswordSet
      isPhoneNumberVerified
      isEmailVerified
      type
      role {
        name
      }
      profileImage {
        filename
      }
      qPoints
    }
  }
`;

export const GET_CURRENT_STUDENT_QUERY = gql`
  query GetCurrentStudent {
    getCurrentStudent {
      id
      uuid
      contactDetail {
        firstName
        lastName
        phoneNumber {
          countryCode
          number
        }
        email
      }
      profileImage {
        filename
      }
    }
  }
`;

export const GET_CURRENT_TUTOR_QUERY = gql`
  query GetCurrentTutor {
    getCurrentTutor {
      id
      uuid
      contactDetail {
        firstName
        lastName
        phoneNumber {
          countryCode
          number
        }
        email
      }
      profileImage {
        filename
      }
    }
  }
`;
