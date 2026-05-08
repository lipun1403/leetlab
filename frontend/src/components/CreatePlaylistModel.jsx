// // import React from 'react'
// // import {useForm} from "react-hook-form";
// // import {X} from "lucide-react";
// // const CreatePlaylistModal = ({isOpen , onClose , onSubmit}) => {
// //     const {register , handleSubmit , formState:{errors} , reset} = useForm();

// //     const handleFormSubmit = async (data)=>{
// //         await onSubmit(data);
// //         reset()
// //         onClose()
// //     }

// //     if(!isOpen) return null;

// //   return (
// //    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
// //         <div className="flex justify-between items-center p-4 border-b border-base-300">
// //           <h3 className="text-xl font-bold">Create New Playlist</h3>
// //           <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
// //             <X className="w-5 h-5" />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
// //           <div className="form-control">
// //             <label className="label">
// //               <span className="label-text font-medium">Playlist Name</span>
// //             </label>
// //             <input
// //               type="text"
// //               className="input input-bordered w-full"
// //               placeholder="Enter playlist name"
// //               {...register('name', { required: 'Playlist name is required' })}
// //             />
// //             {errors.name && (
// //               <label className="label">
// //                 <span className="label-text-alt text-error">{errors.name.message}</span>
// //               </label>
// //             )}
// //           </div>

// //           <div className="form-control">
// //             <label className="label">
// //               <span className="label-text font-medium">Description</span>
// //             </label>
// //             <textarea
// //               className="textarea textarea-bordered h-24"
// //               placeholder="Enter playlist description"
// //               {...register('description')}
// //             />
// //           </div>

// //           <div className="flex justify-end gap-2 mt-6">
// //             <button type="button" onClick={onClose} className="btn btn-ghost">
// //               Cancel
// //             </button>
// //             <button type="submit" className="btn btn-primary">
// //               Create Playlist
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// // export default CreatePlaylistModal




// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { X } from "lucide-react";

// const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const [loading, setLoading] = useState(false);

//   const handleFormSubmit = async (data) => {
//     try {
//       setLoading(true);
//       await onSubmit(data); // backend call
//       reset();
//       onClose();
//     } catch (err) {
//       console.error("Create playlist failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     reset(); // ✅ clear form when closing
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={handleClose} // ✅ click outside to close
//     >
//       <div
//         className="bg-base-100 rounded-lg shadow-xl w-full max-w-md"
//         onClick={(e) => e.stopPropagation()} // ❗ prevent close on inside click
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-base-300">
//           <h3 className="text-xl font-bold">Create New Playlist</h3>
//           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          
//           {/* Name */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">Playlist Name</span>
//             </label>
//             <input
//               type="text"
//               className="input input-bordered w-full"
//               placeholder="Enter playlist name"
//               {...register("name", {
//                 required: "Playlist name is required",
//                 minLength: {
//                   value: 3,
//                   message: "Minimum 3 characters required",
//                 },
//               })}
//             />
//             {errors.name && (
//               <span className="text-error text-sm">
//                 {errors.name.message}
//               </span>
//             )}
//           </div>

//           {/* Description */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">Description</span>
//             </label>
//             <textarea
//               className="textarea textarea-bordered h-24"
//               placeholder="Enter playlist description"
//               {...register("description", {
//                 maxLength: {
//                   value: 200,
//                   message: "Max 200 characters allowed",
//                 },
//               })}
//             />
//             {errors.description && (
//               <span className="text-error text-sm">
//                 {errors.description.message}
//               </span>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-ghost"
//               disabled={loading}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create Playlist"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePlaylistModal;



import React from 'react'
import {useForm} from 'react-hook-form'
import {X} from 'lucide-react'

const CreatePlayListModel = ({isOpen, onClose, onSubmit})=>{
    const {register, handleSubmit, formState:{errors}, reset}=useForm();
    const handleFormSubmit= async (data) => {
        await onSubmit(data);
        reset();
        onClose();
        
    }
    if(!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h3 className="text-xl font-bold ml-2">Create New Playlist</h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-6 space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mb-2">
                  Playlist Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter playlist name"
                {...register("name", { required: "Playlist name is required" })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-2 mb-2">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 mb-2  w-full"
                placeholder="Enter playlist description"
                {...register("description")}
              />
            </div>

            <div className="flex justify-between gap-2 mt-8 ">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-outline"
              >
                Back
              </button>{" "}
              <div className="flex justify-end gap-2 ">
                {/* added reset button */}
                <button
                  type="button"
                  onClick={reset}
                  className="btn btn-ghost btn-outline"
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Playlist
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );


}

export default CreatePlayListModel;