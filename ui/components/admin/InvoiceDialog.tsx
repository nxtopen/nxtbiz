import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button } from '@mui/material';

const InvoiceDialog = ({ open, onClose, onSubmit, title, content, invoice, setInvoice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers', {
          params: { search: searchQuery }
        });
        setCustomers(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    if (searchQuery) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
  }, [searchQuery]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Customer"
          fullWidth
          value={invoice.customer}
          onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })}
          select
        >
          {customers.map((customer) => (
            <MenuItem key={customer._id} value={customer._id}>
              {customer.firstName} {customer.lastName} ({customer.email})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Search Customer"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TextField
          label="Invoice Number"
          fullWidth
          value={invoice.invoiceNumber}
          onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
        />
        <TextField
          label="Date"
          fullWidth
          type="date"
          value={invoice.date}
          onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Amount"
          fullWidth
          type="number"
          value={invoice.amount}
          onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
        />
        <TextField
          label="Status"
          fullWidth
          value={invoice.status}
          onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
          select
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </TextField>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;