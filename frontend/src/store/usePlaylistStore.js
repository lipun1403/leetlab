// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";

// export const usePlaylistStore = create((set, get) => ({
//   playlists: [],
//   currentPlaylist: null,
//   isLoading: false,
//   error: null,

//   createPlaylist: async (playlistData) => {
//     try {
//       set({ isLoading: true });
//       const response = await axiosInstance.post(
//         "/playlist/createPlaylist",
//         playlistData
//       );

//       set((state) => ({
//         playlists: [...state.playlists, response.data.playList],
//       }));

//       toast.success("Playlist created successfully");
//       return response.data.playList;
//     } catch (error) {
//       console.error("Error creating playlist:", error);
//       toast.error(error.response?.data?.error || "Failed to create playlist");
//       throw error;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   getAllPlaylists: async () => {
//     try {
//       set({ isLoading: true });
//       const response = await axiosInstance.get("/playlist");
//       console.log("All playlists: ", response.data);
      
//       set({ playlists: response.data.data });
//     } catch (error) {
//       console.error("Error fetching playlists:", error);
//       toast.error("Failed to fetch playlists");
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   getPlaylistDetails: async (playlistId) => {
//     try {
//       set({ isLoading: true });
//       const response = await axiosInstance.get(`/playlist/${playlistId}`);
//       set({ currentPlaylist: response.data.playList });
//     } catch (error) {
//       console.error("Error fetching playlist details:", error);
//       toast.error("Failed to fetch playlist details");
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   addProblemToPlaylist: async (playlistId, problemIds) => {
//     try {
//       set({ isLoading: true });
//       await axiosInstance.post(`/playlist/${playlistId}/addToPlaylist`, {
//         problemIds,
//       });

//       toast.success("Problem added to playlist");

//       // Refresh the playlist details
//       if (get().currentPlaylist?.id === playlistId) {
//         await get().getPlaylistDetails(playlistId);
//       }
//     } catch (error) {
//       console.error("Error adding problem to playlist:", error);
//       toast.error("Failed to add problem to playlist");
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   removeProblemFromPlaylist: async (playlistId, problemIds) => {
//     try {
//       set({ isLoading: true });
//       await axiosInstance.post(`/playlist/${playlistId}/removeFromPlaylist
//         `, {
//         problemIds,
//       });

//       toast.success("Problem removed from playlist");

//       // Refresh the playlist details
//       if (get().currentPlaylist?.id === playlistId) {
//         await get().getPlaylistDetails(playlistId);
//       }
//     } catch (error) {
//       console.error("Error removing problem from playlist:", error);
//       toast.error("Failed to remove problem from playlist");
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   deletePlaylist: async (playlistId) => {
//     try {
//       set({ isLoading: true });
//       await axiosInstance.delete(`/playlist/${playlistId}`);

//       set((state) => ({
//         playlists: state.playlists.filter((p) => p.id !== playlistId),
//       }));

//       toast.success("Playlist deleted successfully");
//     } catch (error) {
//       console.error("Error deleting playlist:", error);
//       toast.error("Failed to delete playlist");
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));











import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const usePlayListStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlayList: async (playListData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post(
        "/playlist/create-playlist",
        playListData,
        {
          withCredentials: true,
        }
      );
      
    
      set((state) => ({
        playlists: [...state.playlists, response.data.playlist],
      }));
      toast.success("Playlist created successfully");
      return response.data.playlist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(error.response?.data?.error || "Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlayLists: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/playlist", {
        withCredentials: true,
      });

      set({ playlists: response.data.allList });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },
  getPlayListDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/playlist/${playlistId}`, {
        withCredentials: true,
      });
      set({ currentPlaylist: response.data.allList });
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error("Failed to fetch playlist details");
    } finally {
      set({ isLoading: false });
    }
  },
  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
       await axiosInstance.post(
         `/playlist/${playlistId}/add-problem`,
         { problemIds },
         {
           withCredentials: true,
         }
       );
      toast.success("Problem added to playlist");
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error adding problem to playlist:", error);
      toast.error("Failed to add problem to playlist");
    } finally {
      set({ isLoading: false });
    }
  },
  removeProblemFromPlaylist: async (playlistId, problemIds) => {
      try {
        set({isLoading:true})
        await axiosInstance.post(
          `/playlist/${playlistId}/remove-problem`,
          { problemIds },
          {
            withCredentials: true,
          }
        );
        
      toast.success("Problem removed from playlist");

      // Refresh the playlist details
      if (get().currentPlaylist?.id === playlistId) {

        // get() is used inside state functions to retrieve the current state values. - get() retrieves the current state object.
        await get().getPlaylistDetails(playlistId);

      }
      } catch (error) {
        console.error("Error removing problem from playlist:", error);
        toast.error("Failed to remove problem from playlist");
      }
      finally{        
        set({ isLoading: false });
      }
  },

  deletePlaylist : async (playlistId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/playlist/${playlistId}`, {
        withCredentials: true,
      });
      set((state)=>({
        playlists:state.playlists.filter((p)=>
            p.id !==playlistId
        ),
      }))
      
      toast.success("Playlist deleted successfully");
    } catch (error) {
        console.error("Error deleting playlist:", error);
        toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  }
}));