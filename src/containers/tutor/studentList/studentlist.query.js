import { gql } from '@apollo/client';

export const GET_MY_STUDENT_LIST = gql`
  query GetMyStudentList($page: Int!, $limit: Int!) {
    getTutorStudents(page: $page, limit: $limit) {
      edges {
        id
        profileImage {
          id
          filename
          original
        }
        contactDetail {
          firstName
          lastName
          gender
        }
        educationDetails {
          board
          grade
          isCurrent  
        }
        interestedOfferings {
          id
          offering {
            id
            name
            displayName
            slug
            parentOffering {
              id
              name
              displayName
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`;

export const GET_STUDENT_BY_OFFERING_ID = gql`
  query GetMyStudentList($page: Int!, $limit: Int, $offeringId: Int!) {
    getTutorStudents(page: $page, limit: $limit, offeringId: $offeringId) {
      edges {
        id
        profileImage {
          id
          filename
          original
        }
        contactDetail {
          firstName
          lastName
          gender
        }
        educationDetails {
          board
          grade
          isCurrent
        }
        interestedOfferings {
          id
          offering {
            id
            name
            displayName
            slug
            parentOffering {
              id
              name
              displayName
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`;