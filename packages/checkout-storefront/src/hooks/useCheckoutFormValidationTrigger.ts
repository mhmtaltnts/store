import { FormDataBase, hasErrors, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback, useEffect } from "react";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  form: UseFormReturn<TData>;
  skip?: boolean;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  form,
  skip = false,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { setValidationState } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();

  const { values, validateForm, setTouched } = form;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formErrors = await validateForm(values);
      if (!hasErrors(formErrors)) {
        setValidationState(scope, "valid");
        return;
      }

      const touched = Object.keys(formErrors).reduce(
        (result, key) => ({ ...result, [key]: true }),
        {}
      );

      void setTouched(touched, true);
      setValidationState(scope, "invalid");
    }
  }, [scope, setTouched, setValidationState, validateForm, validating, values]);

  useEffect(() => {
    if (!skip) {
      void handleGlobalValidationTrigger();
    }
  }, [handleGlobalValidationTrigger, skip]);
};
