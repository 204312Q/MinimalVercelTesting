import { getProducts, getAddons } from 'src/actions/product-ssr';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Our Packages` };

export default async function Page() {
  const [packages, addons] = await Promise.all([
    getProducts(),
    getAddons()
  ]);

  // Ensure data is serializable by creating plain objects
  const serializedPackages = packages ? JSON.parse(JSON.stringify(packages)) : [];
  const serializedAddons = addons ? JSON.parse(JSON.stringify(addons)) : [];

  return <ProductShopView packages={serializedPackages} addons={serializedAddons} />;
}