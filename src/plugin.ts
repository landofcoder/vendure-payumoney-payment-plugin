import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { shopApiExtensions } from './graphql/api-extensions';
import { payumoneyPaymentMethodHandler } from './services/payumoney-payment-method';
import { PayumoneyResolver } from './graphql/payumoney.resolver';

/**
 * This plugin implements the Braintree (https://www.braintreepayments.com/) payment provider.
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(payumoneyPaymentMethodHandler);
        return config;
    },
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [PayumoneyResolver],
    },
})
export class PayumoneyPlugin {}
