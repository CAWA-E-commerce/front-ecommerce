import { Typography, Button } from "@mui/material";
const CartHeader = () => (
    <>
      <Typography
        variant="h1"
        sx={{
          alignSelf: 'center',
          color: 'white',
          fontFamily: 'title',
          marginBottom: '1rem',
        }}
      >
        Your Cart
      </Typography>
      <Button
        variant="outlined"
        onClick={() => (window.location.href = '/')}
        sx={{
          color: '#4CAF50',
          borderColor: '#4CAF50',
          fontFamily: 'title',
          mb: 3,
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: '#45a049',
          },
        }}
      >
        Retour à l'accueil
      </Button>
    </>
  );
  
  export default CartHeader;