import { Box, Typography, CircularProgress } from '@mui/material';

const CommandResult = ({ loading, enteredCommandId, error, resultRef }) => (
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
);

export default CommandResult;