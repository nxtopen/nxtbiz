"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Grid, Typography, Paper, Divider, FormControl,
  InputLabel, Select, MenuItem, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import toast
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import React from 'react';

const AddInvoice = () => {
  const router = useRouter();
  const [invoice, setInvoice] = useState({
    customer: null,
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    currency: 'INR',
    status: 'pending',
    invoicedItems: [{ description: '', quantity: '', unitPrice: '', tax: '', discount: '' }],
    subject: '', // Add this field
    user: ''    // Add this field
  });
  const [errors, setErrors] = useState<any>({});
  const [contacts, setContacts] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchContacts = async (query: string) => {
    if (query.length < 2) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/contacts', {
        params: { search: query }
      });
      setContacts(response.data.contacts.map((contact: any) => ({
        id: contact._id,
        name: `${contact.firstName} ${contact.lastName}`
      })));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = [...invoice.invoicedItems];
    newItems[index] = { ...newItems[index], [name]: value };
    setInvoice(prev => ({ ...prev, invoicedItems: newItems }));
  };

  const handleAddItem = () => {
    setInvoice(prev => ({
      ...prev,
      invoicedItems: [...prev.invoicedItems, { description: '', quantity: '', unitPrice: '', tax: '', discount: '' }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setInvoice(prev => ({
      ...prev,
      invoicedItems: prev.invoicedItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: any = {};
    if (!invoice.customer) newErrors.customer = 'Customer is required.';
    if (!invoice.invoiceNumber) newErrors.invoiceNumber = 'Invoice number is required.';
    if (!invoice.invoiceDate) newErrors.invoiceDate = 'Invoice date is required.';
    if (!invoice.dueDate) newErrors.dueDate = 'Due date is required.';
    if (!invoice.subject) newErrors.subject = 'Subject is required.'; // New validation
    if (!invoice.user) newErrors.user = 'User is required.';         // New validation
    if (!['pending', 'paid', 'canceled'].includes(invoice.status)) newErrors.status = 'Status must be either pending, paid, or canceled.';
    if (invoice.invoicedItems.some(item => !item.description || !item.quantity || !item.unitPrice || isNaN(Number(item.quantity)) || isNaN(Number(item.unitPrice)) || isNaN(Number(item.tax)) || isNaN(Number(item.discount)))) newErrors.items = 'All item fields must be filled and valid.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => toast.error(error));
      return;
    }

    try {
      await axios.post('/api/invoices', invoice);
      toast.success('Invoice added successfully!');
      router.push('/admin/invoices');
    } catch (error) {
      toast.error('Error adding invoice.');
      console.error('Error adding invoice:', error);
    }
  };

  const handleSelectContact = (event: React.SyntheticEvent, newValue: { id: string, name: string } | null) => {
    setInvoice(prev => ({ ...prev, customer: newValue ? newValue.id : null }));
  };

  // Calculate totals
  const calculateTotals = () => {
    let subTotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    invoice.invoicedItems.forEach(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const tax = parseFloat(item.tax) || 0;
      const discount = parseFloat(item.discount) || 0;

      const itemTotal = quantity * unitPrice;
      const itemTax = (itemTotal * tax) / 100;
      const itemDiscount = (itemTotal * discount) / 100;

      subTotal += itemTotal;
      totalTax += itemTax;
      totalDiscount += itemDiscount;
    });

    const grandTotal = subTotal + totalTax - totalDiscount;

    return { subTotal, totalTax, totalDiscount, grandTotal };
  };

  const { subTotal, totalTax, totalDiscount, grandTotal } = calculateTotals();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Add Invoice</Typography>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id="customer-autocomplete"
                options={contacts}
                getOptionLabel={(option) => option.name}
                loading={loading}
                onInputChange={(event, newInputValue) => fetchContacts(newInputValue)}
                onChange={handleSelectContact}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Contact"
                    placeholder="Select a contact"
                    value={contacts.find(contact => contact.id === invoice.customer)?.name || ''}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <span>Loading...</span> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    fullWidth
                    size='small'
                  />
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.invoiceNumber}
                helperText={errors.invoiceNumber}
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Date"
                type="date"
                name="invoiceDate"
                value={invoice.invoiceDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.invoiceDate}
                helperText={errors.invoiceDate}
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={invoice.dueDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject" // New field
                name="subject"
                value={invoice.subject}
                onChange={handleChange}
                fullWidth
                error={!!errors.subject}
                helperText={errors.subject}
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="User" // New field
                name="user"
                value={invoice.user}
                onChange={handleChange}
                fullWidth
                error={!!errors.user}
                helperText={errors.user}
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={invoice.status}
                  onChange={handleChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={invoice.currency}
                  onChange={handleChange}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Invoice Items</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Tax (%)</TableCell>
                  <TableCell>Discount (%)</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Tax Amount</TableCell>
                  <TableCell>Total + Tax</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.invoicedItems.map((item, index) => {
                  const quantity = parseFloat(item.quantity) || 0;
                  const unitPrice = parseFloat(item.unitPrice) || 0;
                  const tax = parseFloat(item.tax) || 0;
                  const discount = parseFloat(item.discount) || 0;

                  const itemTotal = quantity * unitPrice;
                  const itemTax = (itemTotal * tax) / 100;
                  const itemDiscount = (itemTotal * discount) / 100;
                  const totalWithTax = itemTotal + itemTax;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          name="description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, e)}
                          fullWidth
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          fullWidth
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="unitPrice"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, e)}
                          fullWidth
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="tax"
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, e)}
                          fullWidth
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="discount"
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, e)}
                          fullWidth
                          size='small'
                        />
                      </TableCell>
                      <TableCell>{invoice.currency === 'INR' ? '₹' : '$'}{itemTotal.toFixed(2)}</TableCell>
                      <TableCell>{invoice.currency === 'INR' ? '₹' : '$'}{itemTax.toFixed(2)}</TableCell>
                      <TableCell>{invoice.currency === 'INR' ? '₹' : '$'}{totalWithTax.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => handleRemoveItem(index)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddItem}
            style={{ margin: '20px 0' }}
          >
            Add Item
          </Button>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Summary</Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><strong>Sub Total:</strong></TableCell>
                <TableCell align="right">{invoice.currency === 'INR' ? '₹' : '$'}{subTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Total Tax:</strong></TableCell>
                <TableCell align="right">{invoice.currency === 'INR' ? '₹' : '$'}{totalTax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Total Discount:</strong></TableCell>
                <TableCell align="right">{invoice.currency === 'INR' ? '₹' : '$'}{totalDiscount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Grand Total:</strong></TableCell>
                <TableCell align="right">{invoice.currency === 'INR' ? '₹' : '$'}{grandTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button type="submit" variant="contained" color="primary">
            Save Invoice
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddInvoice;
