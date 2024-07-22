"use client";

import { Container, Grid, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Tooltip, Modal, Backdrop, Fade, Box, Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from "react";

const customersData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", phone: "555-555-5555" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(customersData);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        handleOpenModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAddCustomer = () => {
    const newCustomer = {
      id: customers.length + 1,
      name: newCustomerName.trim(),
      email: newCustomerEmail.trim(),
      phone: newCustomerPhone.trim(),
    };

    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      setCustomers([...customers, newCustomer]);
      setNewCustomerName("");
      setNewCustomerEmail("");
      setNewCustomerPhone("");
      handleCloseModal();
    }
  };

  const handleSort = (property: any) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    const sortedCustomers = customers.slice().sort((a:any, b:any) => {
      const aValue = a[property];
      const bValue = b[property];
      if (aValue < bValue) {
        return isAsc ? -1 : 1;
      } else if (aValue > bValue) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    setCustomers(sortedCustomers);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Fab color="primary" aria-label="add" onClick={handleOpenModal}>
            <AddIcon />
          </Fab>
        </Box>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                Add New Customer
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCustomer}
              >
                Add Customer
              </Button>
            </Box>
          </Fade>
        </Modal>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Customers List</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <IconButton onClick={() => handleSort('name')}>
                          Name
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <IconButton onClick={() => handleSort('email')}>
                          Email
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <IconButton onClick={() => handleSort('phone')}>
                          Phone
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCustomers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}