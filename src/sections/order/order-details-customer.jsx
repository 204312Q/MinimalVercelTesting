import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OrderDetailsCustomer({ customer }) {
  return (
    <>
      <CardHeader
        title="Customer"
      />
      <Box sx={{ p: 3, display: 'flex' }}>

        <Stack spacing={0.5} sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

        </Stack>
      </Box>
    </>
  );
}