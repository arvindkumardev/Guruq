import { gql } from '@apollo/client';
import { CreateUpdateAddressDto } from '../common/graphql-types';

export const CREATE_BOOKING = gql`
  mutation CreateBooking($orderCreateDto: OrderCreateDto!) {
    createBooking(orderCreateDto: $orderCreateDto) {
      id
      uuid
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
        latitude
        longitude
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

export const RE_SCHEDULE_CLASS = gql`
  mutation RescheduleClass($classesCreateDto: CreateUpdateClassesDto!) {
    rescheduleClass(classesCreateDto: $classesCreateDto) {
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

export const CANCEL_BOOKINGS = gql`
  mutation CancelBooking($orderId: Int!) {
    cancelBooking(orderId: $orderId) {
      id
    }
  }
`;

export const ADD_DOCUMENT_TO_CLASS = gql`
  mutation AddDocumentToClass($documentDto: CreateUpdateDocumentDto!, $classId: Int!) {
    addDocumentToClass(documentDto: $documentDto, classId: $classId) {
      id
      name
      type
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
