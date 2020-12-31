import { gql } from '@apollo/client';

export const GET_BANK_DEATILS_LIST = gql`
  query GetTutorDetails {
    getTutorDetails {
      bankDetails {
        id
        accountHolder
        bankName
        branchAddress
        accountNumber
        ifscCode
        primary
      }
    }
  }
`;
