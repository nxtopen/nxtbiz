"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, IconButton, TextField, Button, Select, MenuItem, InputLabel, FormControl,
  Paper, TablePagination, TableFooter, Chip, Grid
} from '@mui/material';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg'; // Import add icon
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Update import

const ContactList = () => {
  const router = useRouter(); // Use router from next/navigation
  const [contacts, setContacts] = useState<any[]>([]);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'lead'>('all');

  // Function to fetch contacts from API
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contacts', {
        params: {
          page: page + 1, // Adjust for 1-based page indexing
          limit,
          search,
          filter,
          sortField,
          sortOrder
        }
      });
      setContacts(response.data.contacts);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Call fetchContacts whenever page, limit, search, filter, sortField, or sortOrder changes
  useEffect(() => {
    fetchContacts();
  }, [page, limit, search, filter, sortField, sortOrder]);

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/api/contacts/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset to the first page when searching
    fetchContacts(); // Fetch contacts when search button is clicked
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'darkgreen';
      case 'lead':
        return 'orange';
      default:
        return 'grey';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Contacts</h1>

      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%' }}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'customer' | 'lead')}
              style={{ minWidth: '120px' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/admin/contacts/add" passHref>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CgAdd />}
              style={{ float: 'right' }}
            >
              Add
            </Button>
          </Link>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'firstName'}
                  direction={sortOrder}
                  onClick={() => handleSort('firstName')}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'lastName'}
                  direction={sortOrder}
                  onClick={() => handleSort('lastName')}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortOrder}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'phone'}
                  direction={sortOrder}
                  onClick={() => handleSort('phone')}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortOrder}
                  onClick={() => handleSort('createdAt')}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'updatedAt'}
                  direction={sortOrder}
                  onClick={() => handleSort('updatedAt')}
                >
                  Updated At
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact: any) => (
              <TableRow key={contact._id} sx={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/contacts/${contact._id}`)}>
                <TableCell>
                  <Chip
                    label={contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                    style={{ backgroundColor: getChipColor(contact.type), color: 'white' }}
                  />
                </TableCell>
                <TableCell>
                  <span style={{ textDecoration: 'none' }}>{contact.firstName}</span>
                </TableCell>
                <TableCell>{contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{moment(contact.createdAt).fromNow()}</TableCell>
                <TableCell>{moment(contact.updatedAt).fromNow()}</TableCell>
                <TableCell>
                  <Link href={`/admin/contacts/${contact._id}/edit`} passHref>
                    <span style={{ textDecoration: 'none' }}>
                      <IconButton color="primary">
                        <AiOutlineEdit />
                      </IconButton>
                    </span>
                  </Link>
                  <IconButton color="error" onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    handleDelete(contact._id);
                  }}>
                    <AiOutlineDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                count={total}
                rowsPerPage={limit}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setLimit(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContactList;