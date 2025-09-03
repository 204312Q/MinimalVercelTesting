import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function getPaymentStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'partial':
      return 'info';
    case 'full refund':
      return 'default';
    case 'partial refund':
      return 'default';
    default:
      return 'default';
  }
}

// Demo card info
function CardInfo({ last4 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Typography sx={{ letterSpacing: 2, fontWeight: 500 }}>
        **** **** **** {last4}
      </Typography>
      <Box component="span" sx={{ ml: 1 }}>
        <svg width="28" height="18" viewBox="0 0 28 18">
          <circle cx="10" cy="9" r="7" fill="#EB001B" />
          <circle cx="18" cy="9" r="7" fill="#F79E1B" />
          <circle cx="14" cy="9" r="7" fill="#FF5F00" />
        </svg>
      </Box>
    </Box>
  );
}

export default function OrderPaymentCard({ order }) {
  const status = order?.payment_status?.toLowerCase();
  const isPending = status === 'pending';
  const isPartial = status === 'partial';
  const isPaid = status === 'paid';
  const isPartialRefund = status === 'partial refund';
  const isFullRefund = status === 'full refund';

  // For demo: deposit is always $100 if partial
  const deposit = isPartial ? 100 : 0;
  const outstanding = isPartial ? (order?.final_amount - deposit) : order?.final_amount;

  // For refund demo, you may want to get these from order object
  const partialRefundAmount = order?.partial_refund_amount ?? 50; // fallback demo value
  const fullRefundAmount = order?.amount_paid ?? order?.final_amount ?? 0;
  const refundReason = order?.refund_reason ?? 'Customer requested refund.';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Payment"
        action={
          <Chip
            label={order?.payment_status}
            color={getPaymentStatusColor(order?.payment_status)}
            variant="soft"
            sx={{ fontWeight: 600 }}
          />
        }
        sx={{ pb: 0 }}
      />
      <Box sx={{ p: 3, position: 'relative' }}>
        <Stack spacing={2} direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            {isPaid && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                  Amount Paid:
                </Box>
                <Typography sx={{ fontWeight: 600 }}>
                  ${order?.amount_paid?.toFixed(2)}
                </Typography>
              </Box>
            )}
            {isPending && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                  Outstanding Amount:
                </Box>
                <Typography sx={{ fontWeight: 600 }}>
                  ${outstanding?.toFixed(2)}
                </Typography>
              </Box>
            )}
            {isPartial && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Deposit:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${deposit.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Outstanding Amount:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${(order?.final_amount - deposit).toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}
            {isPartialRefund && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Amount Paid:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${order?.amount_paid?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Partial Amount Refunded:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${partialRefundAmount?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Reason:
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {refundReason}
                  </Typography>
                </Box>
              </>
            )}
            {isFullRefund && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Amount Paid:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${order?.amount_paid?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
                    Full Refund Amount:
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${fullRefundAmount?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Reason:
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {refundReason}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
            {(isPaid || isPartial) && (
              <CardInfo last4="5678" />
            )}
            {(isPending || isPartial) && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Generate Payment Link
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}