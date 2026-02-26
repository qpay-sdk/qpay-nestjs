import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { QPayService } from './qpay.service';

@Controller('qpay')
export class QPayWebhookController {
  constructor(private readonly qpayService: QPayService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: { invoice_id?: string }) {
    const invoiceId = body.invoice_id;
    if (!invoiceId) {
      return { error: 'Missing invoice_id' };
    }

    try {
      const result = await this.qpayService.checkPayment({
        objectType: 'INVOICE',
        objectId: invoiceId,
      });

      if (result.rows && result.rows.length > 0) {
        return { status: 'paid', invoiceId };
      }
      return { status: 'unpaid', invoiceId };
    } catch (err: any) {
      return { error: err.message };
    }
  }
}
