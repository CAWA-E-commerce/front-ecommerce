import { Paper, Typography, Box, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CommandSearch = ({
  enteredCommandId,
  handleInputChange,
  handleKeyPress,
  handleSearchCommand,
}) => (
  <Paper
    elevation={3}
    sx={{
      backgroundColor: '#1E293B',
      p: 3,
      mb: 4,
      borderRadius: '10px',
      width: '60%',
    }}
  >
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
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6B7280',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3B82F6',
            },
          },
        }}
        InputLabelProps={{ sx: { color: '#94A3B8' } }}
      />
      <Button variant="contained" color="primary" onClick={handleSearchCommand}>
        <SearchIcon />
      </Button>
    </Box>
  </Paper>
);

export default CommandSearch;
