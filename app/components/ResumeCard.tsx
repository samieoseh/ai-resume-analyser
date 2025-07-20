import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Score from "~/components/Score";
import { usePuterStore } from "~/lib/puter";

function ResumeCard({ resume }: { resume: Resume }) {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(resume.imagPath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);

      setResumeUrl(url);
    };

    loadResume();
  }, [resume.imagPath]);

  return (
    <Link
      to={`/resume/${resume.id}`}
      className={"resume-card animate-in fade-19 duration-1000"}
    >
      <div className={"resume-card-header"}>
        <div className={"flex flex-col gap-2"}>
          {resume.companyName && (
            <h2 className={"!text-black font-bold break-words"}>
              {resume.companyName}
            </h2>
          )}
          {resume.jobTitle && (
            <h3 className={"text-lg break-words text-gray-500"}>
              {resume.jobTitle}
            </h3>
          )}
        </div>
        <div className={"flex-shrink-0"}>
          <Score score={resume.feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className={"gradient-border animate-in fade-in duration-1000"}>
          <div className={"w-full h-full"}>
            <img
              src={resumeUrl}
              alt={"resume"}
              className={
                "w-full h-[350px] max-sm:h-[200px] object-cover object-top"
              }
            />
          </div>
        </div>
      )}
    </Link>
  );
}

export default ResumeCard;
