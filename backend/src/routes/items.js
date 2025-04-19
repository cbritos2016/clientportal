const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ClientPortal');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM ClientPortal WHERE id = @id');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
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
      .query('INSERT INTO ClientPortal (ClientID, ClientName, PortalName, PortalServerName, PortalUserName, PortalPassword, Remark, IsActive) VALUES (@ClientID, @ClientName, @PortalName, @PortalServerName, @PortalUserName, @PortalPassword, @Remark, @IsActive); SELECT SCOPE_IDENTITY() as id');
    res.json({ id: result.recordset[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
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
    res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM ClientPortal WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;