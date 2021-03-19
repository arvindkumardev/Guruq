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
          original
        }
        contactDetail {
          firstName
          lastName
          gender
        }
      }
      tutorOffering {
        id
        minBudgetPrice
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
      mrp
      onlineClass
      pointsRedeemed
      payees {
        id
      }
      promotion {
        id
        active
        title
        code
        isPercentage
        discount
        maxDiscount
        expiryDate
        useLimit
        usedCount
        firstTimeBookingOnly
        minCartAmount
        maxCartAmount
      }
      pytnEntity {
        id
      }
    }
  }
`;

export const SEARCH_BOOKINGS = gql`
  query SearchBookings($searchDto: BookingSearchDto!) {
    searchBookings(searchDto: $searchDto) {
      edges {
        id
        subTotal
        createdDate
        convenienceCharges
        pointsRedeemed
        payableAmount
        orderId
        orderItems {
          id
        }
        orderStatus
      }
    }
  }
`;

export const GET_CANCELLATION_SUMMARY = gql`
  query CancelOrderItemSummary($orderItemId: Int!) {
    cancelOrderItemSummary(orderItemId: $orderItemId) {
      total
      taken
      scheduled
      unscheduled
      amount
      refund
    }
  }
`;

export const GET_BOOKING_DETAIL = gql`
  query GetBookingDetails($id: Int!) {
    getBookingDetails(id: $id) {
      id
      orderStatus
      subTotal
      createdDate
      convenienceCharges
      pointsRedeemed
      payableAmount
      discount
      orderId
      promotion {
        code
      }
      orderItems {
        id
        count
        availableClasses
        onlineClass
        demo
        count
        groupSize
        mrp
        price
        pointsRedeemed
        orderStatus
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
            original
          }
          contactDetail {
            firstName
            lastName
          }
        }
        refund {
          id
          amount
        }
      }
      orderStatus
      orderPayment {
        id
        paymentStatus
        paymentMethod
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
            original
          }
          contactDetail {
            firstName
            lastName
          }
        }
        createdBy {
          id
          profileImage {
            id
            filename
            original
          }
          firstName
          lastName
        }
        order {
          id
          uuid
          orderId
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
          original
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
          original
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
      groupClass
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
            original
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
