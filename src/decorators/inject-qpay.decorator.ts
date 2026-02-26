import { Inject } from '@nestjs/common';
import { QPAY_CLIENT } from '../constants';

export const InjectQPay = () => Inject(QPAY_CLIENT);
