import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const InvoiceTable = ({
  invoices,
  customers,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSearch,
  onDelete,
  onEdit,
  onViewDetails
}) => {
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  return (
    <Paper>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          style={{ marginRight: '16px' }}
        />
        <Button onClick={() => onPageChange(null, page + 1)}>Next Page</Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{getCustomerName(invoice.customer)}</TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(invoice)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(invoice._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => onViewDetails(invoice)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => onPageChange(null, page - 1)} disabled={page === 0}>
          Previous Page
        </Button>
        <Button onClick={() => onPageChange(null, page + 1)} disabled={page >= Math.ceil(total / rowsPerPage) - 1}>
          Next Page
        </Button>
      </div>
    </Paper>
  );
};

export default InvoiceTable;