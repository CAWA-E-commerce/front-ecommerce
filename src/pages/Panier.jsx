import React, { useState } from 'react';
import { Typography, Button, Box, IconButton, Alert } from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import Threads from '../Backgrounds/Threads/Threads';
import useCartStore from '../stores/cartStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const CheckoutConfirmationModal = ({ open, onClose, commandId, onViewOrder }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Commande Confirmée</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Votre commande a été enregistrée avec succès. Voici votre ID de commande : <strong>{commandId}</strong>.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Veuillez conserver cet ID pour consulter votre commande ultérieurement.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Continuer les achats
        </Button>
        <Button onClick={onViewOrder} variant="contained" color="primary">
          Voir la commande
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Panier = () => {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [commandId, setCommandId] = useState(null);

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    // Log cart items for debugging
    console.log('Cart items:', items);

    // Validate each item
    for (const item of items) {
      if (!item.id || item.id === '') {
        console.log('Invalid item (missing ID):', item);
        setError(`L'article "${item.name || 'inconnu'}" n'a pas d'ID de produit valide.`);
        return;
      }
      if (isNaN(item.quantity) || item.quantity <= 0) {
        console.log('Invalid item (invalid quantity):', item);
        setError(`L'article "${item.name || 'inconnu'}" a une quantité invalide.`);
        return;
      }
      if (!item.price || isNaN(item.price)) {
        console.log('Invalid item (invalid price):', item);
        setError(`L'article "${item.name || 'inconnu'}" a un prix invalide.`);
        return;
      }
    }

    // Convert cart items to XML, escaping special characters
    const escapeXml = (unsafe) => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    const xmlItems = items
      .map(
        (item) => `
        <item>
          <product_id>${escapeXml(item.id)}</product_id>
          <quantity>${item.quantity}</quantity>
          <price>${item.price}</price>
        </item>`
      )
      .join('');
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<command>
    <items>
        ${xmlItems}
    </items>
</command>`;

    console.log('XML to send:', xmlData);

    try {
      setError(null);
      const response = await fetch('http://127.0.0.1:5000/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
        },
        body: xmlData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la création de la commande');
      }

      const data = await response.json();
      setCommandId(data.id);
      setModalOpen(true);
      clearCart(); // Clear the cart after successful checkout
    } catch (err) {
      setError(`Erreur lors de la commande : ${err.message}`);
      console.error('Checkout error:', err);
    }
  };

  const handleContinueShopping = () => {
    setModalOpen(false);
    setCommandId(null);
  };

  const handleViewOrder = () => {
    setModalOpen(false);
    setCommandId(null);
    window.location.href = '/commandes';
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
            marginBottom: '1rem',
          }}
        >
          Your Cart
        </Typography>

        <Button
          variant="outlined"
          onClick={() => window.location.href = '/'}
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

        {error && (
          <Alert severity="error" sx={{ width: '80%', maxWidth: '800px', mb: 2 }}>
            {error}
          </Alert>
        )}

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
                        {item.price} DA
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
            </>
          )}
        </Box>
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>

      <CheckoutConfirmationModal
        open={modalOpen}
        onClose={handleContinueShopping}
        commandId={commandId}
        onViewOrder={handleViewOrder}
      />
    </div>
  );
};

export default Panier;