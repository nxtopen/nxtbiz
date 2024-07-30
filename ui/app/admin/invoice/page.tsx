"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import InvoiceTable from '@/components/admin/InvoiceTable';
import InvoiceDialog from '@/components/admin/InvoiceDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    invoiceNumber: '',
    date: '',
    amount: '',
    status: 'pending'
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editInvoice, setEditInvoice] = useState({
    _id: '',
    customer: '',
    invoiceNumber: '',
    date: '',
    amount: '',
    status: 'pending'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices', {
        params: {
          page: page + 1, // API expects 1-based index
          limit: rowsPerPage,
          search: search
        }
      });
      setInvoices(response.data.invoices);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, rowsPerPage, search]);

  const handleAddInvoice = async () => {
    try {
      const response = await axios.post('/api/invoices', newInvoice);
      setInvoices([...invoices, response.data]);
      setOpenAddDialog(false);
      setNewInvoice({
        customer: '',
        invoiceNumber: '',
        date: '',
        amount: '',
        status: 'pending'
      });
      fetchInvoices(); // Re-fetch invoices after adding
      toast.success('Invoice added successfully.');
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to add invoice.');
    }
  };

  const handleEditInvoice = async () => {
    try {
      const response = await axios.put(`/api/invoices/${editInvoice._id}`, editInvoice);
      setInvoices(invoices.map((invoice) => (invoice._id === editInvoice._id ? response.data : invoice)));
      setOpenEditDialog(false);
      setEditInvoice({
        _id: '',
        customer: '',
        invoiceNumber: '',
        date: '',
        amount: '',
        status: 'pending'
      });
      fetchInvoices(); // Re-fetch invoices after editing
      toast.success('Invoice updated successfully.');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/invoices/${id}`);
      fetchInvoices(); // Re-fetch invoices after deletion
      toast.success('Invoice deleted successfully.');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice.');
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0); // Reset to first page on search
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (openAddDialog) handleAddInvoice();
      if (openEditDialog) handleEditInvoice();
    }
  };

  const handleOpenEditDialog = (invoice) => {
    setEditInvoice(invoice);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditInvoice({
      _id: '',
      customer: '',
      invoiceNumber: '',
      date: '',
      amount: '',
      status: 'pending'
    });
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
        Add Invoice
      </Button>
      <InvoiceTable
        invoices={invoices}
        onEdit={handleOpenEditDialog}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        search={search}
        onSearch={handleSearch}
      />
      <InvoiceDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddInvoice}
        title="Add Invoice"
        content="Fill in the details below to add a new invoice."
        invoice={newInvoice}
        setInvoice={setNewInvoice}
      />
      <InvoiceDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditInvoice}
        title="Edit Invoice"
        content="Update the details below to edit the invoice."
        invoice={editInvoice}
        setInvoice={setEditInvoice}
      />
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onClose={handleCloseDetails}>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogContent>
            <pre>{JSON.stringify(selectedInvoice, null, 2)}</pre>
          </DialogContent>
          <Button onClick={handleCloseDetails} color="secondary">
            Close
          </Button>
        </Dialog>
      )}
      <ToastContainer />
    </div>
  );
};

export default InvoicesPage;