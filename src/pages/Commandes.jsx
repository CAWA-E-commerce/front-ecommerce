import React, { useState, useRef, useEffect } from 'react';
import {
  Typography, Box, Paper, Button, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Commandes = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredCommandId, setEnteredCommandId] = useState('');
  const [commandToDelete, setCommandToDelete] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    window.deleteCommand = (commandId) => {
      setCommandToDelete(commandId);
      setOpenDialog(true);
    };

    return () => {
      delete window.deleteCommand;
    };
  }, []);
  const fetchCommand = async (commandId) => {
    if (!commandId) {
      setError("Veuillez entrer un ID de commande");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const [xmlRes, xsltRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/commands/${commandId}`),
        fetch('http://127.0.0.1:5000/static/xslt/command-style.xslt')
      ]);
  
      if (!xmlRes.ok) {
        if (xmlRes.status === 404) {
          setError(`Commande #${commandId} introuvable`);
          setLoading(false);
          if (resultRef.current) resultRef.current.innerHTML = '';
          return;
        }
        const errorText = await xmlRes.text();
        throw new Error(`Command fetch failed with status ${xmlRes.status}: ${errorText}`);
      }
  
      const xmlText = await xmlRes.text();
      const xsltText = await xsltRes.text();
  
      console.log('XML content:', xmlText);
      console.log('XSLT content:', xsltText);
  
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'application/xml');
      const xslt = parser.parseFromString(xsltText, 'application/xml');
  
      console.log('Parsed XML:', xml);
      console.log('Parsed XSLT:', xslt);
  
      if (xml.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid XML: Parsing error in command XML');
      }
      if (xslt.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid XSLT: Parsing error in XSLT stylesheet');
      }
  
      if (xsltRes.ok) {
        try {
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslt);
            const resultDocument = xsltProcessor.transformToFragment(xml, document);
            console.log('Appending XSLT result:', resultDocument);
          
            if (!resultDocument) {
              // Log additional context
              console.log('XML document:', xml);
              console.log('XSLT document:', xslt);
              throw new Error('XSLT transformation returned null');
            }
          
            if (resultRef.current) {
              resultRef.current.innerHTML = '';
              resultRef.current.appendChild(resultDocument);
            } else {
              console.error('resultRef is not attached to a DOM element');
            }
          } catch (transformError) {
            console.error('Transformation error details:', transformError);
            throw new Error(`XSLT transformation failed: ${transformError.message}`);
          }
      } else {
        throw new Error(`XSLT fetch failed with status ${xsltRes.status}`);
      }
  
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
      if (resultRef.current) resultRef.current.innerHTML = '';
      setLoading(false);
    }
  };

  const handleSearchCommand = () => {
    fetchCommand(enteredCommandId);
  };

  const handleInputChange = (e) => {
    setEnteredCommandId(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchCommand();
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:5000/commands/${commandToDelete}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete command');
      }

      setOpenDialog(false);
      if (resultRef.current) resultRef.current.innerHTML = '';
      setEnteredCommandId('');
      setLoading(false);
    } catch (err) {
      setError(`Failed to delete command: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <Box className="min-h-screen bg-gray-900 p-8">
      <Paper elevation={3} sx={{ backgroundColor: '#1E293B', p: 3, mb: 4, borderRadius: '10px', borderLeft: '6px solid #3B82F6', margin:"auto", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center" }}>
      <Typography
        variant="h1"
        style={{
          alignSelf: 'center',
          color: 'white',
          fontFamily: 'title',
          marginBottom: '1rem',
        }}
      >
       Commandes
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
          width:"200px"
        }}
      >
        Retour à l'accueil
      </Button>
       
      </Paper>
  
      <Paper elevation={3} sx={{ backgroundColor: '#1E293B', p: 3, mb: 4, borderRadius: '10px' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Rechercher votre commande
        </Typography>
  
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Entrer l'ID de commande"
            variant="outlined"
            fullWidth
            value={enteredCommandId}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              sx: {
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#4B5563' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6B7280' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6' },
              },
            }}
            InputLabelProps={{ sx: { color: '#94A3B8' } }}
          />
          <Button variant="contained" color="primary" onClick={handleSearchCommand}>
            <SearchIcon />
          </Button>
        </Box>
      </Paper>
  
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
  
      <Box sx={{ backgroundColor: '#1E293B', p: 3, borderRadius: '10px', color: 'white' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={60} thickness={4} color="primary" />
          </Box>
        ) : enteredCommandId === '' && !error ? (
          <Typography sx={{ textAlign: 'center' }}>
            Aucune commande affichée. Veuillez entrer un ID de commande.
          </Typography>
        ) : null}
        <div ref={resultRef}></div>
      </Box>
  
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette commande ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Commandes;
