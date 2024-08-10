import { Brand } from './brand';

export class PaymentBill {

paymentBillId: string;
paymentBillStatus: number;
brandId: string;
paymentReferenceId: string;
billPrice: number;
validUntil: string;
brand: Brand;
}

