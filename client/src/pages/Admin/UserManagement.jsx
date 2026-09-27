import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchUsers, toggleUserStatusApi } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      await toggleUserStatusApi(id);
      toast.success("User status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto rounded-lg border border-pine-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-pine-100 text-xs uppercase text-ink/50">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-pine-50 last:border-0">
              <td className="p-4 font-medium text-ink">{u.name}</td>
              <td className="p-4 text-ink/70">{u.email}</td>
              <td className="p-4 capitalize text-ink/70">{u.role}</td>
              <td className="p-4">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${u.isActive ? "bg-pine-50 text-pine-500" : "bg-coral-50 text-coral-600"}`}>
                  {u.isActive ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="p-4 text-right">
                <button onClick={() => handleToggle(u._id)} className="text-pine-500 hover:underline">
                  {u.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
