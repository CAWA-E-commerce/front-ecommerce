import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CartItem = ({ item, handleQuantityChange, removeFromCart }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '1rem',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
        <Typography variant="h6" sx={{ color: 'white', fontFamily: 'title' }}>
          {item.name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', fontFamily: 'title' }}>
          {item.price} DA
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
          sx={{ color: 'white' }}
        >
          <RemoveIcon />
        </IconButton>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontFamily: 'title',
            margin: '0 1rem',
          }}
        >
          {item.quantity}
        </Typography>
        <IconButton
          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
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
);

export default CartItem;