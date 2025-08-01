import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getProducts() {
  
  try {
    // Get products with type "package"
    const products = await import('src/_mock/_cpproduct.js');
    const allProducts = products.PRODUCT;

    // Filter only products with type "package"
    const packageProducts = allProducts.filter(product => product.type === 'package');

    return packageProducts;
  } catch (error) {
    console.error('getProducts - Error:', error);
    return [];
  }
}
// ----------------------------------------------------------------------

export async function getProduct(id) {
  console.log('getProduct - Starting with id:', id);
  
  try {
    // Find the product where product_id or id matches the given id
    const products = await import('src/_mock/_cpproduct.js');
    const allProducts = products.PRODUCT;
    
    const res = allProducts.find(
      (product) => (product.product_id == id || product.id == id) && product.type === 'package'
    )
    
    return { product: res }; // Wrap it for destructuring
  } catch (error) {
    console.error('getProduct - Error:', error);
    return { product: null };
  }
}

export async function getAddons() {
  console.log('getAddons - Starting...');
  
  try {
    // Get products with type "addOn"
    const products = await import('src/_mock/_cpproduct.js');
    const allProducts = products.PRODUCT;
    
    // Filter only products with type "addOn"
    const addonProducts = allProducts.filter(product => product.type === 'addOn');
  
    return addonProducts;
  } catch (error) {
    console.error('getAddons - Error:', error);
    return [];
  }
}

// ----------------------------------------------------------------------

// Get all products regardless of type
export async function getAllProducts() {
  try {
    const products = await import('src/_mock/_cpproduct.js');
    return products.PRODUCT;
  } catch (error) {
    console.error('getAllProducts - Error:', error);
    return [];
  }
}

// ---------------------------------------------------------------------

export async function getBundlesForProduct(productId) {
  console.log('getBundlesForProduct - Starting with productId:', productId, typeof productId);
  
  try {
    const products = await import('src/_mock/_cpproduct.js');
    const allProducts = products.PRODUCT;
    
    console.log('Total products loaded:', allProducts.length);
    
    // Debug: Show all bundle type products
    const allBundles = allProducts.filter(product => product.type === 'bundle');
    console.log('All bundle products found:', allBundles);
    
    const bundleProducts = allProducts.filter(product => {
      console.log('Checking product:', product.product_id, product.type, product.bundled_to, 'comparing with:', parseInt(productId));
      return product.type === 'bundle' && 
             product.bundled_to && 
             product.bundled_to === parseInt(productId);
    });
    
    console.log('Matching bundles:', bundleProducts);
    return bundleProducts;
  } catch (error) {
    console.error('getBundlesForProduct - Error:', error);
    return [];
  }
}