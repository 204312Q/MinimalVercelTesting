'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CartIcon } from '../cart-icon';
import { ProductList } from '../product-list';
import { useCheckoutContext } from '../../checkout/context';


// ----------------------------------------------------------------------

export function ProductShopView({ products }) {
  const { state: checkoutState } = useCheckoutContext();

  const productItems = products || [];

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkoutState.totalItems} />

      <Typography variant="h2" sx={{ my: { xs: 3, md: 5 } }}>
        Our Packages
      </Typography>

      <ProductList products={productItems} />

    </Container>
  );
}
