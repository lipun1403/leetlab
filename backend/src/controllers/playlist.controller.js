
import { prisma } from "../libs/prisma.ts";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const getAllListDetails = asyncHandler( async (req, res) => {
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
      throw new ApiError(404, "No playlist found for the user");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "All playlists fetched successfully",
        allList,
      )
    );
  
});

export const getPlayListDetails = asyncHandler( async (req, res) => {
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
      throw new ApiError(404, "No such playlist available");
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        "Playlist details retrieved successfully",
        playlist,
      )
    );
});

export const deletePlaylist = asyncHandler( async (req, res) => {
  const { playlistId } = req.params;
  const deleted_playlist = await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    if (!deleted_playlist) {
      throw new ApiError(404, "No such playlist available to delete");
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        "Playlist deleted successfully",
        deleted_playlist,
      )
    );
});

export const createPlayList = asyncHandler( async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });


    return res.status(200).json(
      new ApiResponse(
        200,
        "Playlist created successfully",
        playlist,
      )
    );
});

export const removeProblemFromPlaylist = asyncHandler( async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "Invalid or missing problemIds");
    }
 
  
    const deletedProblem = await prisma.problemInPlaylist.deleteMany({
      where: {
        playlistId: playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        "Problems removed from playlist successfully",
        deletedProblem,
      )
    );
  
});

export const addProblemToPlaylist = asyncHandler( async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body; 
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "Invalid or missing problemIds");
    }

    const problemsInPlaylist = await prisma.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });


    res.status(201).json(
      new ApiResponse(
        201,
        "Problems added to playlist successfully",
        problemsInPlaylist,
      )
    );
  
});