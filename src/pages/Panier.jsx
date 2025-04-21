import React from 'react';
import { Typography, Button, Box, IconButton } from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import Threads from '../Backgrounds/Threads/Threads';
import useCartStore from '../stores/cartStore';

const Panier = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();
  console.log(items);
  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingBlock: '10vh',
        }}
      >
        <Typography
          variant="h1"
          style={{
            alignSelf: 'center',
            color: 'white',
            fontFamily: 'title',
            marginBottom: '2rem',
          }}
        >
          Your Cart
        </Typography>

        <Box
          sx={{
            width: '80%',
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem',
          }}
        >
          {items.length === 0 ? (
            <Typography
              variant="h5"
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: 'title',
              }}
            >
              Your cart is empty
            </Typography>
          ) : (
            <>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '1rem',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        style={{ color: 'white', fontFamily: 'title' }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{ color: 'white', fontFamily: 'title' }}
                      >
                        ${item.price}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, -1)
                        }
                        sx={{ color: 'white' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        variant="body1"
                        style={{
                          color: 'white',
                          fontFamily: 'title',
                          margin: '0 1rem',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, 1)
                        }
                        sx={{ color: 'white' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
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
                <Typography
                  variant="h5"
                  style={{ color: 'white', fontFamily: 'title' }}
                >
                  Total: ${getTotal().toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45a049' },
                    fontFamily: 'title',
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>
    </div>
  );
};

export default Panier;
