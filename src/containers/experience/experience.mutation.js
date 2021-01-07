import { gql } from '@apollo/client';

export const DELETE_TUTOR_EXPERIENCE = gql`
  mutation DeleteExperienceDetail($id: Int!) {
    deleteExperienceDetail(id: $id) {
      id
    }
  }
`;

export const ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS = gql`
  mutation AddUpdateExperienceDetail($experienceDto: CreateUpdateExperienceDto!) {
    addUpdateExperienceDetail(experienceDto: $experienceDto) {
      id
      title
      employmentType
      institution {
        name
      }
      startDate
      endDate
      current
    }
  }
`;
