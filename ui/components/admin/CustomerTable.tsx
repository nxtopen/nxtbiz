import React, { useState, useEffect } from 'react';
import { VscAdd } from "react-icons/vsc";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhone, FaSignsPost } from "react-icons/fa6";

import axios from 'axios';
import {
  Button,
  TextField,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip
} from '@mui/material';
import { toast } from 'react-toastify';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, '_id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] = useState<Customer>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, debouncedSearchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customers', {
        params: { search: debouncedSearchQuery, page: page, limit: rowsPerPage }
      });
      setCustomers(response.data.customers);
      setTotalPages(Math.ceil(response.data.total / rowsPerPage));
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setCustomerToDelete(id);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await axios.delete(`/api/customers/${customerToDelete}`);
        fetchCustomers();
        toast.success('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Error deleting customer');
      } finally {
        setOpenConfirmDialog(false);
        setCustomerToDelete(null);
      }
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('/api/customers', newCustomer);
      setOpenAddDialog(false);
      setNewCustomer({ firstName: '', lastName: '', email: '', phone: '', address: '' });
      fetchCustomers();
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Error adding customer');
    }
  };

  const handleEditCustomer = async () => {
    try {
      await axios.put(`/api/customers/${editCustomer._id}`, editCustomer);
      setOpenEditDialog(false);
      setEditCustomer({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      });
      fetchCustomers();
      toast.success('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Error updating customer');
    }
  };

  const handleViewDetails = (customer: Customer) => setSelectedCustomer(customer);

  const handleCloseDetails = () => setSelectedCustomer(null);

  const handleOpenEditDialog = (customer: Customer) => {
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

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setPage(1);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Press Enter to search"
          style={{ width: '250px' }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
          <VscAdd /> New
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No Customers Found!
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                  <TableCell>
                    {customer.email && <Chip icon={<MdOutlineAlternateEmail />} label={`${customer.email}`} color="primary" style={{ marginRight: '4px' }} />}
                    {customer.phone && <Chip icon={<FaPhone />} label={`${customer.phone}`} color="secondary" style={{ marginRight: '4px' }} />}
                    {customer.address && <Chip icon={<FaSignsPost />} label={`${customer.address}`} color="default" />}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewDetails(customer)}>View</Button>
                    <Button onClick={() => handleOpenEditDialog(customer)} color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(customer._id)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Add Customer Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill in the details below to add a new customer.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={newCustomer.firstName}
            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newCustomer.lastName}
            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleAddCustomer} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the details below to edit the customer.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={editCustomer.firstName}
            onChange={(e) => setEditCustomer({ ...editCustomer, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={editCustomer.lastName}
            onChange={(e) => setEditCustomer({ ...editCustomer, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editCustomer.email}
            onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={editCustomer.phone}
            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={editCustomer.address}
            onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
          <Button onClick={handleEditCustomer} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Customer Details Dialog */}
      <Dialog open={Boolean(selectedCustomer)} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div><strong>First Name:</strong> {selectedCustomer?.firstName}</div>
            <div><strong>Last Name:</strong> {selectedCustomer?.lastName}</div>
            <div><strong>Email:</strong> {selectedCustomer?.email}</div>
            <div><strong>Phone:</strong> {selectedCustomer?.phone}</div>
            <div><strong>Address:</strong> {selectedCustomer?.address}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpenEditDialog(selectedCustomer!)} color="primary">Edit</Button>
          <Button onClick={handleCloseDetails} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this customer? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerTable;