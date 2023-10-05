import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { execute } from "@/lib/graphql";
import { ProductElement } from "@/ui/components/ProductElement";

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { category } = await execute(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
	});

	return {
		title: `${category?.name || "Category"} · Saleor Storefront example`,
	};
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { category } = await execute(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
	});

	if (!category) {
		notFound();
	}

	const { name, products } = category;

	return (
		<div>
			<div className="border-b bg-slate-100/50">
				<div className="mx-auto max-w-7xl p-8">
					<h1 className="text-xl font-semibold">{name}</h1>
				</div>
			</div>
			<section className="sm:py-18 mx-auto max-w-2xl px-8 py-12 sm:px-6 lg:max-w-7xl">
				<h2 className="sr-only">Product list</h2>
				<div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{products?.edges.map(({ node: product }) => <ProductElement key={product.id} product={product} />)}
				</div>
			</section>
		</div>
	);
}
