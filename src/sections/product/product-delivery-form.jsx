'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

// UPDATED SECURITY IMPORTS
import { SECURITY_CONFIG } from 'src/utils/security';
import { useSecureInput, useSecureEmailInput, useSecurePhoneInput } from 'src/hooks/useSecureInput';

export function ProductDeliveryForm({ onDeliveryDataChange, onValidationChange, orderTotal = 0, discountAmount = 0 }) {
    // REPLACE useState with secure input hooks
    const fullNameInput = useSecureInput('', SECURITY_CONFIG.MAX_NAME_LENGTH);
    const phoneInput = useSecurePhoneInput('');
    const emailInput = useSecureEmailInput('');
    const addressInput = useSecureInput('', SECURITY_CONFIG.MAX_ADDRESS_LENGTH);
    const floorInput = useSecureInput('', 2);
    const unitInput = useSecureInput('', 4);
    const postalCodeInput = useSecureInput('', 6);

    const [paymentMethod, setPaymentMethod] = useState('full');
    const [touchedFields, setTouchedFields] = useState({});

    // CREATE deliveryData from secure inputs
    const deliveryData = useMemo(() => ({
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        floor: floorInput.value,
        unit: unitInput.value,
        postalCode: postalCodeInput.value,
        paymentMethod,
    }), [
        fullNameInput.value,
        phoneInput.value,
        emailInput.value,
        addressInput.value,
        floorInput.value,
        unitInput.value,
        postalCodeInput.value,
        paymentMethod
    ]);

    // SIMPLIFIED validation rules using hook validation
    const validationRules = useMemo(() => ({
        fullName: (input) => {
            if (!input.value.trim()) return 'Full name is required';
            return input.error;
        },
        email: (input) => {
            if (!input.value.trim()) return 'Email is required';
            return input.error || input.emailError;
        },
        phone: (input) => {
            if (!input.value.trim()) return 'Phone number is required';
            return input.error || input.phoneError;
        },
        address: (input) => {
            if (!input.value.trim()) return 'Address is required';
            return input.error;
        },
        postalCode: (input) => {
            if (!input.value.trim()) return 'Postal code is required';
            if (!/^\d{6}$/.test(input.value)) return 'Postal code must be 6 digits';
            return input.error;
        },
        floor: (input) => input.error,
        unit: (input) => input.error
    }), []);

    // Handle field touches
    const handleFieldTouch = useCallback((field) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    }, []);

    // Handle payment method change
    const handlePaymentMethodChange = useCallback((method) => {
        setPaymentMethod(method);
    }, []);

    // SIMPLIFIED validation function
    const validateForm = useCallback(() => {
        // Check if all required fields are valid
        const isFormValid =
            fullNameInput.value.trim() && !validationRules.fullName(fullNameInput) &&
            phoneInput.value.trim() && !validationRules.phone(phoneInput) &&
            emailInput.value.trim() && !validationRules.email(emailInput) &&
            addressInput.value.trim() && !validationRules.address(addressInput) &&
            postalCodeInput.value.trim() && !validationRules.postalCode(postalCodeInput) &&
            /^\d{6}$/.test(postalCodeInput.value);

        if (onValidationChange) {
            onValidationChange(isFormValid);
        }

        return isFormValid;
    }, [
        fullNameInput, phoneInput, emailInput, addressInput,
        floorInput, unitInput, postalCodeInput, validationRules, onValidationChange
    ]);

    // Payment calculation
    const paymentAmounts = useMemo(() => {
        const finalTotal = Math.max(0, orderTotal - discountAmount);

        if (paymentMethod === 'partial') {
            const depositAmount = 100;
            const balancePayable = Math.max(0, finalTotal - depositAmount);

            return {
                depositAmount,
                balancePayable,
                totalAmount: finalTotal
            };
        }

        return {
            depositAmount: 0,
            balancePayable: 0,
            totalAmount: finalTotal
        };
    }, [paymentMethod, orderTotal, discountAmount]);

    // Notify parent of delivery data changes
    useEffect(() => {
        if (onDeliveryDataChange) {
            onDeliveryDataChange({
                ...deliveryData,
                paymentAmounts
            });
        }
    }, [deliveryData, paymentAmounts, onDeliveryDataChange]);

    // Run validation when form data changes
    useEffect(() => {
        validateForm();
    }, [validateForm]);

    // Check if partial payment is available
    const isPartialPaymentAvailable = orderTotal >= 728;

    // UPDATED form fields configuration with secure inputs
    const formFields = useMemo(() => [
        {
            name: 'fullName',
            label: 'Full name',
            required: true,
            placeholder: '',
            input: fullNameInput,
            validation: validationRules.fullName
        },
        {
            name: 'phone',
            label: 'Phone number',
            required: true,
            placeholder: 'e.g., 91234567',
            input: phoneInput,
            validation: validationRules.phone
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: '',
            input: emailInput,
            validation: validationRules.email
        },
        {
            name: 'address',
            label: 'Address',
            required: true,
            multiline: true,
            rows: 2,
            placeholder: 'Block, Street Name',
            input: addressInput,
            validation: validationRules.address
        },
        {
            name: 'floor',
            label: 'Floor',
            required: false,
            placeholder: 'e.g., 12',
            width: 6,
            input: floorInput,
            validation: validationRules.floor
        },
        {
            name: 'unit',
            label: 'Unit',
            required: false,
            placeholder: 'e.g., 34',
            width: 6,
            input: unitInput,
            validation: validationRules.unit
        },
        {
            name: 'postalCode',
            label: 'Postal Code',
            required: true,
            placeholder: 'e.g., 123456',
            input: postalCodeInput,
            validation: validationRules.postalCode
        }
    ], [
        fullNameInput, phoneInput, emailInput, addressInput,
        floorInput, unitInput, postalCodeInput, validationRules
    ]);

    return (
        <Card sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0 0',
        }}>
            <Box sx={{
                gap: 5,
                p: { xs: 3, md: 3 },
                display: 'grid',
                borderRadius: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}>
                {/* UPDATED Delivery Address Section */}
                <DeliveryAddressSection
                    formFields={formFields}
                    touchedFields={touchedFields}
                    onFieldTouch={handleFieldTouch}
                />

                {/* Payment Method Section */}
                <PaymentMethodSection
                    paymentMethod={paymentMethod}
                    paymentAmounts={paymentAmounts}
                    isPartialPaymentAvailable={isPartialPaymentAvailable}
                    onPaymentMethodChange={handlePaymentMethodChange}
                />
            </Box>
        </Card>
    );
}

// UPDATED Delivery Address Section Component
const DeliveryAddressSection = ({ formFields, touchedFields, onFieldTouch }) => (
    <div>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Delivery Address*
        </Typography>

        <Grid container spacing={0}>
            {formFields.map((field) => {
                const error = touchedFields[field.name] ? field.validation(field.input) : null;

                return (
                    <Grid
                        key={field.name}
                        item
                        xs={field.width || 12}
                        sx={{ padding: '0 !important', margin: '0 !important' }}
                    >
                        <TextField
                            fullWidth
                            label={field.label}
                            type={field.type || 'text'}
                            required={field.required}
                            multiline={field.multiline}
                            rows={field.rows}
                            value={field.input.value}
                            onChange={(e) => {
                                field.input.handleChange(e);
                                onFieldTouch(field.name);
                            }}
                            onPaste={field.input.handlePaste}
                            onBlur={() => onFieldTouch(field.name)}
                            error={!!error}
                            helperText={error || field.input.helperText}
                            placeholder={field.placeholder}
                            size="medium"
                            inputProps={{
                                maxLength: field.input.maxLength,
                            }}
                            sx={{
                                margin: '4px 0',
                                ...(field.width === 6 && field.name === 'floor' && { marginRight: '4px' }),
                                ...(field.width === 6 && field.name === 'unit' && { marginLeft: '4px' }),
                                '& .MuiOutlinedInput-root': {
                                    paddingLeft: '0 !important',
                                    '& fieldset': {
                                        borderColor: error ? 'error.main' : 'grey.300',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: error ? 'error.main' : 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: error ? 'error.main' : 'primary.main',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    paddingLeft: '14px !important',
                                }
                            }}
                        />
                    </Grid>
                );
            })}
        </Grid>
    </div>
);

// Payment Method Section Component
const PaymentMethodSection = ({
    paymentMethod,
    paymentAmounts,
    isPartialPaymentAvailable,
    onPaymentMethodChange
}) => (
    <div>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Payment method
        </Typography>

        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            {/* Full Payment Option */}
            <PaymentOption
                isSelected={paymentMethod === 'full'}
                onClick={() => onPaymentMethodChange('full')}
                title="Full"
                description=""
            />

            {/* Partial Payment Option */}
            {isPartialPaymentAvailable && (
                <PaymentOption
                    isSelected={paymentMethod === 'partial'}
                    onClick={() => onPaymentMethodChange('partial')}
                    title="Partial (Deposit)"
                />
            )}
        </Box>
    </div>
);

// Payment Option Component
const PaymentOption = ({ isSelected, onClick, title }) => (
    <Box
        sx={[
            (theme) => ({
                borderRadius: 1.5,
                border: `solid 1px ${isSelected ? theme.vars.palette.primary.main : theme.vars.palette.grey[300]}`,
                transition: theme.transitions.create(['box-shadow'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.shortest,
                }),
                cursor: 'pointer',
                ...(isSelected && {
                    boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`
                }),
            }),
        ]}
        onClick={onClick}
    >
        <Box sx={{
            px: 2,
            gap: 2,
            height: 80,
            display: 'flex',
            alignItems: 'center',
        }}>
            <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'grey.400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {isSelected && (
                    <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                    }} />
                )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Box component="span" sx={{
                    typography: 'subtitle1',
                    display: 'block'
                }}>
                    {title}
                </Box>
            </Box>
        </Box>
    </Box>
);