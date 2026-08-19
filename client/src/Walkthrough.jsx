const steps = [
  {
    label: "Screen 1 of 3",
    title: "Add an employee in seconds",
    body: "One form captures everything HR needs to track — id, role, pay, tenure, and contact details — with validation before anything reaches the database.",
    points: [
      "Eight required fields: Emp Id, Name, Designation, Salary, Experience, Mobile, Join Date, Address.",
      "Salary and experience are checked as non-negative numbers before saving.",
      "Submits with POST /api/employees; the same form switches to PUT when editing a record.",
    ],
  },
  {
    label: "Screen 2 of 3",
    title: "Browse the full directory",
    body: "Every active employee in one sortable table, with Edit and Delete sitting right on the row instead of behind a menu.",
    points: [
      "Edit loads the record straight into the form, switching it into update mode.",
      "Delete doesn't erase the record — it soft-deletes, so nothing is lost by mistake.",
      "Switch tabs any time without losing your place.",
    ],
  },
  {
    label: "Screen 3 of 3",
    title: "Nothing is gone for good",
    body: "Deleting an employee just marks them removed. The Deleted Employees tab lists every one of them, one Restore away from the active directory.",
    points: [
      "Records keep a deletedAt timestamp instead of being erased from MongoDB.",
      "GET /api/employees/trash lists everything currently removed, most recent first.",
      "POST /:id/restore clears the timestamp and puts the record straight back in the directory.",
    ],
  },
];

function Walkthrough() {
  return (
    <section className="card walkthrough">
      <h2>Walkthrough</h2>
      <p className="walkthrough-intro">A quick tour of the three screens in this dashboard.</p>

      <div className="walkthrough-steps">
        {steps.map((step) => (
          <div className="walkthrough-step" key={step.title}>
            <p className="walkthrough-label">{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <ul>
              {step.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Walkthrough;
