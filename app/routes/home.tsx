import type { Route } from "./+types/home";
import { Navbar } from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream Job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      console.log(parsedResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className={"main-section"}>
        <div className={"page-heading py-16"}>
          <div className="page-heading">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
              <h2>
                No Resumes found. Upload your first resume to get feedback
              </h2>
            ) : (
              <h2>Review your submissions and check AI-powered feedback</h2>
            )}
          </div>
          {loadingResumes && (
            <div className={"flex flex-col items-center justify-center"}>
              <img src={"/images/resume-scan-2.gif"} className={"w-[200px]"} />
            </div>
          )}
        </div>
        {resumes && resumes?.length > 0 && (
          <div className={"resumes-section"}>
            {resumes.map((resume) => (
              <div key={resume.id}>
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div
            className={"flex flex-col items-center justify-center mt-10 gap-4"}
          >
            <Link
              to={"/upload"}
              className={"primary-button w-fit text-xl font-semibold"}
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
