"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

const EditContact = () => {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/contacts/${id}`);
          setContact(response.data);
        } catch (error) {
          console.error('Error fetching contact:', error);
          toast.error('Error fetching contact.');
        } finally {
          setLoading(false);
        }
      };

      fetchContact();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setContact({ ...contact, [name]: value });
  };

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setContact({ ...contact, type: e.target.value as string });
  };

  const validateForm = () => {
    let valid = true;

    if (!contact.firstName) {
      toast.error('First Name is required.');
      valid = false;
    }
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
      toast.error('Email must be valid.');
      valid = false;
    }
    if (contact.phone && typeof contact.phone !== 'string') {
      toast.error('Phone must be a string.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`/api/contacts/${id}`, contact);
      toast.success('Contact updated successfully!');
      // Stay on the current page, no navigation needed
    } catch (error) {
      toast.error('Error updating contact.');
      console.error('Error updating contact:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!contact) return <div>Contact not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Edit Contact</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select value={contact.type} onChange={handleTypeChange} name="type">
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="lead">Lead</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="First Name"
          name="firstName"
          value={contact.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={contact.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={contact.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Save</Button>
      </form>
    </div>
  );
};

export default EditContact;