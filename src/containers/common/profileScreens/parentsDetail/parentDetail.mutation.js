import { gql } from '@apollo/client';

export const DELETE_PARENT_INFO= gql`
  mutation DeleteStudentParentInfo($id: Int!) {
    deleteStudentParentInfo(id: $id)
  }
`;

export const ADD_UPDATE_GUARDIAN_DETAILS = gql`
  mutation AddUpdateStudentParentInfo($guardianInfoDto: CreateUpdateGuardianInfoDto!) {
    addUpdateStudentParentInfo(guardianInfoDto: $guardianInfoDto) {
      id
    }
  }
`;
