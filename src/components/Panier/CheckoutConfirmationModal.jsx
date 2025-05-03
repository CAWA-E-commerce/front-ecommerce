import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import './checkout.css';
const CheckoutConfirmationModal = ({
  open,
  onClose,
  commandId,
  onViewOrder,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ color: 'white' }}>Commande Confirmée</DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
        Votre commande a été enregistrée avec succès. Voici votre ID de commande
        : <strong>{commandId}</strong>.
      </Typography>
      <Typography variant="body2" sx={{ color: 'white' }}>
        Veuillez conserver cet ID pour consulter votre commande ultérieurement.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" sx={{ color: 'white' }}>
        Continuer les achats
      </Button>
      <Button
        onClick={onViewOrder}
        variant="contained"
        color="primary"
        sx={{ backgroundColor: '#1e1e1e' }}
      >
        Voir la commande
      </Button>
    </DialogActions>
  </Dialog>
);

export default CheckoutConfirmationModal;
