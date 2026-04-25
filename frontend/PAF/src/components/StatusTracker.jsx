const steps = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const StatusTracker = ({ status }) => {
  if (status === "REJECTED") {
    return (
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs font-semibold">
          <span className="h-5 w-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center">1</span>
          OPEN
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/40 text-xs font-semibold">
          <span className="h-5 w-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center">X</span>
          REJECTED
        </div>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const className = isDone
          ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
          : isCurrent
            ? "bg-orange-500/20 text-orange-100 border-orange-500/40"
            : "bg-black/30 text-orange-200/70 border-orange-700/40";
        return (
          <div
            key={step}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${className}`}
          >
            <span className="h-5 w-5 rounded-full bg-black/35 text-white inline-flex items-center justify-center">
              {isDone ? "✓" : idx + 1}
            </span>
            {step.replace("_", " ")}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTracker;
