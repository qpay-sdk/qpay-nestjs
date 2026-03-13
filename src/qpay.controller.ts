import { Controller, Get, Query, Header } from '@nestjs/common';
import { QPayService } from './qpay.service';

@Controller('qpay')
export class QPayWebhookController {
  constructor(private readonly qpayService: QPayService) {}

  @Get('webhook')
  @Header('Content-Type', 'text/plain')
  async handleWebhook(
    @Query('qpay_payment_id') paymentId?: string,
  ): Promise<string> {
    if (!paymentId) {
      return 'ERROR: Missing qpay_payment_id';
    }

    try {
      await this.qpayService.checkPayment({
        objectType: 'INVOICE',
        objectId: paymentId,
      });
      return 'SUCCESS';
    } catch {
      return 'SUCCESS';
    }
  }
}
