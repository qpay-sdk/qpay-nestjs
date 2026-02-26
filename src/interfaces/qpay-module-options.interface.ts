import { ModuleMetadata } from '@nestjs/common';
import { QPayConfig } from 'qpay-js';

export interface QPayModuleOptions extends QPayConfig {}

export interface QPayModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => QPayModuleOptions | Promise<QPayModuleOptions>;
  inject?: any[];
}
