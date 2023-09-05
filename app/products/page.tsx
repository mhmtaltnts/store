import { ProductListPaginatedDocument } from "@/gql/graphql";
import { ProductsPerPage, execute } from "@/lib";
import { Pagination } from "@/ui/components/Pagination";
import { ProductElement } from "@/ui/components/ProductElement";

export const metadata = {
  title: 'My Page Title',
};

type Props = {
  searchParams: {
    page: number;
  }
}

export default async function Page({ searchParams }: Props) {
  const { page } = searchParams;

  const { products } = await execute(ProductListPaginatedDocument,
    {
      variables: {
        first: ProductsPerPage,
      },
      cache: 'no-store'
    })

  return (
    <section className="mx-auto max-w-2xl px-8 py-12 sm:px-6 sm:py-18 lg:max-w-7xl">
      <div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products?.edges.map(({ node: product }) =>
          <ProductElement key={product.id} {...product} />
        )}
      </div>
      <Pagination page={Number(page || 1)} total={products?.totalCount || 0} />
    </section>
  )
}