import { gql } from '@apollo/client';

export const GET_PYTN_LISTING = gql`
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
        createdDate
        pending
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
            original
          }
        }
      }
    }
  }
`;

export const GET_ACCEPTED_PYTN = gql`
  query GetStudentPytnAccepted($acceptedSearchDto: StudentPytnAcceptedSearchDto!) {
    getStudentPytnAccepted(acceptedSearchDto: $acceptedSearchDto) {
      edges {
        studentPytnEntity {
          id
          pending
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
            original
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
        active
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
        createdDate
        pending
        acceptedPytns {
          id
          price
        }
      }
    }
  }
`;
