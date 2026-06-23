const fs = require('fs');

const data = {
  cvUrl: "https://pzkptzzydhcpuparnkug.supabase.co/storage/v1/object/public/cvs/85gx8fgdk4.pdf",
  jobs: [
    {
      id: "job-001",
      title: "Associate Professor of Molecular Tumor Virology (salary group W2)",
      employer: "Friedrich-Alexander-Universität Erlangen-Nürnberg (FAU)",
      location: "Erlangen-Nürnberg",
      employmentType: ["Full Time", "Permanent"],
      datePosted: "2026-06-22",
      logoInitial: "FA",
      descriptionText: "FAU is seeking an outstanding researcher for an Associate Professorship in Molecular Tumor Virology. You will develop an independent research profile and teach."
    },
    {
      id: "job-002",
      title: "Student Assistant (f/m/d) – Research Coordination",
      employer: "Max-Planck-Institut für Physik",
      location: "Garching",
      employmentType: ["Part Time", "Temporary"],
      datePosted: "2026-06-22",
      logoInitial: "MP",
      descriptionText: "We are looking for a student assistant to support our research coordination team."
    },
    {
      id: "job-003",
      title: "Rector (f/m/d)",
      employer: "MDW Universität für Musik und darstellende Kunst Wien",
      location: "Wien",
      employmentType: ["Full Time", "Permanent"],
      datePosted: "2026-06-21",
      logoInitial: "MD",
      descriptionText: "The University of Music and Performing Arts Vienna is seeking a Rector."
    },
    {
      id: "job-004",
      title: "Doctoral Researcher (f_m_x) - Organic Geochemistry",
      employer: "GFZ Helmholtz Centre for Geosciences",
      location: "Potsdam",
      employmentType: ["Full Time", "Temporary"],
      datePosted: "2026-06-20",
      logoInitial: "GF",
      descriptionText: "The GFZ seeks a Doctoral researcher in organic geochemistry."
    },
    {
      id: "job-005",
      title: "W3 professorship Landscape Architecture | Design (m/f/d)",
      employer: "Universität Kassel",
      location: "Kassel",
      employmentType: ["Full Time", "Permanent"],
      datePosted: "2026-06-20",
      logoInitial: "UK",
      descriptionText: "The University of Kassel is seeking a W3 professor for Landscape Architecture and Design."
    },
    {
      id: "job-006",
      title: "Postdoctoral Researcher – Life Scientist / Microscopist (f/m/d)",
      employer: "Universitätsmedizin Göttingen",
      location: "Göttingen",
      employmentType: ["Full Time", "Temporary"],
      datePosted: "2026-06-19",
      logoInitial: "UM",
      descriptionText: "We are seeking a postdoctoral researcher with a strong background in life sciences and microscopy."
    },
    {
      id: "job-007",
      title: "W2 Professorship in Surgical Oncology",
      employer: "Justus-Liebig-Universität Gießen",
      location: "Gießen",
      employmentType: ["Full Time", "Permanent"],
      datePosted: "2026-06-19",
      logoInitial: "JL",
      descriptionText: "The Justus Liebig University Giessen is seeking a W2 Professor for Surgical Oncology."
    },
    {
      id: "job-008",
      title: "Professor in Mechanical Process Engineering (f/m/d)",
      employer: "Technische Universität München (TUM)",
      location: "München",
      employmentType: ["Full Time", "Permanent"],
      datePosted: "2026-06-18",
      logoInitial: "TU",
      descriptionText: "TUM invites applications for a Professorship in Mechanical Process Engineering."
    },
    {
      id: "job-009",
      title: "Doctoral Researcher in membrane protein biophysics / biochemistry (m/f/d)",
      employer: "Heinrich-Heine-Universität Düsseldorf",
      location: "Düsseldorf",
      employmentType: ["Full Time", "Temporary"],
      datePosted: "2026-06-18",
      logoInitial: "HH",
      descriptionText: "We are looking for a Doctoral Researcher focusing on membrane protein biophysics."
    },
    {
      id: "job-010",
      title: "Academic Researcher (f/m/d)",
      employer: "Karlsruher Institut für Technologie (KIT)",
      location: "Eggenstein-Leopoldshafen",
      employmentType: ["Full Time", "Temporary"],
      datePosted: "2026-06-17",
      logoInitial: "KI",
      descriptionText: "KIT is seeking an Academic Researcher for exciting new projects."
    }
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
