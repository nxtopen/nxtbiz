"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const ViewContact = () => {
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
        } finally {
          setLoading(false);
        }
      };

      fetchContact();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!contact) return <div>Contact not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={() => router.push('/admin/contacts')}>
          <FaArrowLeft /> Back to List
        </Button>
        <Button variant="contained" color="primary" href={`/admin/contacts/${id}/edit`} style={{ marginRight: '10px' }}>Edit</Button>
      </Box><br/>
      <Typography variant="h4" gutterBottom>{contact.firstName} {contact.lastName}</Typography>
      <Typography variant="h6"><strong>Type:</strong> {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}</Typography>
      <Typography variant="h6"><strong>Email:</strong> {contact.email}</Typography>
      <Typography variant="h6"><strong>Phone:</strong> {contact.phone}</Typography>
      <Typography variant="h6"><strong>Address:</strong> {contact.address}</Typography>
    </div>
  );
};

export default ViewContact;