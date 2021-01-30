import { gql } from '@apollo/client';

export const SEARCH_TUTORS = gql`
  query SearchTutors($searchDto: TutorSearchDto!) {
    searchTutors(searchDto: $searchDto) {
      edges {
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
        profileCompletion
        contactDetail {
          firstName
          lastName
          gender
          phoneNumber {
            countryCode
            number
          }
        }
        tutorOfferings {
          id
          minBudgetPrice
          # offering {
          #   id
          #   name
          #   displayName
          #   level
          # }
          offerings {
            id
            name
            displayName
            level
            parentOffering {
              id
              name
              displayName
              level
              parentOffering {
                id
                name
                displayName
                level
              }
            }
          }
          budgets {
            id
            count
            groupSize
            onlineClass
            price
            demo
          }
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
          board
          startDate
          endDate
          isCurrent
        }
      }
      pageInfo {
        page
        limit
        size
        count
        totalPages
      }
    }
  }
`;

export const GET_TUTOR_OFFERINGS = gql`
  query GetTutorOfferings($tutorId: Int!, $parentOfferingId: Int) {
    getTutorOfferings(tutorId: $tutorId, parentOfferingId: $parentOfferingId) {
      id
      demoClass
      freeDemo
      onlineClass
      groupClass
      minBudgetPrice
      tutor {
        id
      }
      offering {
        id
        displayName
        parentOffering {
          id
          level
          displayName
          parentOffering {
            id
            level
            displayName
          }
        }
        rootOffering {
          id
          displayName
        }
      }
      offerings {
        id
        level
        displayName
        parentOffering {
          id
          level
          displayName
          parentOffering {
            id
            level
            displayName
          }
        }
        rootOffering {
          id
          displayName
        }
      }
      budgets {
        id
        price
        groupSize
        count
        onlineClass
        demo
      }
    }
  }
`;

export const GET_FAVOURITE_TUTORS = gql`
  query GetFavouriteTutors($parentOfferingId: Int!) {
    getFavouriteTutors(parentOfferingId: $parentOfferingId) {
      id
      tutor {
        id
        teachingExperience
        averageRating
        reviewCount
        contactDetail {
          firstName
          lastName
        }
        profileImage {
          id
          filename
          original
        }
        tutorOfferings {
          id
          offerings {
            id
            level
            displayName
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
    }
  }
`;

export const GET_AVERAGE_RATINGS = gql`
  query GetAverageRating($reviewSearchDto: ReviewSearchDto!) {
    getAverageRating(reviewSearchDto: $reviewSearchDto) {
      courseUnderstanding
      helpfulness
      professionalAttitude
      teachingMethodology
      accessibility
      resultImprovement
      overallRating
    }
  }
`;

export const SEARCH_REVIEW = gql`
  query SearchReview($reviewSearchDto: ReviewSearchDto!) {
    searchReview(reviewSearchDto: $reviewSearchDto) {
      edges {
        id
        courseUnderstanding
        helpfulness
        professionalAttitude
        teachingMethodology
        accessibility
        resultImprovement
        overallRating
        text
        createdDate
        createdBy {
          id
          firstName
          lastName
          gender
          profileImage {
            filename
            original
          }
        }
      }
    }
  }
`;

export class SearchDto {
  id: number;

  active: boolean;

  deleted: boolean;

  userId: number;

  page: number = 1;

  size: number = 20;

  sortBy: string = 'id';

  sortOrder: string = 'ASC';
}

export class TutorSearchDto extends SearchDto {
  firstName: string;

  lastName: string;

  certified: boolean;

  offeringId: number;

  degreeLevel: number;

  minExperience: number;

  maxExperience: number;

  averageRating: number;

  minBudget: number;

  maxBudget: number;

  teachingMode: number;
}
