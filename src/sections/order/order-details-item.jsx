import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';

export function OrderItemDetail({
  items = [],
  subtotal = 0,
  discount = 0,
  taxes = 0,
  totalAmount = 0,
  onEdit, // optional edit handler
}) {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Details</Typography>
          <IconButton size="small" onClick={onEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Box>
        {items.map((item, idx) => (
          <Box
            key={item.id || item.sku || idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 2,
              borderBottom: idx < items.length - 1 ? '1px dashed #eee' : 'none',
            }}
          >
            <Avatar
              src={item.coverUrl}
              alt={item.name}
              variant="rounded"
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{item.name}</Typography>
            </Box>
            <Typography sx={{ minWidth: 40, textAlign: 'center' }}>x{item.quantity}</Typography>
            <Typography sx={{ minWidth: 80, textAlign: 'right' }}>
              {fCurrency(item.price)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', minWidth: 220, justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>{fCurrency(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 220, justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Discount</Typography>
            <Typography color="error">{discount ? `-${fCurrency(discount)}` : '-'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 220, justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Taxes</Typography>
            <Typography>{taxes ? fCurrency(taxes) : '-'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 220, justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{fCurrency(totalAmount)}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}