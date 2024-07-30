"use client";

import { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import toast

const AddCustomer = () => {
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    type: 'customer' // Default type
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: any = {};
    if (!customer.firstName) newErrors.firstName = 'First name is required.';
    if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) newErrors.email = 'Invalid email address.';
    if (customer.phone && !/^\d{10}$/.test(customer.phone)) newErrors.phone = 'Phone must be a 10-digit number.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => toast.error(error)); // Show each error in toast
      return;
    }

    try {
      await axios.post('/api/contacts', customer);
      toast.success('Contact added successfully!');
      router.push('/admin/contacts');
    } catch (error) {
      toast.error('Error adding contact.');
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add Contact</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <TextField 
          label="First Name" 
          name="firstName" 
          value={customer.firstName} 
          onChange={handleChange} 
          fullWidth 
          error={!!errors.firstName} 
          helperText={errors.firstName}
        />
        <TextField 
          label="Last Name" 
          name="lastName" 
          value={customer.lastName} 
          onChange={handleChange} 
          fullWidth 
        />
        <TextField 
          label="Email" 
          name="email" 
          value={customer.email} 
          onChange={handleChange} 
          fullWidth 
          error={!!errors.email} 
          helperText={errors.email}
        />
        <TextField 
          label="Phone" 
          name="phone" 
          value={customer.phone} 
          onChange={handleChange} 
          fullWidth 
          error={!!errors.phone} 
          helperText={errors.phone}
        />
        <TextField 
          label="Address" 
          name="address" 
          value={customer.address} 
          onChange={handleChange} 
          fullWidth 
        />
        <Button type="submit" variant="contained" color="primary">Save</Button>
      </form>
    </div>
  );
};

export default AddCustomer;