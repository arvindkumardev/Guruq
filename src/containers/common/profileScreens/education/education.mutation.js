import { gql } from '@apollo/client';

export const ADD_UPDATE_EDUCATION_DETAILS = gql`
  mutation AddUpdateEducationDetail($educationDto: CreateUpdateEducationDto!) {
    addUpdateEducationDetail(educationDto: $educationDto) {
      id
      school {
        name
      }
      degree {
        id
        name
        degreeLevel
      }
      board
      grade
      subjects
      fieldOfStudy
      startDate
      endDate
      isCurrent
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
