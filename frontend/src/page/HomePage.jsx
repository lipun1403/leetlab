import { useEffect, useState, useMemo, useCallback } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Rocket, Loader } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const ProblemTable = lazy(() => import("../components/ProblemTable.jsx"));

const HomePage = () => {
  const {
    getAllProblems,
    problems,
    isProblemsLoading,
    getSolvedProblemByUser,
    totalSolvedProblems,
  } = useProblemStore();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [selectedCompany, setSelectedCompany] = useState("");
  const filteredProblems = useMemo(() => {
    if (!selectedCompany) return problems;
    return problems.filter((p) => p.companyTags?.includes(selectedCompany));
  }, [selectedCompany, problems]);

  const handleCompanySelect = useCallback((company) => {
    setSelectedCompany(company);
  }, []);

  // useEffect(() => {
  //   getSolvedProblemByUser();
  // }, [getSolvedProblemByUser]);

  // useEffect(() => {
  //   if(problems.length===0)
  //     getAllProblems();
  // }, [getAllProblems]);
  useEffect(() => {
    const timer = setTimeout(() => {
      getSolvedProblemByUser();
      getAllProblems();
    }, 300); // delay API calls by 300ms
    return () => clearTimeout(timer);
  }, []);

  const handleRecommendedproblems = useCallback(
    (problemId) => navigate(`/problem/${problemId}`),
    [navigate],
  );

  useEffect(() => {
    const handleRefreshHome = () => {
      setSelectedCompany("");
    };
    window.addEventListener("refreshProblems", handleRefreshHome);
    return () =>
      window.removeEventListener("refreshProblems", handleRefreshHome);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-row gap-6 ">
      {/* Main Content Section */}
      <div className="flex flex-col items-center  w-full">
        <section className="flex flex-col items-center justify-center w-full min-h-[60px] py-8 px-4 bg-gradient-to-b from-base-200 via-base-300 to-base-200">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-base-content mb-4">
              LeetLab welcomes{" "}
              <span className="text-indigo-400">{authUser?.name || "You"}</span>
              !
            </h1>
            <p className="text-lg text-base-content/70  max-w-xl mx-auto leading-relaxed">
              A beginner-friendly, LeetCode-inspired platform for sharpening
              your problem-solving skills and acing technical interviews.
            </p>
          </div>
        </section>
        <div className="flex w-full min-h-screen">
          <div className="flex-1  w-full  min-w-6xl">
            {isProblemsLoading ? (
              <div className="flex items-center  justify-center text-gray-300 text-center ">
                <p className="text-gray-300 mt-30">Loading problems </p>
                <Loader className="text-gray-300 mt-30 max-h-[200px] items-center size-6 animate-spin" />
              </div>
            ) : problems.length > 0 ? (
              <div className="flex items-center justify-center">
                <Suspense
                  fallback={
                    <>
                      <p className="text-gray-300 mt-30 gap-3">
                        Loading problems{" "}
                      </p>
                      <Loader className="text-gray-300 mt-30 max-h-[200px] items-center size-6 animate-spin" />
                    </>
                  }
                >
                  <ProblemTable
                    problems={filteredProblems}
                    sidebarCompany={selectedCompany}
                  />
                </Suspense>
              </div>
            ) : (
              <p className="mt-10 text-center text-lg font-semibold text-gray-500 border border-primary px-4 py-2 rounded-sm border-dashed">
                No problems found
              </p>
            )}
          </div>

          {/* Right: Sidebar Section */}
          <aside className="w-64 bg-primary/20 p-6 shadow-md overflow-y-auto ">
            <div className="flex flex-col rounded-lg shadow-md bg-primary/30 items-center">
              <h3 className="text-xl font-semibold mt-2 text-center mb-4 text-white">
                Progress Overview
              </h3>

              <div
                className="radial-progress w-[88px] h-[88px] shadow-lg text-xl font-bold text-primary bg-white p-4 rounded-full border-4 border-gray-200"
                style={{
                  "--value": Math.round(
                    (totalSolvedProblems / problems.length) * 100,
                  ),
                  "--thickness": "6px",
                }}
                aria-valuenow={problems.length}
                role="progressbar"
              >
                {Math.round((totalSolvedProblems / problems.length) * 100)}%
              </div>

              <p className="text-gray-300 mt-3 mb-2 text-center text-sm">
                {totalSolvedProblems} out of {problems.length} problems solved
              </p>
            </div>

            <div className="p-4 rounded-lg shadow-md bg-primary/30 text-white mt-4">
              <h2 className="text-sm font-bold mb-2">
                <span className="mr-1">📌</span>FAANG Recommended
              </h2>
              <ul>
                {problems.slice(0, 3).map((problem) => (
                  <li key={problem.id}>
                    <span
                      className="hover:underline-offset-2 cursor-pointer text-gray-200"
                      onClick={() => handleRecommendedproblems(problem.id)}
                    >
                      📝 {problem.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg shadow-md bg-primary/30 text-white mt-4 flex flex-col">
              <h2 className="text-lg font-semibold mb-1">
                🏢 Top Companies Tags
              </h2>
              <div className="space-y-2">
                {[
                  "Amazon",
                  "Meta",
                  "Google",
                  "Microsoft",
                  "Apple",
                  "LinkedIn",
                  "Tesla",
                  "Adobe",
                  "Uber",
                  "Patanjali",
                ].map((company) => (
                  <p
                    key={company}
                    className={`flex items-center gap-2 cursor-pointer hover:text-primary ${
                      selectedCompany === company
                        ? "font-bold text-primary"
                        : ""
                    }`}
                    onClick={() => handleCompanySelect(company.toLowerCase())}
                  >
                    <Rocket className="w-4 h-4" /> {company}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;