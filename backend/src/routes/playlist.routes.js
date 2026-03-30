import express from "express";
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, addToPlaylist, removeFromPlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRoute = express.Router();

playlistRoute.use(verifyJWT)

playlistRoute.post("/createPlaylist", createPlaylist);
playlistRoute.get("/getAllPlaylist", getAllPlaylists);
playlistRoute.get("/getPlaylistById:id", getPlaylistById);
playlistRoute.put("/addToPlaylist:id", addToPlaylist);
playlistRoute.put("/removeFromPlaylist:id", removeFromPlaylist);
playlistRoute.delete("/deletePlaylist:id", deletePlaylist);

export default playlistRoute;