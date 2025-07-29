'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

export function ProductOrderForm({ category, products }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [bundleWithMassage, setBundleWithMassage] = useState(false);
    const [confirmedDate, setConfirmedDate] = useState('');
    const [selectDate, setSelectDate] = useState('');
    const [startWith, setStartWith] = useState('lunch');
    const [specialRequests, setSpecialRequests] = useState({});
    const [notes, setNotes] = useState('');

    const handleSpecialRequestChange = (request, checked) => {
        setSpecialRequests(prev => ({
            ...prev,
            [request]: checked
        }));
    };

    const selectedProductData = products.find(p => p.product_id.toString() === selectedProduct);
    const subtotal = selectedProductData ? selectedProductData.price : 0;

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Package Selected: {category?.name}
                        </Typography>

                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Select Days:</FormLabel>
                            <RadioGroup
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
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

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Bundle with:
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={bundleWithMassage}
                                        onChange={(e) => setBundleWithMassage(e.target.checked)}
                                    />
                                }
                                label="BMB Massage Package"
                            />
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <TextField
                                label="Confirmed Date/E.D.D:"
                                type="date"
                                value={confirmedDate}
                                onChange={(e) => setConfirmedDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Select Date:"
                                type="date"
                                value={selectDate}
                                onChange={(e) => setSelectDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        <FormControl component="fieldset" sx={{ mt: 3 }}>
                            <FormLabel component="legend">Start With:</FormLabel>
                            <RadioGroup
                                value={startWith}
                                onChange={(e) => setStartWith(e.target.value)}
                            >
                                <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />
                                <FormControlLabel value="dinner" control={<Radio />} label="Dinner" />
                            </RadioGroup>
                        </FormControl>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Special Request:
                            </Typography>
                            <Grid container>
                                <Grid size={6}>
                                    {['No Alcohol', 'Special Request 1', 'Special Request 2', 'Special Request 3'].map((request) => (
                                        <FormControlLabel
                                            key={request}
                                            control={
                                                <Checkbox
                                                    onChange={(e) => handleSpecialRequestChange(request, e.target.checked)}
                                                />
                                            }
                                            label={request}
                                        />
                                    ))}
                                </Grid>
                                <Grid size={6}>
                                    {['No Pork Liver', 'Special Request 4', 'Special Request 5', 'Special Request 6'].map((request) => (
                                        <FormControlLabel
                                            key={request}
                                            control={
                                                <Checkbox
                                                    onChange={(e) => handleSpecialRequestChange(request, e.target.checked)}
                                                />
                                            }
                                            label={request}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>

                        <TextField
                            label="Notes:"
                            multiline
                            rows={3}
                            fullWidth
                            sx={{ mt: 3 }}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Order summary
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Subtotal</Typography>
                            <Typography>${subtotal}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Discount</Typography>
                            <Typography>-</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontWeight: 'bold' }}>
                            <Typography>Total</Typography>
                            <Typography color="error">${subtotal}</Typography>
                        </Box>

                        <Typography variant="caption" display="block" gutterBottom>
                            (GST included)
                        </Typography>

                        <TextField
                            placeholder="DISCOUNT5"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, mb: 1 }}
                        />
                        <Button variant="outlined" size="small" fullWidth sx={{ mb: 2 }}>
                            Apply
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ backgroundColor: 'primary.main' }}
                        >
                            Proceed to Order
                        </Button>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Please Note:
                            </Typography>
                            <Typography variant="caption">
                                For E.D.D selection/new order/next day activation/meal postponement and etc, we would need 1 working day's notice (before 2PM) for delivery on weekdays or 2 working day's notice (before 2PM) for delivery on weekends and public holidays. Order confirmation after operating hours would require 2 working day's notice. Additional $20/trip for delivery to Sentosa. Do check with our team for menu schedules.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}