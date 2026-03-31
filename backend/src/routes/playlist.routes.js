import express from "express";
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, addToPlaylist, removeFromPlaylist, getAllListDetails } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRoute = express.Router();

playlistRoute.use(verifyJWT)

playlistRoute.get("/", getAllListDetails)
playlistRoute.post("/createPlaylist", createPlaylist);
// playlistRoute.get("/getAllPlaylist", getAllPlaylists);
playlistRoute.get("/:playlistId", getPlaylistById);
playlistRoute.post("/:playlistId/addToPlaylist", addToPlaylist);
playlistRoute.delete("/:playlistId/removeFromPlaylist", removeFromPlaylist);
playlistRoute.delete("/:playlistId", deletePlaylist);

export default playlistRoute;