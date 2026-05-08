// import asyncHandler from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { prisma } from "../lib/prisma.ts"

// const getAllListDetails = asyncHandler(async(req, res) => {
//     const userId = req.user.id

//     const details = await prisma.playlist.findMany({
//         where: {
//             userId
//         },
//         orderBy: {
//             createdAt: "desc"
//         },
//         select: {
//             id: true,
//             name: true,
//             description: true,
//             createdAt: true,
//             problems: {
//                 select: {
//                     problem: true
//                 }
//             }
//         }
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 details,
//                 "All playlists fetched successfully",
//             )
//         )
// })

// const createPlaylist = asyncHandler(async(req, res) => {
//     const { name, description } = req.body
//     const userId = req.user.id

//     if (!name || name.trim() === "") {
//         throw new ApiError(
//             400, 
//             "Playlist name is required"
//         )
//     }

//     const checkExist = await prisma.playlist.findUnique({
//         where: {
//             name_userId: {
//                 name,
//                 userId
//             }
//         }
//     })

//     if(checkExist) {
//         throw new ApiError(
//             400,
//             "Playlist already exists"
//         )
//     }

//     const playlist = await prisma.playlist.create({
//         data: {
//             name,
//             description,
//             userId
//         }
//     })

//     if(!playlist) {
//         throw new ApiError(
//             500,
//             "Can't create the playlist"
//         )
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 playlist,
//                 "Playlist created successfully",
//             )
//         )
// })

// const getPlaylistById = asyncHandler(async(req, res) => {
//     const { playlistId } = req.params
//     const userId = req.user.id

//     if(!playlistId) {
//         throw new ApiError(
//             400,
//             "Invalid playlist"
//         )
//     }

//     const playlist = await prisma.playlist.findUnique({
//         where: {
//             id: playlistId,
//             userId
//         },
//         select: {
//             name: true,
//             description: true,
//             createdAt: true,
//             problems: {
//                 select: {
//                     problem: {
//                         select: {
//                             id: true,
//                             title: true,
//                             difficulty: true
//                         }
//                     }
//                 }
//             }
//         }
//     })

//     if(!playlist) {
//         throw new ApiError(
//             500,
//             "Can't get the playlist"
//         )
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 playlist,
//                 "Playlist fetched successfully",
//             )
//         )
// })

// const addToPlaylist = asyncHandler(async(req, res) => {
//     const { playlistId } = req.params
//     const { problemIds } = req.body
//     const userId = req.user.id

//     if(!Array.isArray(problemIds) || problemIds.length === 0) {
//         throw new ApiError(
//             400,
//             "Invalid problems to add"
//         )
//     }

//     const playlist = await prisma.playlist.findFirst({
//         where: {
//             id: playlistId,
//             userId
//         }
//     })

//     if(!playlist) {
//         throw new ApiError(
//             400,
//             "Invalid playlist!"
//         )
//     }

//     const addedPlaylist = await prisma.problemInPlaylist.createMany({
//         data: problemIds.map((problemId) => ({
//             playlistId,
//             problemId
//         })),
//         skipDuplicates: true
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 addedPlaylist,
//                 "Problem(s) added successfully",
//             )
//         )
// })

// const removeFromPlaylist = asyncHandler(async(req, res) => {
//     const { playlistId } = req.params
//     const { problemIds } = req.body
//     const userId = req.user.id

//     if(!Array.isArray(problemIds) || problemIds.length === 0) {
//         throw new ApiError(
//             400,
//             "invalid problems to remove"
//         )
//     }

//     const playlist = await prisma.playlist.findFirst({
//         where: {
//             id: playlistId,
//             userId
//         }
//     })

//     if(!playlist) {
//         throw new ApiError(
//             400,
//             "Invalid playlist!"
//         )
//     }

//     const deletedPlaylist = await prisma.problemInPlaylist.deleteMany({
//         where: {
//             playlistId,
//             problemId: {
//                 in: problemIds
//             }
//         }
//     })

//     const remaining = await prisma.problemInPlaylist.count({
//         where: {
//             playlistId
//         }
//     });

//     if (remaining === 0) {
//         await prisma.playlist.delete({
//             where: {
//                 id: playlistId
//             }
//         });
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 deletedPlaylist,
//                 "Problem(s) removed successfully",
//             )
//         )
// })

// const deletePlaylist = asyncHandler(async(req, res) => {
//     const { playlistId } = req.params
//     const userId = req.user.id

//     const playlist = await prisma.playlist.findFirst({
//         where: {
//             id: playlistId,
//             userId
//         }
//     })

//     if(!playlist) {
//         throw new ApiError(
//             400,
//             "Invalid playlist!"
//         )
//     }

//     const deletedPlaylist = await prisma.playlist.delete({
//         where: {
//             id: playlistId
//         },
//         select: {
//             name: true,
//             description: true
//         }
//     })

    
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 deletedPlaylist,
//                 "Playlist deleted successfully",
//             )
//         )
// })

// export {
//     getAllListDetails,
//     createPlaylist, 
//     getPlaylistById, 
//     addToPlaylist,
//     removeFromPlaylist,
//     deletePlaylist
// }




import { prisma } from "../libs/prisma.ts";

export const getAllListDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const allList = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if(!allList){
      return res.status(404).json({
        success: false,
        message: "No playlist found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Every playlist for our user fetched successfully",
      allList,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error finding all the playlist for a user",
    });
  }
};

export const getPlayListDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await prisma.playlist.findMany({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
  

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "No such playlist available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Playlist details retrieved successfully",
      playlist,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Error retrieving playlist details",
      error,
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deleted_playlist = await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    if (!deleted_playlist) {
      return res.status(404).json({
        success: false,
        message: "No such playlist available to delete",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deleted_playlist,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Error deleting playlist",
    });
  }
};

export const createPlayList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });


    return res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Error creating playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Error finding problemIds",
      });
    }
 
  
    const deletedProblem = await prisma.problemInPlaylist.deleteMany({
      where: {
        playlistId: playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Problem(s) deleted from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error.message);
    res.status(500).json({ error: "Failed to remove problem from playlist" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body; // Accept an array of problem IDs

  try {
    // Ensure problemIds is an array
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    // Create records for each problem in the playlist
    const problemsInPlaylist = await prisma.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });


    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error.message);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};