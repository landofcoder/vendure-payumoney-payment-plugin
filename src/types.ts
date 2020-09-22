import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';

import { payumoneyPaymentMethodHandler } from './services/payumoney-payment-method';

export type PaymentMethodArgsHash = ConfigArgValues<typeof payumoneyPaymentMethodHandler['args']>;
