import React, { useEffect, useState, useRef } from 'react';
import { Typography, IconButton, Tooltip, Badge } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Threads from '../Backgrounds/Threads/Threads';
import useCartStore from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import CartConfirmationModal from '../components/CartConfirmationModal';
import StoreIcon from '@mui/icons-material/Store';

const Home = () => {
  const [error, setError] = useState(null);
  const resultRef = useRef();
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();
  
  // Add state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    window.addToCart = (button) => {
      const product = {
        id: button.getAttribute('data-product-id'),
        name: button.getAttribute('data-product-name'),
        price: parseFloat(button.getAttribute('data-product-price')),
        image: button.getAttribute('data-product-image'),
      };
    
      console.log('Button attributes:', {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    
      // Validate product ID
      if (!product.id || product.id === '') {
        console.warn('Cannot add product to cart: missing or empty product ID');
        button.textContent = 'Erreur: ID manquant';
        button.style.backgroundColor = '#f44336';
        setTimeout(() => {
          button.textContent = 'Ajouter au panier';
          button.style.backgroundColor = '';
        }, 1000);
        return;
      }
    
      // Validate other attributes
      if (!product.name || isNaN(product.price) || !product.image) {
        console.warn('Cannot add product to cart: invalid product details');
        button.textContent = 'Erreur: Données invalides';
        button.style.backgroundColor = '#f44336';
        setTimeout(() => {
          button.textContent = 'Ajouter au panier';
          button.style.backgroundColor = '';
        }, 1000);
        return;
      }
    
      addToCart(product);
      setAddedProduct(product);
      setModalOpen(true);
    
      button.textContent = 'Ajouté !';
      button.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        button.textContent = 'Ajouter au panier';
        button.style.backgroundColor = '';
      }, 1000);
    };

    const fetchAndTransform = async () => {
      try {
        const [xmlRes, xsltRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/products'),
          fetch('http://127.0.0.1:5000/static/xslt/product-style.xslt'),
        ]);

        const xmlText = await xmlRes.text();
        const xsltText = await xsltRes.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const xslt = parser.parseFromString(xsltText, 'application/xml');

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslt);

        const resultDoc = xsltProcessor.transformToFragment(xml, document);
        resultRef.current.innerHTML = '';
        resultRef.current.appendChild(resultDoc);
      } catch (err) {
        setError('Failed to load or transform XML');
        console.error(err);
      }
    };

    fetchAndTransform();

    return () => {
      delete window.addToCart;
    };
  }, [addToCart]);

  const goToPanierPage = () => {
    navigate('/panier');
  };
  const goToOrdersPage = () => {
    navigate('/commandes');
  };

  const handleContinueShopping = () => {
    setModalOpen(false);
  };

  const handleGoToCart = () => {
    setModalOpen(false);
    navigate('/panier');
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}
      >
        <Tooltip title="Voir le panier">
          <IconButton
            onClick={goToPanierPage}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px'
            }}
          >
            <Badge badgeContent={cartItems.length} color="primary">
              <ShoppingBasketIcon sx={{fontSize:"40px"}} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Voir mes commandes">
          <IconButton
            onClick={goToOrdersPage}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px'
            }}
          >
            <Badge color="primary">
              <StoreIcon sx={{fontSize:"40px"}} />
            </Badge>
          </IconButton>
        </Tooltip>
      </div>

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
          }}
        >
          ByteVault
        </Typography>
        <Typography
          variant="h4"
          style={{
            alignSelf: 'center',
            color: 'white',
            fontFamily: 'title',
          }}
        >
          All you need right here .
        </Typography>
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>

      {error && <Typography color="error">{error}</Typography>}
      <div ref={resultRef} />
      
      <CartConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={addedProduct?.name || ''}
        onContinueShopping={handleContinueShopping}
        onGoToCart={handleGoToCart}
      />
    </div>
  );
};

export default Home;