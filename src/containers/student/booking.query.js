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
    getScheduledClasses(
      classesSearchDto: { studentId: 19655, startDate: "2020-11-09T00:00:00Z", endDate: "2020-11-15T17:00:00Z" }
    ) {
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

// query {
//   getBookings {
//     id
//     uuid
//     orderStatus
//     owner {
//       id
//     }
//     orderItems {
//       id
//       count
//       availableClasses
//       onlineClass
//       demo
//       count
//       groupSize
//
//       offering {
//         id
//         name
//         parentOffering {
//           id
//           name
//           parentOffering {
//             id
//             name
//           }
//         }
//       }
//       tutor {
//         id
//         profileImage {
//           id
//           filename
//         }
//         contactDetail {
//           firstName
//           lastName
//         }
//       }
//     }
//     orderStatus
//     orderPayment {
//       id
//       paymentStatus
//     }
//   }
// }
