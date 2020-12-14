export const PaymentMethodEnum = {
  ONLINE: { value: 1, label: 'ONLINE' },
  CREDIT_DEBIT_CARD: { value: 2, label: 'CREDIT_DEBIT_CARD' },
  BANK_TRANSFER: { value: 3, label: 'BANK_TRANSFER' },
  PAYTM: { value: 4, label: 'PAYTM' },
  PAYPAL: { value: 5, label: 'PAYPAL' },
  CASH: { value: 6, label: 'CASH' },
  Q_POINTS: { value: 7, label: 'Q_POINTS' },
};

export const OrderPaymentStatusEnum = {
  COMPLETE: { value: 1, label: 'COMPLETE' },

  PENDING: { value: 2, label: 'PENDING' },
  FAILED: { value: 3, label: 'FAILED' },
  PARTIAL: { value: 4, label: 'PARTIAL' },

  REFUND: { value: 5, label: 'REFUND' },
  PARTIAL_REFUND: { value: 6, label: 'PARTIAL_REFUND' },
  CANCELLED: { value: 7, label: 'CANCELLED' },
};

export const OrderStatusEnum = {
  COMPLETE: { value: 1, label: 'COMPLETE' },
  PENDING: { value: 2, label: 'PENDING' },
  CANCELLED: { value: 3, label: 'CANCELLED' },
  REFUNDED: { value: 4, label: 'REFUNDED' },
};
