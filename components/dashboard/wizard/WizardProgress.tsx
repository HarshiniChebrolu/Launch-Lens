const steps = ["Idea", "Users", "Problem", "Industry", "Budget", "Goal"];

export default function WizardProgress({ step }: { step: number }) {
  return (
    <div className="wizardProgress">
      {steps.map((item, index) => (
        <div className="wizardStep" key={item}>
          <span className={index <= step ? "active" : ""}>{index + 1}</span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}