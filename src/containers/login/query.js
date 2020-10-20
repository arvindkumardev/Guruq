import { gql } from '@apollo/client';

export const CHECK_USER = gql`
  query CheckUser($countryCode: String!, $number: String!) {
    checkUser(phoneNumber: { countryCode: $countryCode, number: $number }) {
      isPasswordSet
    }
  }
`;
