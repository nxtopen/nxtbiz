"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, IconButton
} from '@mui/material';
import { MdSearch } from 'react-icons/md';

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ContactSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (contactId: string) => void;
}

const ContactSelector: React.FC<ContactSelectorProps> = ({ open, onClose, onSelect }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts');
        setContacts(response.data.contacts);
        setFilteredContacts(response.data.contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilteredContacts(
      contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select Contact</DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          size="small"
          InputProps={{
            endAdornment: (
              <IconButton>
                <MdSearch />
              </IconButton>
            ),
          }}
        />
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(contact._id)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactSelector;