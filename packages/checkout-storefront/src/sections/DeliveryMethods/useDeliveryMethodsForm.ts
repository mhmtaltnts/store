import {
  CountryCode,
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { UseFormReturn, useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { getById } from "@/checkout-storefront/lib/utils";
import { useCallback, useEffect, useRef } from "react";

interface DeliveryMethodsFormData {
  selectedMethodId: string | undefined;
}

export const useDeliveryMethodsForm = (): UseFormReturn<DeliveryMethodsFormData> => {
  const { checkout } = useCheckout();
  const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  const previousShippingCountry = useRef<CountryCode | undefined | null>(
    shippingAddress?.country?.code as CountryCode | undefined
  );

  const getAutoSetMethod = useCallback(() => {
    if (!shippingMethods.length) {
      return;
    }

    const cheapestMethod = shippingMethods.reduce(
      (resultMethod, currentMethod) =>
        currentMethod.price.amount < resultMethod.price.amount ? currentMethod : resultMethod,
      shippingMethods[0] as ShippingMethod
    );

    return cheapestMethod;
  }, [shippingMethods]);

  const defaultFormData: DeliveryMethodsFormData = {
    selectedMethodId: deliveryMethod?.id || getAutoSetMethod()?.id,
  };

  const { debouncedSubmit } = useSubmit<DeliveryMethodsFormData, typeof updateDeliveryMethod>({
    scope: "checkoutDeliveryMethodUpdate",
    onSubmit: updateDeliveryMethod,
    shouldAbort: ({ selectedMethodId }) =>
      !selectedMethodId || selectedMethodId === checkout.deliveryMethod?.id,
    formDataParse: ({ selectedMethodId, languageCode, checkoutId }) => ({
      deliveryMethodId: selectedMethodId as string,
      languageCode,
      checkoutId,
    }),
    onError: ({ formData: { selectedMethodId }, setValues }) => {
      setValues({ selectedMethodId });
    },
  });

  const form = useForm<DeliveryMethodsFormData>({
    initialValues: defaultFormData,
    onSubmit: debouncedSubmit,
  });

  const {
    setValues,
    values: { selectedMethodId },
    handleSubmit,
  } = form;

  useEffect(() => {
    console.log("YOO");

    handleSubmit();
  }, [handleSubmit, selectedMethodId]);

  useEffect(() => {
    const hasShippingCountryChanged =
      shippingAddress?.country?.code !== previousShippingCountry.current;

    const hasValidMethodSelected =
      selectedMethodId && shippingMethods.some(getById(selectedMethodId));

    if (hasValidMethodSelected) {
      return;
    }

    void setValues({ selectedMethodId: getAutoSetMethod()?.id });

    if (hasShippingCountryChanged) {
      previousShippingCountry.current = shippingAddress?.country?.code as CountryCode;
    }
  }, [shippingAddress, shippingMethods, getAutoSetMethod, selectedMethodId, setValues]);

  return form;
};
