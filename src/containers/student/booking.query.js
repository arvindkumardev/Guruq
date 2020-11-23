import { gql } from '@apollo/client';

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    getCartItems {
      id
      active
      deleted
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
      tutor {
        id
        profileImage {
          id
          filename
        }
        contactDetail {
          firstName
          lastName
          gender
        }
      }
      tutorOffering {
        id
        budgets {
          id
          price
          groupSize
          count
          onlineClass
          demo
        }
      }
      count
      groupSize
      price
      demo
      onlineClass
      pointsRedeemed
      payees {
        id
      }
      promotion {
        id
      }
    }
  }
`;

export const GET_PENDING_BOOKINGS = gql`
  query GetPendingBooking {
    getPendingBooking {
      id
      uuid
      orderStatus
      owner {
        id
      }
      orderItems {
        id
      }
      orderStatus
      payableAmount
      orderPayment {
        id
        paymentStatus
        amount
      }
    }
  }
`;

export const GET_SCHEDULED_CLASSES = gql`
  query GetScheduledClasses($classesSearchDto: ClassesSearchDto!) {
    getScheduledClasses(classesSearchDto: $classesSearchDto) {
      id
      uuid

      students {
        id
        contactDetail {
          firstName
          lastName
        }
      }
      tutor {
        id
        contactDetail {
          firstName
          lastName
        }
      }
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
      onlineClass
      demo
      status
      startDate
      endDate
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetBookings {
    getBookings {
      id
      uuid
      orderStatus
      owner {
        id
      }
      orderItems {
        id
        count
        availableClasses
        onlineClass
        demo
        count
        groupSize

        offering {
          id
          name
          parentOffering {
            id
            name
            parentOffering {
              id
              name
            }
          }
        }
        tutor {
          id
          profileImage {
            id
            filename
          }
          contactDetail {
            firstName
            lastName
          }
        }
      }
      orderStatus
      orderPayment {
        id
        paymentStatus
      }
    }
  }
`;
