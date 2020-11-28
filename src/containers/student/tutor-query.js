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
        }
        profileCompletion
        contactDetail {
          firstName
          lastName
          gender
        }
        tutorOfferings {
          id
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
              city
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
          subjects
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
      }
    }
  }
`;

export const GET_TUTOR_OFFERINGS = gql`
  query GetTutorOfferings($tutorId: Float!) {
    getTutorOfferings(tutorId: $tutorId) {
      id
      freeDemo
      tutor {
        id
      }
      offering {
        id
        displayName
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
  query GetFavouriteTutors {
    getFavouriteTutors {
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
