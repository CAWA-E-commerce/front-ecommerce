import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import CommandHeader from '../components/Commands/CommandHeader';
import CommandSearch from '../components/Commands/CommandSearch';
import CommandFeedback from '../components/Commands/CommandFeedback';
import CommandResult from '../components/Commands/CommandResult';
import DeleteConfirmationModal from '../components/Commands/DeleteConfirmationModal';
import './Commandes.css';

const Commandes = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [commandToDelete, setCommandToDelete] = useState(null);
  const [enteredCommandId, setEnteredCommandId] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    window.deleteCommand = (commandId) => {
      console.log('deleteCommand called with ID:', commandId);
      setCommandToDelete(commandId);
      setOpenDialog(true);
    };

    return () => {
      console.log('Cleaning up deleteCommand');
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
      setSuccess(null);
  
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
      setError(null);
      setSuccess(null);

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
      setSuccess('Commande supprimée avec succès');
      setLoading(false);
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Échec de la suppression de la commande: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCommandToDelete(null);
  };

  return (
    <Box className="min-h-screen bg-gray-900 p-8">
      <CommandHeader />
      <CommandSearch
        enteredCommandId={enteredCommandId}
        handleInputChange={handleInputChange}
        handleKeyPress={handleKeyPress}
        handleSearchCommand={handleSearchCommand}
      />
      <CommandFeedback error={error} success={success} />
      <CommandResult
        loading={loading}
        enteredCommandId={enteredCommandId}
        error={error}
        resultRef={resultRef}
      />
      <DeleteConfirmationModal
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Commandes;