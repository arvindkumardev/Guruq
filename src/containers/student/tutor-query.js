import { gql } from '@apollo/client';

export const SEARCH_TUTORS = gql`
  query SearchTutors($page: Int!, $size: Int!) {
    searchTutors(searchDto: { page: $page, size: $size }) {
      edges {
        id
        teachingExperience
        averageRating
        reviewCount
        profileImage {
          id
          name
          filename
        }
        profileCompletion
        contactDetail {
          firstName
          lastName
          gender
        }
        tutorOfferings {
          id
          offering {
            id
            name
            displayName
            level
          }
          offerings {
            id
            name
            displayName
            level
          }
        }
        experienceDetails {
          id
          institution
        }
        documents {
          id
          name
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
          startYear
          endYear
          isCurrent
        }
      }
    }
  }
`;
