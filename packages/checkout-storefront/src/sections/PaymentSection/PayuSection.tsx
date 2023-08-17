import React, { useState, FormEvent } from "react";
import CompleteCheckoutButton from "./CompleteCheckoutButton";

import { useCheckoutPaymentCreateMutation } from "./useCheckoutPaymentCreateMutation";
import { useCheckoutComplete } from "@/checkout-storefront/hooks/useCheckoutComplete";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";

export interface IPaymentGatewayConfig {
  field: string;
  value: string | null;
}
export const PAYU_GATEWAY = "salingo.payments.payu";

export function PayuSection({ checkout }: any) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [, checkoutPaymentCreate] = useCheckoutPaymentCreateMutation();
  const { onCheckoutComplete } = useCheckoutComplete();
  const { saleorApiUrl } = getQueryParams();
  const { channel } = getQueryParams();

  const generatePayuUrl = async (paymentId: string) => {
    const payuUrlQuery = `
      query generatePaymentUrl($paymentId: ID!, $channel: String!) {
        generatePaymentUrl(paymentId: $paymentId, channel: $channel) {
          paymentUrl
        }
      }
    `;

    try {
      const response = await fetch(saleorApiUrl, {
        method: "POST",
        body: JSON.stringify({
          query: payuUrlQuery,
          variables: {
            paymentId: paymentId,
            channel: channel,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      const payuUrl = data?.data?.generatePaymentUrl?.paymentUrl;
      return payuUrl;
    } catch (error) {
      throw new Error("Failed to generate PayU URL");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPaymentProcessing(true);

    try {
      if (!checkout.token) {
        throw new Error("Invalid checkout token");
      }

      const paymentResponse = await checkoutPaymentCreate({
        checkoutToken: checkout.token,
        paymentInput: {
          gateway: "salingo.payments.payu",
          amount: checkout.totalPrice?.gross.amount,
          token: checkout.token,
        },
      });

      const paymentId = paymentResponse.data?.checkoutPaymentCreate?.payment?.id;

      if (!paymentId) {
        throw new Error("Failed to create payment");
      }

      const payuUrl = await generatePayuUrl(paymentId as string);

      if (payuUrl) {
        window.location.href = payuUrl;

        await onCheckoutComplete();
      } else {
        throw new Error("Failed to generate PayU URL");
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="py-2">
      <form method="post" onSubmit={handleSubmit}>
        <CompleteCheckoutButton isProcessing={isPaymentProcessing} isDisabled={isPaymentProcessing}>
          Zapłać z PayU
        </CompleteCheckoutButton>
      </form>
    </div>
  );
}

export default PayuSection;