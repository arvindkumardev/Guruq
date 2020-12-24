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
      certified
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

export const SEARCH_QPOINTS_TRANSACTIONS = gql`
  query SearchQPointTransaction($searchDto: SearchQPointDto!) {
    searchQPointTransaction(searchDto: $searchDto) {
      edges {
        points
        pointType {
          action
          actionType
          description
          points
          title
        }
        createdDate
      }
    }
  }
`;

export const SEARCH_IN_INQUIRY = gql`
  query SearchInquiry($searchDto: SearchInquiryDto!) {
    searchInquiry(searchDto: $searchDto) {
      edges {
        title
        text
      }
    }
  }
`;
