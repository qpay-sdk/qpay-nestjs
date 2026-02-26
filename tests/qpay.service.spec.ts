import 'reflect-metadata';
import { QPayService } from '../src/qpay.service';

describe('QPayService', () => {
  let service: QPayService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      createInvoice: jest.fn(),
      createSimpleInvoice: jest.fn(),
      cancelInvoice: jest.fn(),
      getPayment: jest.fn(),
      checkPayment: jest.fn(),
      listPayments: jest.fn(),
    };

    service = new QPayService(mockClient);
  });

  describe('createInvoice', () => {
    it('should delegate to client.createInvoice', async () => {
      const request = {
        invoice_code: 'TEST',
        sender_invoice_no: 'ORD-001',
        amount: 5000,
      };
      const expected = { invoice_id: 'INV_001', qr_text: 'qr_data' };
      mockClient.createInvoice.mockResolvedValue(expected);

      const result = await service.createInvoice(request);

      expect(mockClient.createInvoice).toHaveBeenCalledWith(request);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from client', async () => {
      mockClient.createInvoice.mockRejectedValue(new Error('Auth failed'));

      await expect(service.createInvoice({})).rejects.toThrow('Auth failed');
    });
  });

  describe('createSimpleInvoice', () => {
    it('should delegate to client.createSimpleInvoice', async () => {
      const request = { amount: 1000, description: 'Test' };
      const expected = { invoice_id: 'INV_002' };
      mockClient.createSimpleInvoice.mockResolvedValue(expected);

      const result = await service.createSimpleInvoice(request);

      expect(mockClient.createSimpleInvoice).toHaveBeenCalledWith(request);
      expect(result).toEqual(expected);
    });

    it('should propagate errors', async () => {
      mockClient.createSimpleInvoice.mockRejectedValue(
        new Error('Invalid amount')
      );

      await expect(service.createSimpleInvoice({})).rejects.toThrow(
        'Invalid amount'
      );
    });
  });

  describe('cancelInvoice', () => {
    it('should delegate to client.cancelInvoice', async () => {
      mockClient.cancelInvoice.mockResolvedValue({ success: true });

      const result = await service.cancelInvoice('INV_001');

      expect(mockClient.cancelInvoice).toHaveBeenCalledWith('INV_001');
      expect(result).toEqual({ success: true });
    });

    it('should propagate errors', async () => {
      mockClient.cancelInvoice.mockRejectedValue(
        new Error('Invoice not found')
      );

      await expect(service.cancelInvoice('INVALID')).rejects.toThrow(
        'Invoice not found'
      );
    });
  });

  describe('getPayment', () => {
    it('should delegate to client.getPayment', async () => {
      const expected = { payment_id: 'PAY_001', amount: 5000, status: 'PAID' };
      mockClient.getPayment.mockResolvedValue(expected);

      const result = await service.getPayment('PAY_001');

      expect(mockClient.getPayment).toHaveBeenCalledWith('PAY_001');
      expect(result).toEqual(expected);
    });

    it('should propagate errors', async () => {
      mockClient.getPayment.mockRejectedValue(
        new Error('Payment not found')
      );

      await expect(service.getPayment('INVALID')).rejects.toThrow(
        'Payment not found'
      );
    });
  });

  describe('checkPayment', () => {
    it('should delegate to client.checkPayment', async () => {
      const request = { objectType: 'INVOICE', objectId: 'INV_001' };
      const expected = { rows: [{ payment_id: 'PAY_1' }] };
      mockClient.checkPayment.mockResolvedValue(expected);

      const result = await service.checkPayment(request);

      expect(mockClient.checkPayment).toHaveBeenCalledWith(request);
      expect(result).toEqual(expected);
    });

    it('should return empty rows when no payment', async () => {
      const request = { objectType: 'INVOICE', objectId: 'INV_002' };
      mockClient.checkPayment.mockResolvedValue({ rows: [] });

      const result = await service.checkPayment(request);

      expect(result.rows).toHaveLength(0);
    });

    it('should propagate errors', async () => {
      mockClient.checkPayment.mockRejectedValue(new Error('Timeout'));

      await expect(service.checkPayment({})).rejects.toThrow('Timeout');
    });
  });

  describe('listPayments', () => {
    it('should delegate to client.listPayments', async () => {
      const request = { page: 1, limit: 10 };
      const expected = { rows: [], count: 0 };
      mockClient.listPayments.mockResolvedValue(expected);

      const result = await service.listPayments(request);

      expect(mockClient.listPayments).toHaveBeenCalledWith(request);
      expect(result).toEqual(expected);
    });

    it('should propagate errors', async () => {
      mockClient.listPayments.mockRejectedValue(new Error('Server error'));

      await expect(service.listPayments({})).rejects.toThrow('Server error');
    });
  });

  describe('getClient', () => {
    it('should return the underlying QPayClient instance', () => {
      const client = service.getClient();

      expect(client).toBe(mockClient);
    });
  });
});
