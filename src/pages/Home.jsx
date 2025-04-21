import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import Threads from '../Backgrounds/Threads/Threads';

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
    <div
      style={{
        overflow: 'hidden',
      }}
    >
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
    </div>
  );
};

export default Home;
