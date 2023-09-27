import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";
import { Address } from "@/checkout/src/components/Address";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useOrder } from "@/checkout/src/hooks/useOrder";
import { contactMessages } from "@/checkout/src/sections/Contact/messages";
import { billingMessages } from "@/checkout/src/sections/UserBillingAddressSection/messages";
import { shippingMessages } from "@/checkout/src/sections/UserShippingAddressSection/messages";

export const OrderInfo = () => {
	const formatMessage = useFormattedMessages();

	const {
		order: { deliveryMethod, shippingAddress, billingAddress, userEmail },
	} = useOrder();

	return (
		<section className="rounded-lg border border-slate-400 px-4 pt-5 lg:w-1/2">
			<PaymentSection />
			<DeliverySection deliveryMethod={deliveryMethod} />
			<Section title={formatMessage(contactMessages.contact)}>
				<p>{userEmail}</p>
			</Section>
			{shippingAddress && (
				<Section title={formatMessage(shippingMessages.shippingAddress)}>
					<Address address={shippingAddress} />
				</Section>
			)}
			{billingAddress && (
				<Section title={formatMessage(billingMessages.billingAddress)}>
					<Address address={billingAddress} />
				</Section>
			)}
		</section>
	);
};
