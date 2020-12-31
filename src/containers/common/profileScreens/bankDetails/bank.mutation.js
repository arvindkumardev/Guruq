import { gql } from '@apollo/client';

export const DELETE_BANK_DETAIL = gql`
  mutation DeleteBankDetails($id: Int!) {
    deleteBankDetails(id: $id)
  }
`;

export const ADD_UPDATE_BANK_DETAILS = gql`
  mutation UpdateBankDetails($bankDetailsDto: CreateUpdateBankDetailsDto!) {
    updateBankDetails(bankDetailsDto: $bankDetailsDto) {
      id
      accountHolder
      bankName
      branchAddress
      accountNumber
      ifscCode
    }
  }
`;
