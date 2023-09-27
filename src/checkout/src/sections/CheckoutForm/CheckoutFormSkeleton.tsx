import React from "react";
import { ContactSkeleton } from "@/checkout/src/sections/Contact";
import { DeliveryMethodsSkeleton } from "@/checkout/src/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "@/checkout/src/sections/PaymentSection";
import { Divider } from "@/checkout/src/components";
import { AddressSectionSkeleton } from "@/checkout/src/components/AddressSectionSkeleton";

export const CheckoutFormSkeleton = () => (
	<div className="flex flex-col items-end lg:w-1/2">
		<div className="flex w-full flex-col rounded-lg border border-slate-400">
			<ContactSkeleton />
			<Divider />
			<AddressSectionSkeleton />
			<Divider />
			<DeliveryMethodsSkeleton />
			<Divider />
			<PaymentSectionSkeleton />
		</div>
	</div>
);
