import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const CheckoutConfirmationModal = ({ open, onClose, commandId, onViewOrder }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Commande Confirmée</DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Votre commande a été enregistrée avec succès. Voici votre ID de commande :{' '}
        <strong>{commandId}</strong>.
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

export default CheckoutConfirmationModal;