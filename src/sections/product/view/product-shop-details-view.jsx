'use client';

import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Image } from 'src/components/image';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CartIcon } from '../cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: 'Inclusive of',
    description: 'Meals will come with Longan Tea with Red Dates',
    icon: 'solar:verified-check-bold',
  },
  {
    title: 'Delivery Time range between',
    description: 'Lunch: 10:00AM to 1:00PM, Dinner: 4:00PM to 7:00PM',
    icon: 'solar:clock-circle-bold',
  },
  // {
  //   title: 'Year warranty',
  //   description: 'Cotton candy gingerbread cake I love sugar sweet.',
  //   icon: 'solar:shield-check-bold',
  // },
];

// ----------------------------------------------------------------------

export function ProductShopDetailsView({ product, addon }) {
  const { state: checkoutState, onAddToCart } = useCheckoutContext();

  const tabs = useTabs('description');
  console.log('Product_detail', product, 'Addon:', addon);

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkoutState.totalItems} />

      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Product', href: paths.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }} >
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          {/* <ProductDetailsCarousel images={product?.image} /> */}
          <Image src={product?.image} alt={product?.name} ratio={1} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          {product && (
            <ProductDetailsSummary 
              product={product}
              addon={addon}
              items={checkoutState.items}
              onAddToCart={onAddToCart}
              // disableActions={!product?.available}
            />
          )}
        </Grid>
      </Grid>
      <Box
        sx={{
          gap: 5,
          my: 10,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={[
            (theme) => ({
              px: 3,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {[
            { value: 'description', label: 'Description' },
            // { value: 'reviews', label: `Reviews (${product?.reviews.length})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {/* {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )} */}

        {/* {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings}
            reviews={product?.reviews}
            totalRatings={product?.totalRatings}
            totalReviews={product?.totalReviews}
          />
        )} */}
      </Card>
    </Container>
  );
}
