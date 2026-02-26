# @qpay-sdk/nestjs

[![npm](https://img.shields.io/npm/v/@qpay-sdk/nestjs)](https://www.npmjs.com/package/@qpay-sdk/nestjs)
[![CI](https://github.com/qpay-sdk/qpay-nestjs/actions/workflows/ci.yml/badge.svg)](https://github.com/qpay-sdk/qpay-nestjs/actions)

QPay V2 payment module for NestJS.

## Install

```bash
npm install @qpay-sdk/nestjs qpay-js
```

## Usage

```typescript
import { QPayModule } from '@qpay-sdk/nestjs';

@Module({
  imports: [
    QPayModule.forRoot({
      baseUrl: 'https://merchant.qpay.mn',
      username: 'your_username',
      password: 'your_password',
      invoiceCode: 'YOUR_CODE',
      callbackUrl: 'https://yoursite.com/qpay/webhook',
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
QPayModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    baseUrl: config.get('QPAY_BASE_URL'),
    username: config.get('QPAY_USERNAME'),
    password: config.get('QPAY_PASSWORD'),
    invoiceCode: config.get('QPAY_INVOICE_CODE'),
    callbackUrl: config.get('QPAY_CALLBACK_URL'),
  }),
  inject: [ConfigService],
})
```

### Inject Service

```typescript
import { QPayService } from '@qpay-sdk/nestjs';

@Injectable()
export class PaymentService {
  constructor(private readonly qpay: QPayService) {}

  async createPayment() {
    return this.qpay.createSimpleInvoice({
      invoiceCode: 'YOUR_CODE',
      senderInvoiceNo: 'ORDER-001',
      amount: 10000,
      callbackUrl: 'https://yoursite.com/qpay/webhook',
    });
  }
}
```

## License

MIT
