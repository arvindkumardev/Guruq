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
      gender
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
        dob
        gender
      }
      profileImage {
        filename
      }
    }
  }
`;

export const GET_STUDENT_DETAILS = gql`
  query GetStudentDetails {
    getStudentDetails {
      id
      contactDetail {
        firstName
        lastName
        phoneNumber {
          countryCode
          number
        }
        email
        dob
        gender
      }
      profileImage {
        filename
      }
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
        higherSecondaryStream
        board
        grade
        subjects
      }
      guardians {
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
      lead {
        certificationStage
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

export const GET_MY_QPOINTS_BALANCE = gql`
  query getMyBalance {
    getMyBalance {
      earn
      redeem
      balance
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
