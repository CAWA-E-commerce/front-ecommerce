import { Alert } from '@mui/material';

const CartError = ({ error }) => {
  if (!error) return null;
  return (
    <Alert severity="error" sx={{ width: '80%', maxWidth: '800px', mb: 2 }}>
      {error}
    </Alert>
  );
};

export default CartError;