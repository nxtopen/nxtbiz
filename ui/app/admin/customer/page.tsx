"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerTable from '@/components/admin/CustomerTable';
import CustomerDialog from '@/components/admin/CustomerDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomersPage = () => {
  const [customers, setCustomers]:any = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers', {
        params: {
          page: page + 1, // API expects 1-based index
          limit: rowsPerPage,
          search: search
        }
      });
      setCustomers(response.data.customers);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, search]);

  const handleAddCustomer = async () => {
    try {
      const response = await axios.post('/api/customers', newCustomer);
      setCustomers([...customers, response.data]);
      setOpenAddDialog(false);
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      });
      fetchCustomers(); // Re-fetch customers after adding
      toast.success('Customer added successfully.');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer.');
    }
  };

  const handleEditCustomer = async () => {
    try {
      const response = await axios.put(`/api/customers/${editCustomer._id}`, editCustomer);
      setCustomers(customers.map((customer: { _id: string; }) => (customer._id === editCustomer._id ? response.data : customer)));
      setOpenEditDialog(false);
      setEditCustomer({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      });
      fetchCustomers(); // Re-fetch customers after editing
      toast.success('Customer updated successfully.');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer.');
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      fetchCustomers(); // Re-fetch customers after deletion
      toast.success('Customer deleted successfully.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer.');
    }
  };

  const handlePageChange = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleSearch = (value: React.SetStateAction<string>) => {
    setSearch(value);
    setPage(0); // Reset to first page on search
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (openAddDialog) handleAddCustomer();
      if (openEditDialog) handleEditCustomer();
    }
  };

  const handleOpenEditDialog = (customer: React.SetStateAction<{ _id: string; firstName: string; lastName: string; email: string; phone: string; address: string; }>) => {
    setEditCustomer(customer);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditCustomer({
      _id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleViewDetails = (customer: React.SetStateAction<null>) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CustomerTable
        customers={customers}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onEdit={handleOpenEditDialog}
        onViewDetails={handleViewDetails}
      />
      <CustomerDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddCustomer}
        title="Add Customer"
        content="Fill in the details below to add a new customer."
        customer={newCustomer}
        setCustomer={setNewCustomer}
        onKeyDown={handleKeyDown} // Add onKeyDown handler here
      />
      <CustomerDialog
        open={selectedCustomer !== null}
        onClose={handleCloseDetails}
        onSubmit={() => {}}
        title="Customer Details"
        content=""
        customer={selectedCustomer}
        setCustomer={() => {}}
        onKeyDown={handleKeyDown} // Add onKeyDown handler here
      />
      <CustomerDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditCustomer}
        title="Edit Customer"
        content="Update the details below to edit the customer."
        customer={editCustomer}
        setCustomer={setEditCustomer}
        onKeyDown={handleKeyDown} // Add onKeyDown handler here
      />
      <ToastContainer />
    </div>
  );
};

export default CustomersPage;