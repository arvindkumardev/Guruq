import {gql} from '@apollo/client';

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
    verifyPhoneNumber(
      phoneNumber: { countryCode: $countryCode, number: $number}
      otp: $otp
    ) {
      countryCode
      number
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp($countryCode: String!, $number: String!, $firstName: String!, $lastName: String!, $email: String!, $password: String!, $referCode: String!) {
    signUp(
      user: {
        phoneNumber: { countryCode: $countryCode, number: $number }
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        referralCode: $referCode
      }
    ) {
      id
      token
    }
  }
`;
