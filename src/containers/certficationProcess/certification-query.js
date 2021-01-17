import { gql } from '@apollo/client';

export const GET_TUTOR_LEAD_DETAIL = gql`
  query GetTutorLeadDetails {
    getTutorLeadDetails {
      id
      tutorOffering {
        id
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
      }

      tutorProficiencyTest {
        id
        status
        score
        notAttempted
        maxMarks
      }
      certificationStage
      backgroundCheck {
        status
      }
    }
  }
`;

export const GET_TUTOR_OFFERING_DETAIL = gql`
  query GetTutorOfferingDetails($tutorOfferingId: Int!) {
    getTutorOfferingDetails(tutorOfferingId: $tutorOfferingId) {
      id
      offering {
        id
        displayName
        level
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
        displayName
        level
      }
      stage
      allowedPTAttempts

      tutorProficiencyTests {
        id
        status
        score
        notAttempted
        maxMarks
        proficiencyTest {
          id
        }
      }
    }
  }
`;

export const GET_TUTOR_ALL_DETAILS = gql`
  query GetTutorDetails {
    getTutorDetails {
      id
      contactDetail {
        firstName
        lastName
        email
        dob
        phoneNumber {
          countryCode
          number
        }
        gender
      }
      lead {
        id
        uuid
        certificationStage
        interview {
          status
          startDate
          endDate
          mode
          conductedBy {
            id
            firstName
            lastName
          }
        }
      }
      profileCompletion
      certified
      certifiedDate
      addresses {
        id
        type
        street
        subArea
        city
        state
        country
        postalCode
        landmark
        fullAddress
        latitude
        longitude
        primary
      }
      tutorOfferings {
        id
        offerings {
          id
          name
          displayName
        }
        offering {
          id
          name
          displayName
          parentOffering {
            id
            name
            displayName
          }
          rootOffering {
            name
            displayName
          }
        }
        tutorProficiencyTests {
          status
          score
        }
      }

      educationDetails {
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
        fieldOfStudy
        startDate
        endDate
        isCurrent
        active
      }
      experienceDetails {
        id
        title
        employmentType
        institution {
          name
        }
        startDate
        endDate
        current
        active
      }
      awards {
        id
        title
        description
        issuer
        address {
          id
          city
          state
          country
        }
        date
        document {
          id
          name
          type
          attachment {
            id
            name
            type
            filename
            size
            original
          }
        }
      }
      documents {
        id
        name
        type
        attachment {
          id
          name
          type
          filename
          size
          original
        }
      }
      bankDetails {
        id
        accountHolder
        bankName
        branchAddress
        accountNumber
        ifscCode
      }
    }
  }
`;

export const GET_TUTOR_LEAD_INTERVIEW_DETAILS = gql`
  query GetTutorLeadDetails {
    getTutorLeadDetails {
      id
      uuid
      certificationStage
      interview {
        status
        startDate
        endDate
        mode
        conductedBy {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
