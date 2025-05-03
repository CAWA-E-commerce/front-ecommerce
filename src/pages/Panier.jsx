import React, { useState } from 'react';
import { Box } from '@mui/material';
import useCartStore from '../stores/cartStore';
import Threads from '../Backgrounds/Threads/Threads';
import CartHeader from '../components/Panier/CartHeader';
import CartError from '../components/Panier/CartError';
import CartList from '../components/Panier/CartList';
import CartSummary from '../components/Panier/CartSummary';
import CheckoutConfirmationModal from '../components/Panier/CheckoutConfirmationModal';

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

    console.log('Cart items:', items);

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
      if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
        console.log('Invalid item name:', item);
        setError(`L'article "${item.name || 'inconnu'}" a un nom invalide.`);
        return;
      }
      if (!item.price || isNaN(item.price)) {
        console.log('Invalid item (invalid price):', item);
        setError(`L'article "${item.name || 'inconnu'}" a un prix invalide.`);
        return;
      }
    }

    const escapeXml = (unsafe) => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '<';
          case '>': return '>';
          case '&': return '&';
          case '\'': return '';
          case '"': return '"';
          default: return c;
        }
      });
    };

    const xmlItems = items
      .map(
        (item) => `
        <item>
          <product_id>${escapeXml(item.id)}</product_id>
          <name>${escapeXml(item.name)}</name>
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
      clearCart();
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
        <CartHeader />
        <CartError error={error} />
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
          <CartList
            items={items}
            handleQuantityChange={handleQuantityChange}
            removeFromCart={removeFromCart}
          />
          <CartSummary
            getTotal={getTotal}
            handleCheckout={handleCheckout}
            items={items}
          />
        </Box>
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
        <CheckoutConfirmationModal
          open={modalOpen}
          onClose={handleContinueShopping}
          commandId={commandId}
          onViewOrder={handleViewOrder}
        />
      </div>
    </div>
  );
};

export default Panier;