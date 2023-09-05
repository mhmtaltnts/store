import { CheckoutFindDocument } from '@/gql/graphql';
import { execute } from '@/lib';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ActiveLink } from './ActiveLink';
import { ShoppingBagIcon } from 'lucide-react';

const NavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All' },
  { href: '/categories/t-shirts', label: 'T-shirts' },
  { href: '/categories/hoodies', label: 'Hoodies' },
  { href: '/categories/accessories', label: 'Accessories' },
]

export async function Nav() {
  const cart = cookies().get('cart')?.value;

  const { checkout } = cart ? await execute(CheckoutFindDocument,
    {
    variables: {
      token: cart,
    },
    cache: 'no-cache',
  }) : { checkout: { lines: [] } };

  return (
    <div className="border-b sticky top-0 backdrop-blur-md z-20 bg-slate-100/75">
      <div className="max-w-7xl mx-auto px-2 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex lg:px-0 px-2">
            <div className="flex flex-shrink-0 items-center">
            </div>
            <div className="hidden lg:flex lg:space-x-8">
              {NavLinks.map((link) => (
                <ActiveLink
                  key={link.href}
                  href={link.href}
                >
                  {link.label}
                </ActiveLink>
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="">
              <Link href="/cart" className="group -m-2 flex items-center p-2">
                <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 " aria-hidden="true" />
                <span className="ml-2 text-sm font-medium ">{checkout?.lines.length}</span>
                <span className="sr-only">items in cart, view bag</span>
              </Link>
            </div>
          </div>
          <div className="lg:ml-4 lg:flex lg:items-center">
          </div>
        </div>
      </div>
    </div>
  )
}
