

import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllListDetails,
  getPlayListDetails,
  createPlayList,
  addProblemToPlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";
import express from "express";

const playlistRoutes = express.Router();

playlistRoutes.use(authMiddleware);

playlistRoutes.get("/", getAllListDetails);
playlistRoutes.get("/:playlistId", getPlayListDetails);
playlistRoutes.post("/create-playlist", createPlayList);
playlistRoutes.post("/:playlistId/add-problem",  addProblemToPlaylist);
playlistRoutes.delete("/:playlistId", deletePlaylist);
playlistRoutes.delete("/:playlistId/remove-problem",removeProblemFromPlaylist);

export default playlistRoutes;