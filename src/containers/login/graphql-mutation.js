import {gql} from '@apollo/client';

export const GENERATE_OTP_MUTATION = gql`
  mutation GenerateMobileOtp($countryCode: String!, $number: String!) {
    generateMobileOtp(phoneNumber: { countryCode: $countryCode, number: $number }) {
       countryCode
        number
    }
  }
`;
