import { gql } from '@apollo/client';

export const CHECK_USER_QUERY = gql`
  query CheckUser($countryCode: String!, $number: String!) {
    checkUser(phoneNumber: { countryCode: $countryCode, number: $number }) {
      isPasswordSet
    }
  }
`;
