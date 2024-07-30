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

const InvoiceList = () => {
  const router = useRouter(); // Use router from next/navigation
  const [invoices, setInvoices] = useState<any[]>([]);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'canceled'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'INR' | 'USD'>('all');

  // Function to fetch invoices from API
  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices', {
        params: {
          page: page + 1, // Adjust for 1-based page indexing
          limit,
          search,
          status: statusFilter === 'all' ? undefined : statusFilter,
          currency: currencyFilter === 'all' ? undefined : currencyFilter,
          sortField,
          sortOrder
        }
      });
      setInvoices(response.data.invoices);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Call fetchInvoices whenever page, limit, search, statusFilter, currencyFilter, sortField, or sortOrder changes
  useEffect(() => {
    fetchInvoices();
  }, [page, limit, search, statusFilter, currencyFilter, sortField, sortOrder]);

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(`/api/invoices/${id}`);
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset to the first page when searching
    fetchInvoices(); // Fetch invoices when search button is clicked
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'paid':
        return 'green';
      case 'canceled':
        return 'red';
      default:
        return 'grey';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Invoices</h1>

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
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid' | 'canceled')}
              style={{ minWidth: '120px' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel>Currency</InputLabel>
            <Select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as 'all' | 'INR' | 'USD')}
              style={{ minWidth: '120px' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/admin/invoices/add" passHref>
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
              <TableCell>
                <TableSortLabel
                  active={sortField === 'invoiceNumber'}
                  direction={sortOrder}
                  onClick={() => handleSort('invoiceNumber')}
                >
                  Invoice Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'subject'}
                  direction={sortOrder}
                  onClick={() => handleSort('subject')}
                >
                  Subject
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'invoiceDate'}
                  direction={sortOrder}
                  onClick={() => handleSort('invoiceDate')}
                >
                  Invoice Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'dueDate'}
                  direction={sortOrder}
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'amount'}
                  direction={sortOrder}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'currency'}
                  direction={sortOrder}
                  onClick={() => handleSort('currency')}
                >
                  Currency
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortOrder}
                  onClick={() => handleSort('status')}
                >
                  Status
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
            {invoices.map((invoice: any) => (
              <TableRow key={invoice._id} sx={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/invoices/${invoice._id}`)}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.subject}</TableCell>
                <TableCell>{moment(invoice.invoiceDate).format('MM/DD/YYYY')}</TableCell>
                <TableCell>{moment(invoice.dueDate).format('MM/DD/YYYY')}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.currency}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    style={{ backgroundColor: getStatusChipColor(invoice.status), color: 'white' }}
                  />
                </TableCell>
                <TableCell>{moment(invoice.createdAt).fromNow()}</TableCell>
                <TableCell>{moment(invoice.updatedAt).fromNow()}</TableCell>
                <TableCell>
                  <Link href={`/admin/invoices/${invoice._id}/edit`} passHref>
                    <span style={{ textDecoration: 'none' }}>
                      <IconButton color="primary">
                        <AiOutlineEdit />
                      </IconButton>
                    </span>
                  </Link>
                  <IconButton color="error" onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    handleDelete(invoice._id);
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

export default InvoiceList;