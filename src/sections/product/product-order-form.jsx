'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getBundlesForProduct } from 'src/actions/product-ssr';

export function ProductOrderForm({ category, products, onOrderChange }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [availableBundles, setAvailableBundles] = useState([]);
    const [selectedBundles, setSelectedBundles] = useState([]);
    const [dateType, setDateType] = useState('confirmed');
    const [selectedDate, setSelectedDate] = useState(null);
    const [startWith, setStartWith] = useState('lunch');
    const [bundleLoading, setBundleLoading] = useState(false);

    // Memoized values
    const isTrialMeal = useMemo(() => category?.name === "Trial Meal", [category?.name]);

    const selectedProductData = useMemo(() =>
        products.find(p => p.product_id.toString() === selectedProduct),
        [products, selectedProduct]
    );

    const { selectedBundleData, bundlePrice } = useMemo(() => {
        const bundles = availableBundles.filter(bundle =>
            selectedBundles.includes(bundle.product_id)
        );
        const price = bundles.reduce((sum, bundle) => sum + bundle.price, 0);

        return { selectedBundleData: bundles, bundlePrice: price };
    }, [availableBundles, selectedBundles]);

    const orderData = useMemo(() => {
        if (!selectedProductData) return null;

        const basePrice = selectedProductData.price;
        const totalPrice = basePrice + bundlePrice;
        const isValidOrder = !!(selectedProductData && selectedDate);

        return {
            selectedProduct: selectedProductData,
            selectedBundles: selectedBundleData,
            bundlePrice,
            totalPrice,
            dateType,
            selectedDate,
            startWith,
            category: category?.name,
            isValidOrder
        };
    }, [selectedProductData, selectedBundleData, bundlePrice, dateType, selectedDate, startWith, category?.name]);

    // Optimized fetch function
    const fetchBundles = useCallback(async (productId) => {
        setBundleLoading(true);
        try {
            const bundles = await getBundlesForProduct(productId);
            setAvailableBundles(bundles);
        } catch (error) {
            console.error('Failed to fetch bundles:', error);
            setAvailableBundles([]);
        } finally {
            setBundleLoading(false);
        }
    }, []);

    // Effects
    useEffect(() => {
        if (selectedProduct) {
            fetchBundles(selectedProduct);
        } else {
            setAvailableBundles([]);
            setSelectedBundles([]);
        }
    }, [selectedProduct, fetchBundles]);

    useEffect(() => {
        if (orderData && onOrderChange) {
            onOrderChange(orderData);
        }
    }, [orderData, onOrderChange]);

    // Optimized event handlers
    const handleProductChange = useCallback((e) => {
        setSelectedProduct(e.target.value);
        setSelectedBundles([]);
    }, []);

    const handleBundleChange = useCallback((bundleId, checked) => {
        setSelectedBundles(prev =>
            checked
                ? [...prev, bundleId]
                : prev.filter(id => id !== bundleId)
        );
    }, []);

    const handleDateTypeChange = useCallback((e) => {
        setDateType(e.target.value);
    }, []);

    const handleDateChange = useCallback((newValue) => {
        if (newValue) {
            const dateString = newValue.format('YYYY-MM-DD');
            setSelectedDate(dateString);
        } else {
            setSelectedDate(null);
        }
    }, []);

    const handleStartWithChange = useCallback((e) => {
        setStartWith(e.target.value);
    }, []);

    return (
        <Card sx={{
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0 0',
            mb: 3
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Package Selected: {category?.name}
                </Typography>

                {/* Product Selection */}
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Select Days:</FormLabel>
                    <RadioGroup value={selectedProduct} onChange={handleProductChange}>
                        {products.map((product) => (
                            <FormControlLabel
                                key={product.product_id}
                                value={product.product_id.toString()}
                                control={<Radio />}
                                label={`${product.duration} Days - $${product.price}`}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                {/* Bundle Section with Loading */}
                {selectedProduct && (bundleLoading || availableBundles.length > 0) && (
                    <Box sx={{
                        mt: 3,
                        border: '2px solid #F27C96',
                        borderRadius: '8px',
                        padding: 2,
                        backgroundColor: '#FFF5F7',
                        position: 'relative',
                        minHeight: bundleLoading ? 80 : 'auto'
                    }}>
                        <Typography variant="subtitle1" gutterBottom sx={{
                            color: '#F27C96',
                            fontWeight: 'bold'
                        }}>
                            Bundle with:
                        </Typography>

                        {bundleLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={24} sx={{ color: '#F27C96' }} />
                            </Box>
                        ) : (
                            availableBundles.map((bundle) => (
                                <FormControlLabel
                                    key={bundle.product_id}
                                    control={
                                        <Checkbox
                                            checked={selectedBundles.includes(bundle.product_id)}
                                            onChange={(e) => handleBundleChange(bundle.product_id, e.target.checked)}
                                            sx={{
                                                color: '#F27C96',
                                                '&.Mui-checked': { color: '#F27C96' },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {bundle.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#F27C96',
                                                fontWeight: 'bold',
                                                ml: 2
                                            }}>
                                                +${bundle.price}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ display: 'flex', mb: 1, width: '100%', m: 0 }}
                                />
                            ))
                        )}

                        <Box sx={{
                            position: 'absolute',
                            top: -8,
                            right: 8,
                            backgroundColor: '#F27C96',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            SPECIAL
                        </Box>
                    </Box>
                )}

                {/* Date Selection */}
                <Box sx={{ mt: 3 }}>
                    <FormLabel component="legend" sx={{
                        mb: 2,
                        display: 'block',
                        color: 'text.primary',
                        fontSize: '1rem',
                        fontWeight: 'medium'
                    }}>
                        Select Date <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>
                    </FormLabel>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel>Date Type</InputLabel>
                            <Select value={dateType} label="Date Type" onChange={handleDateTypeChange}>
                                <MenuItem value="confirmed">Confirmed Start Date</MenuItem>
                                {!isTrialMeal && (
                                    <MenuItem value="edd">E.D.D</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={`${dateType === 'confirmed' ? 'Confirmed Date' : 'E.D.D Date'} *`}
                                value={selectedDate ? dayjs(selectedDate) : null}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: { sx: { flex: 1 } },
                                }}
                                minDate={dayjs()}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>

                {/* Start With Options */}
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormLabel component="legend">Start With:</FormLabel>
                    <RadioGroup value={startWith} onChange={handleStartWithChange}>
                        <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />
                        <FormControlLabel value="dinner" control={<Radio />} label="Dinner" />
                    </RadioGroup>
                </FormControl>
            </CardContent>
        </Card>
    );
}