import 'reflect-metadata';
import { QPayModule } from '../src/qpay.module';
import { QPayService } from '../src/qpay.service';
import { QPAY_OPTIONS, QPAY_CLIENT } from '../src/constants';

jest.mock('qpay-js', () => {
  const MockQPayClient = jest.fn().mockImplementation((config: any) => ({
    config,
    createInvoice: jest.fn(),
    createSimpleInvoice: jest.fn(),
    checkPayment: jest.fn(),
    cancelInvoice: jest.fn(),
    getPayment: jest.fn(),
    listPayments: jest.fn(),
  }));

  return { QPayClient: MockQPayClient };
});

describe('QPayModule', () => {
  const testConfig = {
    baseUrl: 'https://merchant.qpay.mn',
    username: 'test_user',
    password: 'test_pass',
    invoiceCode: 'TEST_CODE',
  };

  describe('forRoot', () => {
    it('should return a dynamic module with correct structure', () => {
      const dynamicModule = QPayModule.forRoot(testConfig);

      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(QPayModule);
    });

    it('should include QPayService in providers', () => {
      const dynamicModule = QPayModule.forRoot(testConfig);
      const providers = dynamicModule.providers || [];

      const hasService = providers.some(
        (p: any) => p === QPayService
      );
      expect(hasService).toBe(true);
    });

    it('should provide QPAY_OPTIONS with the config value', () => {
      const dynamicModule = QPayModule.forRoot(testConfig);
      const providers = dynamicModule.providers || [];

      const optionsProvider = providers.find(
        (p: any) => p.provide === QPAY_OPTIONS
      ) as any;
      expect(optionsProvider).toBeDefined();
      expect(optionsProvider.useValue).toEqual(testConfig);
    });

    it('should provide QPAY_CLIENT with a factory', () => {
      const dynamicModule = QPayModule.forRoot(testConfig);
      const providers = dynamicModule.providers || [];

      const clientProvider = providers.find(
        (p: any) => p.provide === QPAY_CLIENT
      ) as any;
      expect(clientProvider).toBeDefined();
      expect(typeof clientProvider.useFactory).toBe('function');
    });

    it('should create QPayClient from factory with options', () => {
      const { QPayClient } = require('qpay-js');
      const dynamicModule = QPayModule.forRoot(testConfig);
      const providers = dynamicModule.providers || [];

      const clientProvider = providers.find(
        (p: any) => p.provide === QPAY_CLIENT
      ) as any;
      const client = clientProvider.useFactory();

      expect(QPayClient).toHaveBeenCalledWith(testConfig);
      expect(client).toBeDefined();
    });

    it('should export QPayService and QPAY_CLIENT', () => {
      const dynamicModule = QPayModule.forRoot(testConfig);
      const exports = dynamicModule.exports || [];

      expect(exports).toContain(QPayService);
      expect(exports).toContain(QPAY_CLIENT);
    });
  });

  describe('forRootAsync', () => {
    it('should return a dynamic module with correct structure', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });

      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(QPayModule);
    });

    it('should include async provider for QPAY_OPTIONS', () => {
      const factory = jest.fn().mockReturnValue(testConfig);
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: factory,
      });
      const providers = dynamicModule.providers || [];

      const asyncProvider = providers.find(
        (p: any) => p.provide === QPAY_OPTIONS
      ) as any;
      expect(asyncProvider).toBeDefined();
      expect(asyncProvider.useFactory).toBe(factory);
    });

    it('should include QPAY_CLIENT provider that injects QPAY_OPTIONS', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });
      const providers = dynamicModule.providers || [];

      const clientProvider = providers.find(
        (p: any) => p.provide === QPAY_CLIENT
      ) as any;
      expect(clientProvider).toBeDefined();
      expect(clientProvider.inject).toContain(QPAY_OPTIONS);
    });

    it('should pass inject tokens to async provider', () => {
      const CONFIG_SERVICE = 'CONFIG_SERVICE';
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: (configService: any) => testConfig,
        inject: [CONFIG_SERVICE],
      });
      const providers = dynamicModule.providers || [];

      const asyncProvider = providers.find(
        (p: any) => p.provide === QPAY_OPTIONS
      ) as any;
      expect(asyncProvider.inject).toContain(CONFIG_SERVICE);
    });

    it('should default inject to empty array when not provided', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });
      const providers = dynamicModule.providers || [];

      const asyncProvider = providers.find(
        (p: any) => p.provide === QPAY_OPTIONS
      ) as any;
      expect(asyncProvider.inject).toEqual([]);
    });

    it('should include imports when provided', () => {
      const SomeModule = class {};
      const dynamicModule = QPayModule.forRootAsync({
        imports: [SomeModule as any],
        useFactory: () => testConfig,
      });

      expect(dynamicModule.imports).toContain(SomeModule);
    });

    it('should default imports to empty array when not provided', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });

      expect(dynamicModule.imports).toEqual([]);
    });

    it('should export QPayService and QPAY_CLIENT', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });
      const exports = dynamicModule.exports || [];

      expect(exports).toContain(QPayService);
      expect(exports).toContain(QPAY_CLIENT);
    });

    it('should include QPayService in providers', () => {
      const dynamicModule = QPayModule.forRootAsync({
        useFactory: () => testConfig,
      });
      const providers = dynamicModule.providers || [];

      const hasService = providers.some((p: any) => p === QPayService);
      expect(hasService).toBe(true);
    });
  });
});
