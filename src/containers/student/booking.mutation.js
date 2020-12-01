import { gql } from '@apollo/client';
import { CreateUpdateAddressDto } from '../common/graphql-types';

export const ADD_INTERESTED_OFFERINGS = gql`
  mutation CreateBooking($orderCreateDto: OrderCreateDto!) {
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
  mutation RemoveFromCart($cartItemId: Float!) {
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
    scheduleClass(
      classesCreateDto: { orderItemId: 7, startDate: "2020-11-12T15:00:00Z", endDate: "2020-11-12T16:00:00Z" }
    ) {
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
