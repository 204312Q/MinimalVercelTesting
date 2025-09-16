'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';

import { Iconify } from 'src/components/iconify';
// IMPORT GLOBAL SECURITY UTILITIES
import { SECURITY_CONFIG } from 'src/utils/security';
import { useSecureInput } from 'src/hooks/useSecureInput';

// ALL SPECIAL REQUESTS WITH TYPES
const SPECIAL_REQUESTS = [
    { id: 'sp-1', value: 'No Pork Innards', label: 'Pork Innards', type: 'exclude' },
    { id: 'sp-2', value: 'No Pig Trotter', label: 'Pig Trotter', type: 'exclude' },
    { id: 'sp-3', value: 'No Chicken', label: 'Chicken', type: 'exclude' },
    { id: 'sp-4', value: 'No Fish', label: 'Fish', type: 'exclude' },
    { id: 'sp-5', value: 'No Chicken & Egg for first 1 or 2 weeks', label: 'Chicken & Egg for the first 1 or 2 weeks', type: 'exclude' },
    { id: 'sp-6', value: 'No Papaya Fish Soup', label: 'Papaya Fish Soup', type: 'exclude' },
    { id: 'sp-7', value: 'No Salmon', label: 'Salmon', type: 'exclude' },
    { id: 'sp-8', value: 'No Snow/Sweet Peas', label: 'Snow/Sweet Peas', type: 'exclude' },
    { id: 'sp-9', value: 'No Sugar in Red Dates Tea', label: 'Sugar in Red Dates Tea', type: 'exclude' },
    { id: 'sp-10', value: 'All White Rice', label: 'All White Rice', type: 'riceOption' },
    { id: 'sp-11', value: 'All Brown Rice', label: 'All Brown Rice', type: 'riceOption' },
];

export function ProductSpecialRequestForm({ onRequestChange }) {
    // USE THE SECURE INPUT HOOK
    const customRequestsInput = useSecureInput('', SECURITY_CONFIG.MAX_TEXTAREA_LENGTH);
    const [presetRequests, setPresetRequests] = useState([]);
    const [selectedRiceOption, setSelectedRiceOption] = useState(''); // New state for rice option
    const [expanded, setExpanded] = useState(false);

    // Filter requests by type
    const excludeRequests = useMemo(() =>
        SPECIAL_REQUESTS.filter(request => request.type === 'exclude'),
        []
    );

    const riceOptions = useMemo(() =>
        SPECIAL_REQUESTS.filter(request => request.type === 'riceOption'),
        []
    );

    // Memoize expensive calculations
    const hasRequests = useMemo(() =>
        presetRequests.length > 0 || selectedRiceOption || customRequestsInput.value.trim().length > 0,
        [presetRequests.length, selectedRiceOption, customRequestsInput.value]
    );

    const totalRequests = useMemo(() => {
        const allRequests = [...presetRequests];
        if (selectedRiceOption) {
            allRequests.push(selectedRiceOption);
        }
        if (customRequestsInput.value.trim()) {
            allRequests.push(customRequestsInput.value.trim());
        }

        return allRequests.join('; ');
    }, [presetRequests, selectedRiceOption, customRequestsInput.value]);

    // Optimized event handlers
    const handlePresetRequestChange = useCallback((requestValue) => {
        setPresetRequests(prev =>
            prev.includes(requestValue)
                ? prev.filter(val => val !== requestValue)
                : [...prev, requestValue]
        );
    }, []);

    const handleRiceOptionChange = useCallback((event) => {
        setSelectedRiceOption(event.target.value);
    }, []);

    const handleAccordionChange = useCallback((event, isExpanded) => {
        setExpanded(isExpanded);
    }, []);

    // Notify parent only when totalRequests changes
    useEffect(() => {
        if (onRequestChange) {
            onRequestChange(totalRequests);
        }
    }, [totalRequests, onRequestChange]);

    return (
        <Box sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0px 0px',
            boxShadow: 2
        }}>
            <Accordion
                expanded={expanded}
                onChange={handleAccordionChange}
                sx={{
                    '&:before': {
                        display: 'none',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        py: 0.5,
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                        }
                    }}
                >
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        Special Requests {hasRequests && `(${presetRequests.length + (selectedRiceOption ? 1 : 0) + (customRequestsInput.value.trim() ? 1 : 0)})`}
                    </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    {/* EXCLUDE OPTIONS - Filtered by type */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: 'primary.darker', pl: 0 }}>
                            Exclude the Following:
                        </Typography>
                        <Box sx={{ pl: 0 }}>
                            <Grid container spacing={1}>
                                {excludeRequests.map((request) => (
                                    <Grid item xs={12} sm={4} key={request.id}>
                                        <PresetRequestCheckbox
                                            request={request}
                                            checked={presetRequests.includes(request.value)}
                                            onChange={handlePresetRequestChange}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>

                    {/* RICE OPTIONS - Filtered by type */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: 'primary.darker', pl: 0 }}>
                            Rice Option:
                        </Typography>
                        <Box sx={{ pl: 0 }}>
                            <RadioGroup
                                value={selectedRiceOption}
                                onChange={handleRiceOptionChange}
                                sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
                            >
                                {riceOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={option.value}
                                        control={<Radio size="small" />}
                                        label={
                                            <Typography variant="body2">
                                                {option.label}
                                            </Typography>
                                        }
                                        sx={{
                                            m: 0,
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                    />
                                ))}
                                <FormControlLabel
                                    value=""
                                    control={<Radio size="small" />}
                                    label={
                                        <Typography variant="body2">
                                            No Preference
                                        </Typography>
                                    }
                                    sx={{
                                        m: 0,
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                />
                            </RadioGroup>
                        </Box>
                    </Box>

                    {/* UPDATED Custom Notes with Global Security */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, pl: 0 }}>
                            Notes:
                        </Typography>
                        <Box sx={{ pl: 0 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder={`Enter any additional special requests here... (max ${customRequestsInput.maxLength} characters)`}
                                value={customRequestsInput.value}
                                onChange={customRequestsInput.handleChange}
                                onPaste={customRequestsInput.handlePaste}
                                error={!customRequestsInput.isValid}
                                helperText={customRequestsInput.helperText}
                                inputProps={{
                                    maxLength: customRequestsInput.maxLength,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: customRequestsInput.error ? 'error.main' : 'grey.300',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: customRequestsInput.error ? 'error.main' : 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: customRequestsInput.error ? 'error.main' : 'primary.main',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* UPDATED Character count with error display */}
                    {customRequestsInput.value && (
                        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Character count: {customRequestsInput.characterCount}/{customRequestsInput.maxLength}
                                {customRequestsInput.error && (
                                    <span style={{ color: '#d32f2f', marginLeft: '10px' }}>
                                        ⚠️ {customRequestsInput.error}
                                    </span>
                                )}
                            </Typography>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

// Separate component to prevent unnecessary re-renders
const PresetRequestCheckbox = ({ request, checked, onChange }) => {
    const handleChange = useCallback(() => {
        onChange(request.value);
    }, [onChange, request.value]);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    size="small"
                    value={request.value}
                />
            }
            label={
                <Typography variant="body2">
                    {request.label}
                </Typography>
            }
            sx={{
                width: '100%',
                m: 0,
                p: 0,
                '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem'
                }
            }}
        />
    );
};