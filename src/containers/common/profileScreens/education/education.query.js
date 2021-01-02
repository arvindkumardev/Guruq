import { gql } from '@apollo/client';

export const GET_TUTOR_EDUCATION_DETAILS = gql`
  query GetTutorDetails {
    getTutorDetails {
      educationDetails {
        id
        school {
          name
        }
        degree {
          name
          degreeLevel
        }
        fieldOfStudy
        higherSecondaryStream
        board
        grade
        subjects
      }
    }
  }
`;

export const GET_STUDENT_EDUCATION_DETAILS = gql`
  query GetStudentDetails {
    getStudentDetails {
      educationDetails {
        id
        school {
          name
        }
        degree {
          name
        }
        fieldOfStudy
        higherSecondaryStream
        board
        grade
        subjects
      }
    }
  }
`;

export const GET_DEGREE_LIST = gql`
  query GetDegrees {
    getDegrees {
      edges {
        id
        name
        degreeLevel
      }
    }
  }
`;
