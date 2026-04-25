import useUsers from "../../hooks/useUsers";

/**
 * Component mẫu minh hoạ mô hình service-layer.
 * Không import axios — toàn bộ logic API nằm trong useUsers → userService → axiosClient.
 */
export default function UserList() {
  const { users, loading, error, refetch, deleteUser } = useUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600 font-medium">Lỗi: {error}</p>
        <button
          onClick={refetch}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500">
        Không tìm thấy người dùng nào.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-neutral-900">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>

          <button
            onClick={() => deleteUser(user.id)}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
          >
            Xoá
          </button>
        </div>
      ))}
    </div>
  );
}
