import { Divider } from "@/checkout-storefront/components/Divider";
import { Title } from "@/checkout-storefront/components/Title";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import React from "react";
import { BillingAddressSection } from "../Addresses/BillingAddressSection";
import { CommonSectionProps } from "../Addresses/types";
import { PaymentMethods, PaymentMethodsProps } from "./PaymentMethods";

interface PaymentSectionProps extends PaymentMethodsProps, CommonSectionProps {}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  collapsed,
  ...rest
}) => {
  const formatMessage = useFormattedMessages();

  if (collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section">
        <Title>{formatMessage("paymentProviders")}</Title>
        <PaymentMethods {...rest} />
        <BillingAddressSection />
      </div>
    </>
  );
};
