import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  _id?: string;
}

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  customer: Customer | null;
  setCustomer?: (customer: Customer) => void;
  title: string;
  description?: string;
  onCopy?: () => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ open, onClose, onSave, customer, setCustomer, title, description, onCopy }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {description && <DialogContentText>{description}</DialogContentText>}
      {title === 'Customer Details' && customer ? (
        <div>
          <p><strong>First Name:</strong> {customer.firstName}</p>
          <p><strong>Last Name:</strong> {customer.lastName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
        </div>
      ) : (
        customer && (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              value={customer.firstName}
              onChange={(e) => setCustomer && setCustomer({ ...customer, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              value={customer.lastName}
              onChange={(e) => setCustomer && setCustomer({ ...customer, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={customer.email}
              onChange={(e) => setCustomer && setCustomer({ ...customer, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Phone"
              type="text"
              fullWidth
              value={customer.phone}
              onChange={(e) => setCustomer && setCustomer({ ...customer, phone: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              value={customer.address}
              onChange={(e) => setCustomer && setCustomer({ ...customer, address: e.target.value })}
            />
          </>
        )
      )}
    </DialogContent>
    <DialogActions>
      {title === 'Customer Details' ? (
        <>
          <Button onClick={onCopy} color="primary">Copy to Clipboard</Button>
          <Button onClick={onClose} color="primary">Close</Button>
        </>
      ) : (
        <>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={onSave} color="primary">Save</Button>
        </>
      )}
    </DialogActions>
  </Dialog>
);

export default CustomerDialog;