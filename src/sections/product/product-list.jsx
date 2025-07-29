import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { _packageCategories } from 'src/_mock/_others';
import { PRODUCT } from 'src/_mock/_cpproduct';
import { ProductOrderForm } from './product-order-form';

export function ProductList({ products = PRODUCT, loading, sx, ...other }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
  };

  const getProductsByCategory = (categoryName) => {
    if (categoryName === "Dual Meal") {
      return products.filter(p => p.name.includes("Dual Meal"));
    }
    if (categoryName === "Single Meal") {
      return products.filter(p => p.name.includes("Single Meal"));
    }
    if (categoryName === "Trial Meal") {
      return products.filter(p => p.name.includes("Trial"));
    }
    return [];
  };

  const renderCategoryCards = () => (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)', // Single column on mobile
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {_packageCategories.map((category) => (
        <Card
          key={category.id}
          sx={{
            cursor: 'pointer',
            border: selectedCategory?.id === category.id ? 2 : 0,
            borderColor: 'primary.main',
            '&:hover': { boxShadow: 3 }
          }}
          onClick={() => handleCategoryClick(category)}
        >
          <Box
            sx={{
              height: 200,
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: category.image ? `url(${category.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!category.image && (
              <Typography variant="h6" color="text.secondary">
                {category.name}
              </Typography>
            )}
          </Box>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {category.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              from ${category.startingPrice}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Always show category cards */}
      {renderCategoryCards()}

      {/* Show order form below when category is selected */}
      {selectedCategory && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
              Configure Your Order
            </Typography>
            <Button
              onClick={handleClearSelection}
              variant="outlined"
              size="small"
            >
              Clear Selection
            </Button>
          </Box>

          <ProductOrderForm
            category={selectedCategory}
            products={getProductsByCategory(selectedCategory.name)}
          />
        </Box>
      )}
    </Box>
  );
}