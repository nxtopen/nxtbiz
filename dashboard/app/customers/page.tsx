// pages/customers.tsx

"use client";

import { Container, Grid, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Tooltip, Box } from "@mui/material";
import { useState } from "react";
import { orderBy } from 'lodash'; // lodash for sorting

// Mock data for customers (replace with actual data or fetch from API)
const customersData = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", phone: "555-555-5555" },
];

export default function CustomersPage() {
    const [customers, setCustomers] = useState(customersData);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleAddCustomer = () => {
        const newCustomer = {
            id: customers.length + 1,
            name: newCustomerName.trim(),
        };

        if (newCustomer.name) {
            setCustomers([...customers, newCustomer]);
            setNewCustomerName("");
        }
    };

    const handleSort = (property: keyof typeof customersData) => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
        const sortedCustomers = orderBy(customers, [property], [isAsc ? 'asc' : 'desc']);
        setCustomers(sortedCustomers);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Add Customer Form */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Add New Customer</Typography>
                        <TextField
                            label="Customer Name"
                            variant="outlined"
                            fullWidth
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCustomer}
                        >
                            Add Customer
                        </Button>
                    </Paper>
                </Grid>

                {/* Customer List */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Customers List</Typography>
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
                                    {customers
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
                            count={customers.length}
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