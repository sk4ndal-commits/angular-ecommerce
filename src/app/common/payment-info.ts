export class PaymentInfo {

  constructor(
    public   receiptEmail?: string,
    public amount?: number,
    public currency?: string
  ) {
  }
}
