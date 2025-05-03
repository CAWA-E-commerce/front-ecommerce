import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmer la suppression</DialogTitle>
    <DialogContent>
      <Typography>Êtes-vous sûr de vouloir supprimer cette commande ?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Annuler</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Supprimer</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationModal;