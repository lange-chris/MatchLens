const data = {
  cvUrl: "https://pzkptzzydhcpuparnkug.supabase.co/storage/v1/object/public/cvs/85gx8fgdk4.pdf",
  jobs: [
    { id: "job-001", title: "Associate Professor of Molecular Tumor Virology", employer: "FAU", descriptionText: "..." },
    { id: "job-002", title: "Student Assistant", employer: "Max-Planck", descriptionText: "..." },
    { id: "job-003", title: "Rector", employer: "MDW", descriptionText: "..." },
    { id: "job-004", title: "Doctoral Researcher", employer: "GFZ", descriptionText: "..." },
    { id: "job-005", title: "W3 professorship", employer: "Kassel", descriptionText: "..." },
    { id: "job-006", title: "Postdoctoral Researcher", employer: "Göttingen", descriptionText: "..." },
    { id: "job-007", title: "W2 Professorship", employer: "Gießen", descriptionText: "..." },
    { id: "job-008", title: "Professor", employer: "TUM", descriptionText: "..." },
    { id: "job-009", title: "Doctoral Researcher", employer: "Düsseldorf", descriptionText: "..." },
    { id: "job-010", title: "Academic Researcher", employer: "KIT", descriptionText: "..." }
  ],
  language: "de"
};

fetch("http://localhost:3000/api/job-match", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
  .then(res => res.json().then(json => ({ status: res.status, json })))
  .then(console.log)
  .catch(console.error);
