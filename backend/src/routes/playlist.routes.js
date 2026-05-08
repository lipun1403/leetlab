// import express from "express";
// import { getAllListDetails,
//     createPlaylist, 
//     getPlaylistById, 
//     addToPlaylist,
//     removeFromPlaylist,
//     deletePlaylist } from "../controllers/playlist.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const playlistRoute = express.Router();

// playlistRoute.use(verifyJWT)

// playlistRoute.get("/", getAllListDetails)
// playlistRoute.post("/createPlaylist", createPlaylist);
// // playlistRoute.get("/getAllPlaylist", getAllPlaylists);
// playlistRoute.get("/:playlistId", getPlaylistById);
// playlistRoute.post("/:playlistId/addToPlaylist", addToPlaylist);
// playlistRoute.delete("/:playlistId/removeFromPlaylist", removeFromPlaylist);
// playlistRoute.delete("/:playlistId", deletePlaylist);

// export default playlistRoute;



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

playlistRoutes.get("/", authMiddleware, getAllListDetails);
playlistRoutes.get("/:playlistId", authMiddleware, getPlayListDetails);
playlistRoutes.post("/create-playlist", authMiddleware, createPlayList);
playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemToPlaylist
);
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);
playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRoutes;