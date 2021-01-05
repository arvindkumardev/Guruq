import { gql } from '@apollo/client';

export const GET_TUTION_NEED_LISTING = gql`
  query SearchStudentPYTN($searchDto: StudentPYTNSearchDto!) {
    searchStudentPYTN(searchDto: $searchDto) {
      edges {
        id
        offering {
          id
          displayName
          parentOffering {
            id
            displayName
            parentOffering {
              id
              displayName
            }
          }
        }
        count
        groupSize
        onlineClass
        minPrice
        maxPrice
        acceptedPytns {
          id
          price
        }
        student {
          id
          contactDetail {
            firstName
            lastName
            gender
          }
          profileImage {
            filename
          }
        }
      }
    }
  }
`;

export const GET_ACCEPTED_TUTOR_NEED = gql`
  query GetStudentPytnAccepted($acceptedSearchDto: StudentPytnAcceptedSearchDto!) {
    getStudentPytnAccepted(acceptedSearchDto: $acceptedSearchDto) {
      edges {
        studentPytnEntity {
          id
        }
        tutor {
          id
          teachingExperience
          averageRating
          reviewCount
          profileImage {
            id
            name
            filename
          }
          contactDetail {
            firstName
            lastName
            gender
          }
          experienceDetails {
            id
            institution {
              name
              address {
                id
                city
                state
                country
                latitude
                longitude
              }
            }
          }
          educationDetails {
            id
            school {
              id
              name
            }
            degree {
              id
              name
              degreeLevel
            }
            fieldOfStudy
            subjects
            board
            startDate
            endDate
            isCurrent
          }
        }
        id
        price
      }
    }
  }
`;

export const SEARCH_TUTOR_PYTN_REQUESTS = gql`
  query SearchTutorPYTN($searchDto: StudentPYTNSearchDto!) {
    searchTutorPYTN(searchDto: $searchDto) {
      edges {
        id
        offering {
          id
          displayName
          parentOffering {
            id
            displayName
            parentOffering {
              id
              displayName
            }
          }
        }
        count
        groupSize
        onlineClass
        minPrice
        maxPrice
        acceptedPytns {
          id
          price
        }
      }
    }
  }
`;
