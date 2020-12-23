import { gql } from '@apollo/client';

export const GENERATE_OTP_MUTATION = gql`
  mutation GenerateMobileOtp($countryCode: String!, $number: String!) {
    generateMobileOtp(phoneNumber: { countryCode: $countryCode, number: $number }) {
      countryCode
      number
    }
  }
`;

export const VERIFY_PHONE_NUMBER_MUTATION = gql`
  mutation VerifyPhoneNumber($countryCode: String!, $number: String!, $otp: String!) {
    verifyPhoneNumber(phoneNumber: { countryCode: $countryCode, number: $number }, otp: $otp) {
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $phoneNumber: PhoneNumberInputDto!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $referCode: String!
  ) {
    signUp(
      user: {
        phoneNumber: $phoneNumber
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        referralCode: $referCode
      }
    ) {
      id
      token
      firstName
      lastName
      email
      isPasswordSet
      isPhoneNumberVerified
      isEmailVerified
      token
      type
      phoneNumber {
        countryCode
        number
      }
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation SignIn($countryCode: String!, $number: String!, $password: String!) {
    signIn(phoneNumber: { countryCode: $countryCode, number: $number }, password: $password) {
      id
      firstName
      lastName
      email
      isPasswordSet
      isPhoneNumberVerified
      isEmailVerified
      token
      type
      phoneNumber {
        countryCode
        number
      }
    }
  }
`;

export const SET_PASSWORD_MUTATION = gql`
  mutation SetPassword($password: String!) {
    setPassword(password: $password) {
      id
      firstName
      lastName
      email
      isPasswordSet
      isPhoneNumberVerified
      isEmailVerified
      token
      type
      phoneNumber {
        countryCode
        number
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($countryCode: String!, $number: String!) {
    forgotPassword(phoneNumber: { countryCode: $countryCode, number: $number }) {
      countryCode
      number
    }
  }
`;

export const CREATE_STUDENT = gql`
  mutation CreateStudent {
    createStudent {
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

export const CREATE_TUTOR = gql`
  mutation CreateTutor {
    createTutor {
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
    }
  }
`;

export const ADD_ENQUIRY = gql`
  mutation AddInquiry($inquiryDto: CreateUpdateInquiryDto!) {
    addInquiry(inquiryDto: $inquiryDto) {
      id
    }
  }
`;
