import React from "react";
import clsx from "clsx";
import { summaryLabels, summaryMessages } from "./messages";
import { type ClassNames } from "@/checkout/ui-kit";
import { Money } from "@/checkout/src/components";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { type Money as MoneyType } from "@/checkout/src/graphql";
import { getFormattedMoney } from "@/checkout/src/lib/utils/money";
import { type GrossMoney } from "@/checkout/src/lib/globalTypes";

interface SummaryItemMoneyInfoProps {
	classNames?: ClassNames<"container">;
	unitPrice: GrossMoney;
	undiscountedUnitPrice: MoneyType;
	quantity: number;
}

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = ({
	unitPrice,
	quantity,
	undiscountedUnitPrice,
	classNames = {},
}) => {
	const formatMessage = useFormattedMessages();
	const multiplePieces = quantity > 1;
	const piecePrice = unitPrice.gross;
	const onSale = undiscountedUnitPrice.amount !== unitPrice.gross.amount;

	return (
		<>
			<div className={clsx("flex flex-row", classNames.container)}>
				{onSale && (
					<Money
						ariaLabel={formatMessage(summaryLabels.undiscountedPrice)}
						money={{
							currency: undiscountedUnitPrice.currency,
							amount: undiscountedUnitPrice.amount * quantity,
						}}
						className="mr-1 line-through"
					/>
				)}
				<Money
					ariaLabel={formatMessage(summaryLabels.totalPrice)}
					money={{
						currency: piecePrice?.currency,
						amount: (piecePrice?.amount || 0) * quantity,
					}}
					className={clsx({
						"!text-text-error": onSale,
					})}
				/>
			</div>

			{multiplePieces && (
				<p
					aria-label={formatMessage(summaryLabels.singlePiecePrice)}
					color="secondary"
					className="ml-4 text-sm"
				>
					{`${getFormattedMoney(piecePrice)} ${formatMessage(summaryMessages.each)}`}
				</p>
			)}
		</>
	);
};
