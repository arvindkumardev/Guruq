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

export const SEARCH_BOOKINGS = gql`
  query SearchBookings($bookingSearchDto: BookingSearchDto!) {
    searchBookings(searchDto: $bookingSearchDto) {
      edged {
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
  }
`;
export const SEARCH_ORDER_ITEMS = gql`
  query SearchOrderItems($bookingSearchDto: BookingSearchDto!) {
    searchOrderItems(searchDto: $bookingSearchDto) {
      edges {
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
          displayName
          parentOffering {
            id
            name
            displayName
            parentOffering {
              id
              name
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
          }
        }
        order {
          id
          uuid
          orderStatus
          owner {
            id
          }
          orderStatus
          orderPayment {
            id
            paymentStatus
          }
        }
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
      orderItem {
        id
      }
      onlineClass
      demo
      status
      startDate
      endDate
      address {
        id
        city
        state
        country
      }
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
