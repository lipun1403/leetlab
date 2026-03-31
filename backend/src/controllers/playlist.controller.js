import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.ts"

const getAllListDetails = asyncHandler(async(req, res) => {
    const userId = req.user.id

    const details = await prisma.playlist.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            problems: {
                select: {
                    problem: true
                }
            }
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "All playlists fetched successfully",
                details
            )
        )
})

const createPlaylist = asyncHandler(async(req, res) => {
    const { name, description } = req.body
    const userId = req.user.id

    if (!name || name.trim() === "") {
        throw new ApiError(
            400, 
            "Playlist name is required"
        )
    }

    const checkExist = await prisma.playlist.findUnique({
        where: {
            name_userId: {
                name,
                userId
            }
        }
    })

    if(checkExist) {
        throw new ApiError(
            400,
            "Playlist already exists"
        )
    }

    const playlist = await prisma.playlist.create({
        data: {
            name,
            description,
            userId
        }
    })

    if(!playlist) {
        throw new ApiError(
            500,
            "Can't create the playlist"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Playlist created successfully",
                playlist
            )
        )
})

const getPlaylistById = asyncHandler(async(req, res) => {
    const { playlistId } = req.params
    const userId = req.user.id

    if(!playlistId) {
        throw new ApiError(
            400,
            "Invalid playlist"
        )
    }

    const playlist = await prisma.playlist.findUnique({
        where: {
            id: playlistId,
            userId
        },
        select: {
            name: true,
            description: true,
            createdAt: true,
            problems: {
                select: {
                    problem: {
                        select: {
                            id: true,
                            title: true,
                            difficulty: true
                        }
                    }
                }
            }
        }
    })

    if(!playlist) {
        throw new ApiError(
            500,
            "Can't get the playlist"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Playlist fetched successfully",
                playlist
            )
        )
})

const addToPlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params
    const { problemIds } = req.body
    const userId = req.user.id

    if(!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(
            400,
            "Invalid problems to add"
        )
    }

    const playlist = await prisma.playlist.findFirst({
        where: {
            id: playlistId,
            userId
        }
    })

    if(!playlist) {
        throw new ApiError(
            400,
            "Invalid playlist!"
        )
    }

    const addedPlaylist = await prisma.problemInPlaylist.createMany({
        data: problemIds.map((problemId) => ({
            playlistId,
            problemId
        })),
        skipDuplicates: true
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Problem(s) added successfully",
                addedPlaylist
            )
        )
})

const removeFromPlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params
    const { problemIds } = req.body
    const userId = req.user.id

    if(!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(
            400,
            "invalid problems to remove"
        )
    }

    const playlist = await prisma.playlist.findFirst({
        where: {
            id: playlistId,
            userId
        }
    })

    if(!playlist) {
        throw new ApiError(
            400,
            "Invalid playlist!"
        )
    }

    const deletedPlaylist = await prisma.problemInPlaylist.deleteMany({
        where: {
            playlistId,
            problemId: {
                in: problemIds
            }
        }
    })

    const remaining = await prisma.problemInPlaylist.count({
        where: {
            playlistId
        }
    });

    if (remaining === 0) {
        await prisma.playlist.delete({
            where: {
                id: playlistId
            }
        });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Problem(s) removed successfully",
                deletedPlaylist
            )
        )
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params
    const userId = req.user.id

    const playlist = await prisma.playlist.findFirst({
        where: {
            id: playlistId,
            userId
        }
    })

    if(!playlist) {
        throw new ApiError(
            400,
            "Invalid playlist!"
        )
    }

    const deletedPlaylist = await prisma.playlist.delete({
        where: {
            id: playlistId
        },
        select: {
            name: true,
            description: true
        }
    })

    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Playlist deleted successfully",
                deletedPlaylist
            )
        )
})

export {
    getAllListDetails,
    createPlaylist, 
    getPlaylistById, 
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
}