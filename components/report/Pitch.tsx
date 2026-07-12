import { StartupReport } from "@/types/report";

export default function Pitch({ report }: { report: StartupReport }) {
  const questions = report.pitch?.questions || [];

  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <h2>30-Second Pitch</h2>
        <p className="bigPitch">{report.pitch?.short || "Pitch not available."}</p>
      </div>

      <div className="reportCard">
        <h2>Investor Pitch</h2>
        <p>{report.pitch?.investor || "Investor pitch not available."}</p>
      </div>

      <div className="reportCard">
        <h2>Hackathon Pitch</h2>
        <p>{report.pitch?.hackathon || "Hackathon pitch not available."}</p>
      </div>

      <div className="reportCard span2">
        <h2>Expected Questions</h2>
        <div className="questionList">
          {questions.length > 0 ? (
            questions.map((item) => (
              <div className="questionCard" key={item}>
                {item}
              </div>
            ))
          ) : (
            <p>No questions generated.</p>
          )}
        </div>
      </div>
    </div>
  );
}