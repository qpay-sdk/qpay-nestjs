import 'reflect-metadata';
import { QPayWebhookController } from '../src/qpay.controller';
import { QPayService } from '../src/qpay.service';

describe('QPayWebhookController', () => {
  let controller: QPayWebhookController;
  let mockService: jest.Mocked<QPayService>;

  beforeEach(() => {
    mockService = {
      createInvoice: jest.fn(),
      createSimpleInvoice: jest.fn(),
      cancelInvoice: jest.fn(),
      getPayment: jest.fn(),
      checkPayment: jest.fn(),
      listPayments: jest.fn(),
      getClient: jest.fn(),
    } as any;

    controller = new QPayWebhookController(mockService);
  });

  describe('handleWebhook', () => {
    it('should return error when invoice_id is missing', async () => {
      const result = await controller.handleWebhook({});

      expect(result).toEqual({ error: 'Missing invoice_id' });
    });

    it('should return error when invoice_id is undefined', async () => {
      const result = await controller.handleWebhook({ invoice_id: undefined });

      expect(result).toEqual({ error: 'Missing invoice_id' });
    });

    it('should return paid status when payment rows exist', async () => {
      mockService.checkPayment.mockResolvedValue({
        rows: [{ payment_id: 'PAY_1', amount: 1000 }],
      });

      const result = await controller.handleWebhook({
        invoice_id: 'INV_123',
      });

      expect(mockService.checkPayment).toHaveBeenCalledWith({
        objectType: 'INVOICE',
        objectId: 'INV_123',
      });
      expect(result).toEqual({ status: 'paid', invoiceId: 'INV_123' });
    });

    it('should return unpaid status when no payment rows', async () => {
      mockService.checkPayment.mockResolvedValue({ rows: [] });

      const result = await controller.handleWebhook({
        invoice_id: 'INV_456',
      });

      expect(result).toEqual({ status: 'unpaid', invoiceId: 'INV_456' });
    });

    it('should return unpaid when rows is null', async () => {
      mockService.checkPayment.mockResolvedValue({ rows: null });

      const result = await controller.handleWebhook({
        invoice_id: 'INV_789',
      });

      expect(result).toEqual({ status: 'unpaid', invoiceId: 'INV_789' });
    });

    it('should return unpaid when result has no rows property', async () => {
      mockService.checkPayment.mockResolvedValue({});

      const result = await controller.handleWebhook({
        invoice_id: 'INV_NOPROP',
      });

      expect(result).toEqual({ status: 'unpaid', invoiceId: 'INV_NOPROP' });
    });

    it('should return error message on checkPayment failure', async () => {
      mockService.checkPayment.mockRejectedValue(
        new Error('QPay API timeout')
      );

      const result = await controller.handleWebhook({
        invoice_id: 'INV_ERR',
      });

      expect(result).toEqual({ error: 'QPay API timeout' });
    });

    it('should return error for network failures', async () => {
      mockService.checkPayment.mockRejectedValue(
        new Error('Network unreachable')
      );

      const result = await controller.handleWebhook({
        invoice_id: 'INV_NET',
      });

      expect(result).toEqual({ error: 'Network unreachable' });
    });

    it('should pass correct objectType and objectId to checkPayment', async () => {
      mockService.checkPayment.mockResolvedValue({ rows: [] });

      await controller.handleWebhook({ invoice_id: 'TEST_INV_ID' });

      expect(mockService.checkPayment).toHaveBeenCalledWith({
        objectType: 'INVOICE',
        objectId: 'TEST_INV_ID',
      });
    });

    it('should handle multiple payment rows', async () => {
      mockService.checkPayment.mockResolvedValue({
        rows: [
          { payment_id: 'PAY_1', amount: 500 },
          { payment_id: 'PAY_2', amount: 500 },
        ],
      });

      const result = await controller.handleWebhook({
        invoice_id: 'INV_MULTI',
      });

      expect(result).toEqual({ status: 'paid', invoiceId: 'INV_MULTI' });
    });
  });
});
