const express = require('express');
const authRouter = require('./routes/auth'); // Adjust path as necessary

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});