import { Box, Typography, Button } from '@mui/material';

const CartSummary = ({ getTotal, handleCheckout, items }) => {
  if (items.length === 0) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Typography variant="h5" sx={{ color: 'white', fontFamily: 'title' }}>
        Total: {getTotal().toFixed(2)} DA
      </Typography>
      <Button
        variant="contained"
        onClick={handleCheckout}
        sx={{
          backgroundColor: '#4CAF50',
          '&:hover': { backgroundColor: '#45a049' },
          fontFamily: 'title',
        }}
      >
        Checkout
      </Button>
    </Box>
  );
};

export default CartSummary;