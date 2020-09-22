import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Logger, PaymentMethodHandler } from '@vendure/core';

import { extractMetadataFromTransaction, getGateway } from '../helpers/payumoney-common';
import { loggerCtx } from '../constants';

/**
 * The handler for Payumoney payments.
 */
export const payumoneyPaymentMethodHandler = new PaymentMethodHandler({
    code: 'payumoney',
    description: [{ languageCode: LanguageCode.en, value: 'Payumoney' }],
    args: {
        merchantId: { type: 'string' },
        publicKey: { type: 'string' },
        privateKey: { type: 'string' },
    },

    async createPayment(order, args, metadata) {
        const gateway = getGateway(args);
        try {
            const response = await gateway.transaction.sale({
                amount: (order.total / 100).toString(10),
                orderId: order.code,
                paymentMethodNonce: metadata.nonce,
                options: {
                    submitForSettlement: true,
                },
            });
            if (!response.success) {
                return {
                    amount: order.total,
                    state: 'Declined' as const,
                    transactionId: response.transaction.id,
                    errorMessage: response.message,
                    metadata: extractMetadataFromTransaction(response.transaction),
                };
            }
            return {
                amount: order.total,
                state: 'Settled' as const,
                transactionId: response.transaction.id,
                metadata: extractMetadataFromTransaction(response.transaction),
            };
        } catch (e) {
            Logger.error(e, loggerCtx);
            return {
                amount: order.total,
                state: 'Error' as const,
                transactionId: '',
                errorMessage: e.toString(),
                metadata: e,
            };
        }
    },

    settlePayment() {
        return {
            success: true,
        };
    },

    async createRefund(input, total, order, payment, args) {
        const gateway = getGateway(args);
        const response = await gateway.transaction.refund(payment.transactionId, (total / 100).toString(10));
        if (!response.success) {
            return {
                state: 'Failed' as const,
                transactionId: response.transaction.id,
                metadata: response,
            };
        }
        return {
            state: 'Settled' as const,
            transactionId: response.transaction.id,
            metadata: response,
        };
    },
});
