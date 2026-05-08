// import React from "react";
// import { useAuthStore } from "../store/useAuthStore.js";
// import { Loader } from "lucide-react";

// const ProfilePage = () => {
//   const { authUser, isCheckingAuth } = useAuthStore();

//   // 🔄 Loading state
//   if (isCheckingAuth) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );
//   }

//   // ❌ No user
//   if (!authUser) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-lg text-gray-500">No user data found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen px-4 py-10 flex justify-center">
//       <div className="w-full max-w-4xl bg-base-200 shadow-xl rounded-2xl p-6">

//         {/* 👤 Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
//             {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">{authUser?.name}</h1>
//             <p className="text-gray-500">{authUser?.email}</p>
//             <span className="badge badge-outline mt-1">
//               {authUser?.role}
//             </span>
//           </div>
//         </div>

//         {/* 📊 Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//           <div className="p-4 rounded-xl bg-base-300 text-center">
//             <p className="text-lg font-bold">
//               {Array.isArray(authUser?.problemsSolved) ? authUser.problemsSolved.length : 0}
//             </p>
//             <p className="text-sm text-gray-500">Problems Solved</p>
//           </div>

//           <div className="p-4 rounded-xl bg-base-300 text-center">
//             <p className="text-lg font-bold">
//               {Array.isArray(authUser?.submissions) ? authUser.submissions.length : 0}
//             </p>
//             <p className="text-sm text-gray-500">Submissions</p>
//           </div>

//           <div className="p-4 rounded-xl bg-base-300 text-center">
//             <p className="text-lg font-bold">
//               {Array.isArray(authUser?.playlists) ? authUser.playlists.length : 0}
//             </p>
//             <p className="text-sm text-gray-500">Playlists</p>
//           </div>
//         </div>

//         {/* 📚 Playlists */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-3">Playlists</h2>

//           {Array.isArray(authUser?.playlists) && authUser.playlists.length > 0 ? (
//             <div className="grid md:grid-cols-2 gap-4">
//               {authUser.playlists.map((playlist) => (
//                 <div
//                   key={playlist.id}
//                   className="p-4 rounded-xl bg-base-300 shadow"
//                 >
//                   <h3 className="font-semibold">{playlist.name}</h3>
//                   <p className="text-sm text-gray-500">
//                     {Array.isArray(playlist.problems) ? playlist.problems.length : 0} problems
//                   </p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No playlists yet</p>
//           )}
//         </div>

//         {/* 🧾 Recent Submissions */}
//         <div>
//           <h2 className="text-xl font-semibold mb-3">Recent Submissions</h2>

//           {Array.isArray(authUser?.submissions) && authUser.submissions.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="table table-zebra">
//                 <thead>
//                   <tr>
//                     <th>Problem</th>
//                     <th>Status</th>
//                     <th>Language</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {authUser.submissions.slice(0, 5).map((sub) => (
//                     <tr key={sub.id}>
//                       <td>{sub.problem?.title || "Unknown"}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             sub.status === "Accepted"
//                               ? "badge-success"
//                               : "badge-error"
//                           }`}
//                         >
//                           {sub.status}
//                         </span>
//                       </td>
//                       <td>{sub.language}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No submissions yet</p>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfilePage;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  Shield,
  Image,
  EyeOff,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import ChangePasswordPopup from "../components/ChangePasswordPopup";

import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";
import EditProfile from "../components/EditProfile";
import Footer from "../components/Footer";

const Profile = () => {
  const { authUser, forgotPassword, resetSuccessfully, changeRoleProfile } =
    useAuthStore();
  const { submissions, getAllSubmissions } = useSubmissionStore();
  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const handleChangePassword = async (data) => {
    await forgotPassword(data);
  };
  const handleEditProfile = async (data) => {
    await changeRoleProfile(data);
  };
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center pt-10 px-4 md:px-8 w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                  {authUser.image ? (
                    <img
                      src={authUser?.image || "../../man.png"}
                      alt="avatar"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl p-2 text-center">
                      {authUser.name ? authUser.name.charAt(0) : "U"}
                    </span>
                  )}
                </div>
              </div>

              {/* Name and Role Badge */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
                <div className="badge badge-primary mt-2">{authUser.role}</div>
              </div>
            </div>

            <div className="divider"></div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="stat-title">Email</div>
                <div className="stat-value text-lg break-all">
                  {authUser.email}
                </div>
              </div>
              {/* User ID */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary gap-2 flex flex-row">
                  <button
                    className=" ml-2 text-primary/80 hover:text-primary-focus  cursor-pointer"
                    onClick={() => setIsHidden(!isHidden)}
                    aria-label="Toggle User ID visibility"
                  >
                    {isHidden ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title flex items-center gap-2">
                  User ID
                </div>
                <div className="pt-2 stat-value text-sm break-all">
                  {isHidden ? "********************************" : authUser.id}
                </div>
              </div>

              {/* Role Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="stat-title">Role</div>
                <div className="stat-value text-lg">{authUser.role}</div>
                <div className="stat-desc">
                  {authUser.role === "ADMIN"
                    ? "Full system access"
                    : "Limited access"}
                </div>
              </div>
              {/* Profile Image Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Image className="w-8 h-8" />
                </div>
                <div className="stat-title">Profile Image</div>
                <div className="stat-value text-lg">
                  {authUser.image ? "Uploaded" : "Not Set"}
                </div>
                <div className="stat-desc">
                  {authUser.image
                    ? "Image available"
                    : "Upload a profile picture"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </button>
              <EditProfile
                isOpen={isEditProfileOpen} //value of clicked button
                onClose={() => setIsEditProfileOpen(false)}
                onSubmit={handleEditProfile} //sending data to backend
              />
              <button
                className="btn btn-primary"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change Password
              </button>
              <ChangePasswordPopup
                isOpen={isChangePasswordOpen} //value of clicked button
                onClose={() => setIsChangePasswordOpen(false)}
                onSubmit={handleChangePassword} //sending data to backend
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full mx-auto">
        <div className="bg-base-200 p-4 ">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mt-6  mb-4">
              <h3 className="text-2xl font-bold text-primary/90 mb-4 pl-4 md:mb-0">
                Total Submissions
              </h3>
              <Link
                to={`/submissions`}
                className="btn btn-sm btn-outline btn-primary mr-1"
              >
                <ExternalLink size={14} className="mr-1" />
                View All Submissions
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3  max-w-4xl mx-auto  mb-6 px-4">
            <div className="stat bg-base-100 shadow rounded">
              <div className="stat-title">Total</div>
              <div className="stat-value">{submissions?.length}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded">
              <div className="stat-title">Accepted</div>
              <div className="stat-value text-success">
                {submissions?.filter((s) => s.status === "Accepted").length}
              </div>
            </div>
            <div className="stat bg-base-100 shadow rounded">
              <div className="stat-title">Failed</div>
              <div className="stat-value text-error">
                {submissions?.length -
                  submissions?.filter((s) => s.status === "Accepted").length}
              </div>
            </div>
          </div>

          <ProblemSolvedByUser />

          {!resetSuccessfully && <PlaylistProfile />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;