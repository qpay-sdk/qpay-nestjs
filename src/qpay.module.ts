import { DynamicModule, Module, Global } from '@nestjs/common';
import { QPayClient } from 'qpay-js';
import { QPAY_OPTIONS, QPAY_CLIENT } from './constants';
import { QPayModuleOptions, QPayModuleAsyncOptions } from './interfaces/qpay-module-options.interface';
import { QPayService } from './qpay.service';

@Global()
@Module({})
export class QPayModule {
  static forRoot(options: QPayModuleOptions): DynamicModule {
    const clientProvider = {
      provide: QPAY_CLIENT,
      useFactory: () => new QPayClient(options),
    };

    return {
      module: QPayModule,
      providers: [
        { provide: QPAY_OPTIONS, useValue: options },
        clientProvider,
        QPayService,
      ],
      exports: [QPayService, QPAY_CLIENT],
    };
  }

  static forRootAsync(options: QPayModuleAsyncOptions): DynamicModule {
    const clientProvider = {
      provide: QPAY_CLIENT,
      useFactory: (config: QPayModuleOptions) => new QPayClient(config),
      inject: [QPAY_OPTIONS],
    };

    const asyncProvider = {
      provide: QPAY_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: QPayModule,
      imports: options.imports || [],
      providers: [asyncProvider, clientProvider, QPayService],
      exports: [QPayService, QPAY_CLIENT],
    };
  }
}
