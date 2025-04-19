import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

export default function AddItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ClientID: '',
    ClientName: '',
    PortalName: '',
    PortalServerName: '',
    PortalUserName: '',
    PortalPassword: '',
    Remark: '',
    CreatedDateTime: '',
    ModifiedDateTime: '',
    IsActive: true
  });
  const [error, setError] = useState(null);

  // Set CreatedDateTime and ModifiedDateTime to current EST on mount
  useEffect(() => {
    const currentEST = DateTime.now().setZone('America/New_York').toFormat("yyyy-MM-dd'T'HH:mm");
    setFormData((prev) => ({
      ...prev,
      CreatedDateTime: currentEST,
      ModifiedDateTime: currentEST
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    try {
      // Convert EST to UTC ISO for API
      const formattedCreatedDateTime = DateTime.fromFormat(formData.CreatedDateTime, "yyyy-MM-dd'T'HH:mm", { zone: 'America/New_York' }).toUTC().toISO();
      const formattedModifiedDateTime = DateTime.fromFormat(formData.ModifiedDateTime, "yyyy-MM-dd'T'HH:mm", { zone: 'America/New_York' }).toUTC().toISO();
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ClientID: formData.ClientID,
          ClientName: formData.ClientName,
          PortalName: formData.PortalName,
          PortalServerName: formData.PortalServerName,
          PortalUserName: formData.PortalUserName,
          PortalPassword: formData.PortalPassword,
          Remark: formData.Remark,
          CreatedDateTime: formattedCreatedDateTime,
          ModifiedDateTime: formattedModifiedDateTime,
          IsActive: formData.IsActive
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      router.push('/');
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="container">
      <h1>Add New Item</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Client ID</label>
          <input
            type="text"
            value={formData.ClientID}
            onChange={(e) => setFormData((prev) => ({ ...prev, ClientID: e.target.value }))}
            maxLength="5"
            required
          />
        </div>
        <div className="form-group">
          <label>Client Name</label>
          <textarea
            value={formData.ClientName}
            onChange={(e) => setFormData((prev) => ({ ...prev, ClientName: e.target.value }))}
            maxLength="95"
          />
        </div>
        <div className="form-group">
          <label>Portal Name</label>
          <input
            type="text"
            value={formData.PortalName}
            onChange={(e) => setFormData((prev) => ({ ...prev, PortalName: e.target.value }))}
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label>Portal Server Name</label>
          <input
            type="text"
            value={formData.PortalServerName}
            onChange={(e) => setFormData((prev) => ({ ...prev, PortalServerName: e.target.value }))}
            maxLength="300"
          />
        </div>
        <div className="form-group">
          <label>Portal Username</label>
          <input
            type="text"
            value={formData.PortalUserName}
            onChange={(e) => setFormData((prev) => ({ ...prev, PortalUserName: e.target.value }))}
            maxLength="50"
          />
        </div>
        <div className="form-group">
          <label>Portal Password</label>
          <input
            type="password"
            value={formData.PortalPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, PortalPassword: e.target.value }))}
            maxLength="255"
          />
        </div>
        <div className="form-group">
          <label>Remark</label>
          <textarea
            value={formData.Remark}
            onChange={(e) => setFormData((prev) => ({ ...prev, Remark: e.target.value }))}
            maxLength="4000"
            rows="5"
            className="large-textarea"
          />
        </div>
        <div className="form-group">
          <label>Created Date/Time</label>
          <input
            type="datetime-local"
            value={formData.CreatedDateTime}
            disabled
            className="disabled-input"
          />
        </div>
        <div className="form-group">
          <label>Modified Date/Time</label>
          <input
            type="datetime-local"
            value={formData.ModifiedDateTime}
            disabled
            className="disabled-input"
          />
        </div>
        <div className="form-group">
          <label>Is Active</label>
          <input
            type="checkbox"
            checked={formData.IsActive}
            onChange={(e) => setFormData((prev) => ({ ...prev, IsActive: e.target.checked }))}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Add Item</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}