import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OrderDetailsDelivery({ delivery }) {
  return (
    <>
      <CardHeader
        title="Delivery Address"
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          {delivery?.fullAddress}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          {delivery?.phoneNumber}
        </Box>
      </Stack>
    </>
  );
}