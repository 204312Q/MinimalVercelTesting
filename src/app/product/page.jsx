import { getProducts, getAddons } from 'src/actions/product-ssr';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Our Packages` };

export default async function Page() {
  const [packages, addons] = await Promise.all([
    getProducts(),
    getAddons()
  ]);

  return <ProductShopView packages={packages} addons={addons} />;
}

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';