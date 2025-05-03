import { Alert } from '@mui/material';

const CommandFeedback = ({ error, success }) => (
  <>
    {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mb: 4 }}>{success}</Alert>}
  </>
);

export default CommandFeedback;