import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loader } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // 🔄 Loading state
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // ❌ No user
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-base-200 shadow-xl rounded-2xl p-6">

        {/* 👤 Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{authUser?.name}</h1>
            <p className="text-gray-500">{authUser?.email}</p>
            <span className="badge badge-outline mt-1">
              {authUser?.role}
            </span>
          </div>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-base-300 text-center">
            <p className="text-lg font-bold">
              {Array.isArray(authUser?.problemsSolved) ? authUser.problemsSolved.length : 0}
            </p>
            <p className="text-sm text-gray-500">Problems Solved</p>
          </div>

          <div className="p-4 rounded-xl bg-base-300 text-center">
            <p className="text-lg font-bold">
              {Array.isArray(authUser?.submissions) ? authUser.submissions.length : 0}
            </p>
            <p className="text-sm text-gray-500">Submissions</p>
          </div>

          <div className="p-4 rounded-xl bg-base-300 text-center">
            <p className="text-lg font-bold">
              {Array.isArray(authUser?.playlists) ? authUser.playlists.length : 0}
            </p>
            <p className="text-sm text-gray-500">Playlists</p>
          </div>
        </div>

        {/* 📚 Playlists */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Playlists</h2>

          {Array.isArray(authUser?.playlists) && authUser.playlists.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {authUser.playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="p-4 rounded-xl bg-base-300 shadow"
                >
                  <h3 className="font-semibold">{playlist.name}</h3>
                  <p className="text-sm text-gray-500">
                    {Array.isArray(playlist.problems) ? playlist.problems.length : 0} problems
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No playlists yet</p>
          )}
        </div>

        {/* 🧾 Recent Submissions */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Submissions</h2>

          {Array.isArray(authUser?.submissions) && authUser.submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Language</th>
                  </tr>
                </thead>
                <tbody>
                  {authUser.submissions.slice(0, 5).map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.problem?.title || "Unknown"}</td>
                      <td>
                        <span
                          className={`badge ${
                            sub.status === "Accepted"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td>{sub.language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No submissions yet</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;