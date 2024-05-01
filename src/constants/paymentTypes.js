const paymentTypes = [
  {
    id: 1,
    name: 'Cash',
    value: 'Cash',
  },
  {
    id: 2,
    name: 'Gpay',
    value: 'Gpay',
  },
  {
    id: 3,
    name: 'PhonePe',
    value: 'PhonePe',
  },
  {
    id: 6,
    name: 'Paytm',
    value: 'Paytm',
  },
  {
    id: 4,
    name: 'CreditCard',
    value: 'CreditCard',
  },
  {
    id: 5,
    name: 'DebitCard',
    value: 'DebitCard',
  },
  {
    id: 7,
    name: 'UPI',
    value: 'UPI',
  },
  {
    id: 8,
    name: 'Card',
    value: 'Card',
  },
];

const PAYMENT_TYPES = {
  CASH: 1,
  Gpay: 2,
  PhonePe: 3,
  CreditCard: 4,
  DebitCard: 5,
  Paytm: 6,
  UPI:7,
  Card:8
};

module.exports = { paymentTypes, PAYMENT_TYPES };
