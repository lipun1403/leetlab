import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/getAllProblems");
      console.log(res.data);
      
      set({ problems: res.data.data });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/getProblemById/${id}`);

      const data = res.data.data;

      // 🔥 convert array → object HERE (only once)
      const snippetsObj = {};
      (data.codeSnippets || []).forEach((item) => {
        const key = Object.keys(item)[0].toLowerCase();
        snippetsObj[key] = item[Object.keys(item)[0]];
      });

      set({
        problem: {
          ...data,
          codeSnippets: snippetsObj,
        },
      });

    } catch (error) {
      console.log("Error getting problem", error);
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/getAllSolvedProblem");

      console.log("Solved problems: ", res.data);
      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  }

  
}));