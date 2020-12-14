import { gql } from '@apollo/client';
import { CreateUpdateAddressDto } from '../common/graphql-types';

export const ADD_INTERESTED_OFFERINGS = gql`
  mutation CreateBooking($orderCreateDto: OrderCreateDto!) {
    createBooking(orderCreateDto: $orderCreateDto) {
      id
      serviceAddress {
        id
        street
        subArea
        city
        state
        country
        postalCode
        landmark
        fullAddress
        location {
          latitude
          longitude
        }
      }
      billingAddress {
        id
        street
        subArea
        city
        state
        country
        postalCode
        landmark
        fullAddress
        location {
          latitude
          longitude
        }
      }
      payableAmount
      orderPayment {
        id
        paymentMethod
        paymentStatus
        amount
      }
      orderItems {
        id
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartCreateDto: CartCreateDto!) {
    addToCart(cartCreateDto: $cartCreateDto) {
      id
      active
      deleted
      offering {
        id
        displayName
      }
      tutor {
        id
      }
      tutorOffering {
        id
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

export const REMOVE_CART_ITEM = gql`
  mutation RemoveFromCart($cartItemId: Int!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

// mutation {
//   addBackToCart(cartItemId: 10) {
//     id
//     active
//     deleted
//   }
// }

export const MAKE_PAYMENT = gql`
  mutation MakePayment($paymentDetails: PaymentDto!) {
    makePayment(paymentDetails: $paymentDetails) {
      id
      uuid
      orderStatus
      payableAmount
      orderPayment {
        amount
        id
        paymentStatus
        paymentMethod
      }
    }
  }
`;

export const SCHEDULE_CLASS = gql`
  mutation ScheduleClass($classesCreateDto: CreateUpdateClassesDto!) {
    scheduleClass(classesCreateDto: $classesCreateDto) {
      id
      uuid
      orderItem {
        id
      }
      students {
        id
      }
      tutor {
        id
      }
      offering {
        id
      }
      onlineClass
      demo

      startDate
      endDate
    }
  }
`;

export const CHECK_COUPON = gql`
  mutation CheckCoupon($code: String!) {
    checkCoupon(code: $code) {
      id
      version
      deleted
      active
      code
      isPercentage
      discount
      maxDiscount
      expiry
    }
  }
`;

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
