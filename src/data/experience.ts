export interface ExperienceEntry {
  id: string;
  logoSrc: string;
  logoAlt: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  skills: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "axibo",
    logoSrc: "/assets/images/AXIBO-logo.png",
    logoAlt: "AXIBO logo",
    title: "AXIBO",
    subtitle: "mechanical engineering",
    date: "may 26' - sept 26'",
    description:
      "Building humanoid robots at the forefront of Canadian robotics.",
    skills: ["fusion360", "solidworks", "c", "c++", "python"],
  },
  {
    id: "watonomous",
    logoSrc: "/assets/images/wato-logo.png",
    logoAlt: "WATonomous logo",
    title: "WATonomous",
    subtitle: "software engineering",
    date: "dec 25' - present",
    description:
      "Developing perception and autonomous pathing software for Rover on Waterloo's AV design team.",
    skills: ["c++", "python", "ROS 2", "docker"],
  },
  // WARG experience card temporarily removed
  // {
  //   id: "warg",
  //   logoSrc: "/assets/images/warg-logo.png",
  //   logoAlt: "WARG logo",
  //   title: "WARG",
  //   subtitle: "autonomy",
  //   date: "",
  //   description: "Waterloo Aerial Robotics Group.",
  //   skills: [],
  // },
  {
    id: "churchill",
    logoSrc: "/assets/images/churchill-logo.png",
    logoAlt: "Churchill Robotics logo",
    title: "Churchill Robotics",
    subtitle: "mechanical lead, mentor",
    date: "sept 22' - june 25'",
    description:
      "Directed a robotics club of 10+ teams totalling 150+ members, built world-class competition robots.",
    skills: ["c++", "onshape", "fusion360", "PID", "pure pursuit"],
  },
];
