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
        startDate
        endDate
        fieldOfStudy
        higherSecondaryStream
        board
        grade
        subjects
        isCurrent
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
        startDate
        endDate
        fieldOfStudy
        higherSecondaryStream
        board
        grade
        subjects
        isCurrent
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
