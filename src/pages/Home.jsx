import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, CardContent, Typography } from '@mui/material';

const Home = () => {
  const [error, setError] = useState(null);
  const resultRef = useRef();

  useEffect(() => {
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
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <div ref={resultRef} />
    </Container>
  );
};

export default Home;
