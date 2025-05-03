import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const CartConfirmationModal = ({
  open,
  onClose,
  productName,
  onContinueShopping,
  onGoToCart,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          color: '#f5f5f5',
          borderRadius: 4,
          p: 3,
        },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <ShoppingCartCheckoutIcon sx={{ fontSize: 32, color: '#90caf9' }} />
        </Box>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#ffffff',
            p: 0,
            mb: 1,
          }}
        >
          Produit ajouté !
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Typography sx={{ color: '#cccccc', mb: 1 }}>
            <strong>{productName}</strong> a été ajouté à votre panier avec succès.
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Que souhaitez-vous faire maintenant ?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            onClick={onContinueShopping}
            startIcon={<ShoppingBagIcon />}
            sx={{
              borderColor: '#555',
              color: '#ddd',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                borderColor: '#777',
                backgroundColor: '#222',
              },
            }}
          >
            Continuer mes achats
          </Button>
          <Button
            variant="contained"
            onClick={onGoToCart}
            startIcon={<ShoppingCartCheckoutIcon />}
            sx={{
              background: 'linear-gradient(135deg, #3f51b5, #1e88e5)',
              color: '#fff',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #303f9f, #1565c0)',
              },
            }}
          >
            Voir mon panier
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CartConfirmationModal;
