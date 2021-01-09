import { gql } from '@apollo/client';

export const DELETE_AWARD_DETAIL = gql`
  mutation DeleteAwardDetail($id: Int!) {
    deleteAwardDetail(id: $id) {
      id
    }
  }
`;

export const ADD_UPDATE_AWARD_DETAILS = gql`
  mutation AddUpdateAwardDetail($awardDto: CreateUpdateAwardDto!) {
    addUpdateAwardDetail(awardDto: $awardDto) {
      id
    }
  }
`;
