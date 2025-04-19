import Link from 'next/link';

export default function ItemList({ items, onDelete, currentPage }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete item with ID ${id}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/items/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        onDelete();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete the item. Please try again.');
      }
    }
  };

  return (
    <table className="item-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Client ID</th>
          <th>Client Name</th>
          <th>Portal Name</th>
          <th>Portal Server Name</th>
          <th>Portal Username</th>
          <th>Portal Password</th>
          <th>Remark</th>
          <th>Created</th>
          <th>Modified</th>
          <th>Is Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length > 0 ? (
          items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ClientID}</td>
              <td>{item.ClientName}</td>
              <td>{item.PortalName}</td>
              <td>{item.PortalServerName}</td>
              <td>{item.PortalUserName}</td>
              <td>{item.PortalPassword}</td>
              <td>{item.Remark}</td>
              <td>{new Date(item.CreatedDateTime).toLocaleString()}</td>
              <td>{new Date(item.ModifiedDateTime).toLocaleString()}</td>
              <td>{item.IsActive ? 'Yes' : 'No'}</td>
              <td>
                <Link href={`/edit/${item.id}?page=${currentPage}`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="12">No items found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}