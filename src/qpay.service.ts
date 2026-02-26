import { Injectable, Inject } from '@nestjs/common';
import { QPayClient } from 'qpay-js';
import { QPAY_CLIENT } from './constants';

@Injectable()
export class QPayService {
  constructor(@Inject(QPAY_CLIENT) private readonly client: QPayClient) {}

  async createInvoice(request: any) {
    return this.client.createInvoice(request);
  }

  async createSimpleInvoice(request: any) {
    return this.client.createSimpleInvoice(request);
  }

  async cancelInvoice(invoiceId: string) {
    return this.client.cancelInvoice(invoiceId);
  }

  async getPayment(paymentId: string) {
    return this.client.getPayment(paymentId);
  }

  async checkPayment(request: any) {
    return this.client.checkPayment(request);
  }

  async listPayments(request: any) {
    return this.client.listPayments(request);
  }

  getClient(): QPayClient {
    return this.client;
  }
}
