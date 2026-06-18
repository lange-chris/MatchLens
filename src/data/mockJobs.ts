export interface JobListing {
  id: string;
  title: string;
  employer: string;
  location: string;
  employmentType: string[]; // e.g. "Full Time", "Temporary"
  datePosted: string;
  descriptionText: string;
  logoInitial: string;
}

export const mockJobs: JobListing[] = [
  {
    id: "job-001",
    title: "Full Professorship (W3) for Gynecological Oncology",
    employer: "Albert-Ludwigs-Universität Freiburg",
    location: "Freiburg",
    employmentType: ["Full Time", "Temporary"],
    datePosted: "2026-06-18",
    logoInitial: "AL",
    descriptionText: "The University of Freiburg is seeking a Full Professor (W3) for Gynecological Oncology. The successful candidate will have an outstanding track record in research and clinical practice in gynecological oncology. Responsibilities include leading the clinical department, teaching medical students, and conducting high-level academic research. Requirements: M.D., Habilitation or equivalent academic achievements, board certification in Gynecology and Obstetrics with specialization in Gynecological Oncology."
  },
  {
    id: "job-002",
    title: "Duales Studium der Informatik - Bachelor of Science (w_m_d)",
    employer: "GFZ Helmholtz Centre for Geosciences",
    location: "Potsdam",
    employmentType: ["Full Time", "Part Time", "Temporary"],
    datePosted: "2026-06-17",
    logoInitial: "GF",
    descriptionText: "We are looking for motivated students for a Dual Study program in Computer Science (B.Sc.). You will combine theoretical studies at the university with practical phases at the GFZ. You will learn software engineering, data analysis, and system administration. Requirements: Abitur or Fachabitur with good grades in Mathematics and Computer Science, high motivation to work in an international research environment, good German and English skills."
  },
  {
    id: "job-003",
    title: "Tenure-Track Position as Associate Professor of Philosophy of Human Rights",
    employer: "Friedrich-Alexander-Universität Erlangen-Nürnberg (FAU)",
    location: "Erlangen",
    employmentType: ["Full Time", "Temporary"],
    datePosted: "2026-06-17",
    logoInitial: "FA",
    descriptionText: "FAU is seeking an outstanding researcher for a Tenure-Track Associate Professorship in Philosophy of Human Rights. The role involves developing an independent research profile, securing third-party funding, and teaching in the interdisciplinary Human Rights Master's program. Requirements: Excellent Ph.D. in Philosophy, significant postdoctoral experience, internationally recognized publications, and a strong research vision bridging ethics, political philosophy, and human rights law."
  },
  {
    id: "job-004",
    title: "Postdoctoral researcher (f_m_x) - Experimental rock deformation",
    employer: "GFZ Helmholtz Centre for Geosciences",
    location: "Potsdam",
    employmentType: ["Full Time", "Part Time", "Temporary"],
    datePosted: "2026-06-17",
    logoInitial: "GF",
    descriptionText: "The GFZ seeks a Postdoctoral researcher in experimental rock deformation. The project investigates the mechanical and transport properties of fault zones under deep crustal conditions. You will conduct high-pressure, high-temperature triaxial deformation experiments and analyze microstructures using SEM/EBSD. Requirements: Ph.D. in Earth Sciences, Physics, or Materials Science. Strong background in rock mechanics or mineral physics. Experience with experimental apparatus and data analysis."
  },
  {
    id: "job-005",
    title: "Independent Junior Group Leader Research Position in Practice-led Public Engagement",
    employer: "Charité – Universitätsmedizin Berlin",
    location: "Berlin",
    employmentType: ["Full Time", "Temporary"],
    datePosted: "2026-06-17",
    logoInitial: "CH",
    descriptionText: "Charité invites applications for a Junior Group Leader in Practice-led Public Engagement. The group will explore innovative methods for engaging the public in biomedical research, focusing on citizen science, participatory research, and science communication. You will build and lead a small team and collaborate with clinical researchers. Requirements: Ph.D. in Science Communication, Sociology, or a related field. Proven experience in designing and evaluating public engagement initiatives. Strong leadership potential."
  }
];
