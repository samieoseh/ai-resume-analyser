import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";

export const meta = () => [
  {
    title: "Resumind | Review",
  },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);

      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      console.log({ resumeUrl });
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagPath);
      if (!imageBlob) return;

      const imagUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imagUrl);

      setFeedback(JSON.parse(data.feedback));
      console.log({ resumeUrl, imagUrl, feedback: data.feedback });
    };

    loadResume();
  }, [id]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated]);

  return (
    <main className={"!pt-0 "}>
      <nav className={"resume-nav"}>
        <Link className={"back-button"} to={"/"}>
          <img src={"/icons/back.svg"} alt={"logo"} className={"w-2.5 h-2.5"} />
          <span className={"text-gray-800 text-sm font-semibold"}>
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className={"flex flex-row w-full max-lg:flex-col-reverse"}>
        <section
          className={
            "feedback-section bg-[url('/images/bg-small.svg')] bg-cover sticky min-h-[100vh] top-0 items-center justify-center"
          }
        >
          {imageUrl && resumeUrl && (
            <div
              className={
                "feedback-section animate-in fade-in duration-1000 gradient-border max-sm:m-0 min-h-[100%] max-wxl:h-fit w-fit"
              }
            >
              <a href={resumeUrl} target={"_blank"} rel={"noopener noreferrer"}>
                <img
                  src={imageUrl}
                  className={"w-full h-full object-contain rounded-2xl "}
                  title={"resume"}
                />
              </a>
            </div>
          )}
        </section>
        <section className={"feedback-section"}>
          <h2>Resume Review</h2>
          {feedback ? (
            <div
              className={"flex flex-col gap-8 animate-in fade-in duration-1000"}
            >
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img
              src={"/images/resume-scan-2.gif"}
              className={"w-full"}
              alt={"resume-gif"}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
