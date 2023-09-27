import { omit } from "lodash-es";
import { useCallback } from "react";
import { type CountryCode } from "@/checkout/src/graphql";
import { type UseFormReturn } from "@/checkout/src/hooks/useForm";
import { type UrlChangeHandlerArgs, useUrlChange } from "@/checkout/src/hooks/useUrlChange";
import { getParsedLocaleData } from "@/checkout/src/lib/utils/locale";

export const useAddressFormUrlChange = (form: UseFormReturn<{ countryCode?: CountryCode }>) => {
	const { values, setFieldValue } = form;
	const { countryCode } = values;

	const hasFilledAnyData = Object.values(omit(values, ["id", "countryCode"])).some((value) => !!value);

	const handleUrlChange = useCallback(
		({ queryParams: { locale } }: UrlChangeHandlerArgs) => {
			if (hasFilledAnyData) {
				return;
			}

			const newCountryCode = getParsedLocaleData(locale).countryCode;

			const hasCountryChanged = newCountryCode !== countryCode;

			if (hasCountryChanged) {
				void setFieldValue("countryCode", newCountryCode);
			}
		},
		[countryCode, hasFilledAnyData, setFieldValue],
	);

	useUrlChange(handleUrlChange);
};
