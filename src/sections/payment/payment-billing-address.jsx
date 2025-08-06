import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// ----------------------------------------------------------------------

export function PaymentBillingAddress() {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Delivery Address
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full name"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone number"
            size="small"
            placeholder="e.g., 91234567"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            multiline
            rows={2}
            size="small"
            placeholder="Block, Street Name"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Floor"
            size="small"
            placeholder="e.g., 12"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Unit"
            size="small"
            placeholder="e.g., 34"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Postal Code"
            size="small"
            placeholder="e.g., 123456"
          />
        </Grid>
      </Grid>
    </div>
  );
}
