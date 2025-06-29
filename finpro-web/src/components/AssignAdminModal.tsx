import { useState, useEffect } from 'react';
import axios from 'axios';


interface iAdmin {
  id: string;
  email: string;
  firstName: string;
}

export default function AssignAdminModal({ storeId, onClose }: { storeId: string, onClose: () => void }) {
  const [admins, setAdmins] = useState<iAdmin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await axios.get('/api/stores/admins');
      setAdmins(res.data);
    };
    fetchAdmins();
  }, []);

  const handleAssign = async () => {
    try {
      await axios.post('/api/stores/assign-admin', {
        adminId: selectedAdmin,
        storeId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Admin berhasil ditugaskan!');
      onClose();
    } catch (error) {
      console.error('Gagal menugaskan admin', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-green-800 mb-4">Tugaskan Admin</h2>
        
        <select
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Pilih Admin</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.email} ({admin.firstName})
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Batal
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAdmin}
            className={`px-4 py-2 rounded ${selectedAdmin ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}