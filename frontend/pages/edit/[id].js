import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

export default function EditItem() {
  const [formData, setFormData] = useState({
    id: '',
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
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && typeof window !== 'undefined') {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched item data:', data); // Debug log

      // Convert CreatedDateTime to EST, handle null/invalid values
      const formattedCreatedDate = data.CreatedDateTime && !isNaN(new Date(data.CreatedDateTime).getTime())
        ? DateTime.fromISO(data.CreatedDateTime).setZone('America/New_York').toFormat("yyyy-MM-dd'T'HH:mm")
        : '';
      // Set ModifiedDateTime to current EST
      const currentModifiedDate = DateTime.now().setZone('America/New_York').toFormat("yyyy-MM-dd'T'HH:mm");

      setFormData({
        id: data.id || '',
        ClientID: data.ClientID || '',
        ClientName: data.ClientName || '',
        PortalName: data.PortalName || '',
        PortalServerName: data.PortalServerName || '',
        PortalUserName: data.PortalUserName || '',
        PortalPassword: data.PortalPassword || '',
        Remark: data.Remark || '',
        CreatedDateTime: formattedCreatedDate,
        ModifiedDateTime: currentModifiedDate,
        IsActive: data.IsActive ?? true // Fallback to true if undefined
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    try {
      const formattedCreatedDateTime = formData.CreatedDateTime
        ? DateTime.fromFormat(formData.CreatedDateTime, "yyyy-MM-dd'T'HH:mm", { zone: 'America/New_York' }).toUTC().toISO()
        : null;
      const formattedModifiedDateTime = DateTime.fromFormat(formData.ModifiedDateTime, "yyyy-MM-dd'T'HH:mm", { zone: 'America/New_York' }).toUTC().toISO();
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'PUT',
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

      // Redirect to index with saved page number
      const page = router.query.page || '1';
      router.push(`/?page=${page}`);
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item. Please try again.');
    }
  };

  const handleCancel = () => {
    // Redirect to index with saved page number
    const page = router.query.page || '1';
    router.push(`/?page=${page}`);
  };

  return (
    <div className="container">
      <h1>Edit Item</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>ID</label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="disabled-input"
          />
        </div>
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
          <button type="submit" className="submit-button">Update Item</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}