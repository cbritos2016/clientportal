const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');
const authMiddleware = require('../middleware/auth');
const cors = require('cors'); // Add CORS middleware

// Enable CORS for http://localhost:3000
router.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies if needed (optional)
}));

// Handle preflight OPTIONS requests
router.options('*', cors());

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ClientPortal');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM ClientPortal WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ClientID', sql.VarChar(5), req.body.ClientID)
      .input('ClientName', sql.VarChar(95), req.body.ClientName)
      .input('PortalName', sql.VarChar(100), req.body.PortalName)
      .input('PortalServerName', sql.VarChar(300), req.body.PortalServerName)
      .input('PortalUserName', sql.VarChar(50), req.body.PortalUserName)
      .input('PortalPassword', sql.VarChar(255), req.body.PortalPassword)
      .input('Remark', sql.VarChar(4000), req.body.Remark)
      .input('ModifiedDateTime', sql.DateTime, new Date(req.body.ModifiedDateTime))
      .input('IsActive', sql.Bit, req.body.IsActive)
      .query('INSERT INTO ClientPortal (ClientID, ClientName, PortalName, PortalServerName, PortalUserName, PortalPassword, Remark, ModifiedDateTime, IsActive) VALUES (@ClientID, @ClientName, @PortalName, @PortalServerName, @PortalUserName, @PortalPassword, @Remark, @ModifiedDateTime, @IsActive); SELECT SCOPE_IDENTITY() as id');
    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ message: 'Failed to create item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT id FROM ClientPortal WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('ClientID', sql.VarChar(5), req.body.ClientID)
      .input('ClientName', sql.VarChar(95), req.body.ClientName)
      .input('PortalName', sql.VarChar(100), req.body.PortalName)
      .input('PortalServerName', sql.VarChar(300), req.body.PortalServerName)
      .input('PortalUserName', sql.VarChar(50), req.body.PortalUserName)
      .input('PortalPassword', sql.VarChar(255), req.body.PortalPassword)
      .input('Remark', sql.VarChar(4000), req.body.Remark)
      .input('ModifiedDateTime', sql.DateTime, new Date(req.body.ModifiedDateTime))
      .input('IsActive', sql.Bit, req.body.IsActive)
      .query('UPDATE ClientPortal SET ClientID = @ClientID, ClientName = @ClientName, PortalName = @PortalName, PortalServerName = @PortalServerName, PortalUserName = @PortalUserName, PortalPassword = @PortalPassword, Remark = @Remark, ModifiedDateTime = @ModifiedDateTime, IsActive = @IsActive WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Failed to update item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT id FROM ClientPortal WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM ClientPortal WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

module.exports = router;