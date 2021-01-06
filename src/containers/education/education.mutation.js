import { gql } from '@apollo/client';

export const ADD_UPDATE_EDUCATION_DETAILS = gql`
  mutation AddUpdateEducationDetail($educationDto: CreateUpdateEducationDto!) {
    addUpdateEducationDetail(educationDto: $educationDto) {
      id
    }
  }
`;

export const DELETE_TUTOR_EDUCATION_DETAILS = gql`
  mutation DeleteEducationDetail($id: Int!) {
    deleteEducationDetail(id: $id) {
      id
    }
  }
`;
