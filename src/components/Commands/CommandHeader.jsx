import { Paper, Typography, Button } from '@mui/material';

const CommandHeader = () => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      mb: 4,
      backgroundColor: 'black',
      borderRadius: '10px',
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
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
      Commandes
    </Typography>

    <Button
      variant="outlined"
      onClick={() => (window.location.href = '/')}
      sx={{
        color: '#4CAF50',
        borderColor: '#4CAF50',
        fontFamily: 'title',
        mb: 3,
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: '#45a049',
        },
        width: '200px',
      }}
    >
      Retour à l'accueil
    </Button>
  </Paper>
);

export default CommandHeader;
