import { Typography } from '@mui/material';
import CartItem from './CartItem';

const CartList = ({ items, handleQuantityChange, removeFromCart }) => {
  if (items.length === 0) {
    return (
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          textAlign: 'center',
          fontFamily: 'title',
        }}
      >
        Your cart is empty
      </Typography>
    );
  }
  return items.map((item) => (
    <CartItem
      key={item.id}
      item={item}
      handleQuantityChange={handleQuantityChange}
      removeFromCart={removeFromCart}
    />
  ));
};

export default CartList;