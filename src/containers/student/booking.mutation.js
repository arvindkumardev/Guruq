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
