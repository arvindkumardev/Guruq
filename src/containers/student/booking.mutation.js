import { gql } from '@apollo/client';
import { CreateUpdateAddressDto } from '../common/graphql-types';

export const ADD_INTERESTED_OFFERINGS = gql`
  mutation CreateBooking($orderCreateDto: OrderCreateDto) {
    createBooking(orderCreateDto: $orderCreateDto) {
      id
      serviceAddress {
        id
      }
      billingAddress {
        id
        country
        state
        city
        fullAddress
        postalCode
      }
      payableAmount
      paymentStatus
      orderPayments {
        id
        paymentMethod
        paymentStatus
        payee {
          id
          firstName
          lastName
        }
      }
      orderItems {
        id
      }
    }
  }
`;

// mutation {
//   addToCart(
//     cartCreateDto: {
//       tutorOfferingId: 20113
//       count: 5
//       groupSize: 1
//       demo: false
//       onlineClass: false
//       price: 500
//       pointsRedeemed: 0
//     }
//   ) {
//     id
//     offering {
//       id
//       name
//     }
//     tutor {
//       id
//     }
//     tutorOffering {
//       id
//     }
//     count
//     groupSize
//     price
//     demo
//     onlineClass
//     pointsRedeemed
//     payees {
//       id
//     }
//     promotion {
//       id
//     }
//   }
// }


// mutation {
//   createBooking(
//     orderCreateDto: {
//       serviceAddress: { id: 258747 }
//       billingAddress: {
//         type: 6
//         fullAddress: "Dwarka Sector 21"
//         country: "India"
//         state: "Delhi"
//         city: "New Delhi"
//         subArea: "CP"
//         postalCode: 110001
//       }
//       itemPrice: 1200
//       convenienceCharges: 50
//       redeemQPoints: 0
//       orderPayment: { amount: 1200, paymentMethod: 1 }
//     }
//   ) {
//     id
//     serviceAddress {
//       id
//     }
//     billingAddress {
//       id
//       country
//       state
//       city
//       fullAddress
//       postalCode
//     }
//     payableAmount
//     orderPayment {
//       id
//       paymentMethod
//       paymentStatus
//     }
//     orderItems {
//       id
//     }
//   }
// }



// mutation {
//   makePayment(orderId: 3, paymentMethod: 6, transactionDetails: "") {
//     id
//     orderStatus
//     payableAmount
//     orderPayment {
//       amount
//       id
//       paymentStatus
//       paymentMethod
//     }
//   }
// }


// mutation {
//   scheduleClass(
//     classesCreateDto: {
//       orderItemId: 3
//       startDate: "2020-11-08T15:00:00Z"
//       endDate: "2020-11-08T16:00:00Z"
//     }
//   ) {
//     id
//     uuid
//     orderItem {
//       id
//     }
//     student {
//       id
//     }
//     tutor {
//       id
//     }
//     offering {
//       id
//     }
//     onlineClass
//     demo
//
//     startDate
//     endDate
//   }
// }





export class OrderPaymentDto {
  amount: number;

  paymentMethod: number;
}

export class OrderCreateDto {
  serviceAddress: CreateUpdateAddressDto;

  billingAddress: CreateUpdateAddressDto;

  itemPrice: number;

  convenienceCharges: number;

  redeemQPoints: number;

  orderPayment: OrderPaymentDto;

  promotionId: number;
}
