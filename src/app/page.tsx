"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Panel,
  Section,
  ExperienceCard,
  Input,
  ArrowIcon,
  Navbar,
  DevpostIcon,
  EmailIcon,
  LinkedInIcon,
  GitHubIcon,
  TiltedCard,
  ThemeToggle,
  ProjectDetailModal,
} from "@/components";
import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import UWaterlooLogo from "../../public/assets/icons/UWaterloo.png";
import BalatroLogo from "../../public/assets/icons/balatro.png";
import MinecraftLogo from "../../public/assets/icons/minecraft icon.svg";
import CanadaLogo from "../../public/assets/icons/canada.jpg";

const MAX_EXPERIENCE_TITLE_SIZE = 30;

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [experienceTitleSize, setExperienceTitleSize] = useState(
    MAX_EXPERIENCE_TITLE_SIZE
  );
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "software" | "mechanical">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      category: "mechanical" as const,
      imageSrc: "/assets/projects/robothand.jpg",
      altText: "Anthropomorphic Robot Hand",
      aspectRatio: "3/2",
      title: "Anthropomorphic Robot Hand",
      caption: "realistic robot hand controlled by OpenCV",
      description:
        "• Designed a human-proportioned robotic hand in SolidWorks, using configurations to generate multiple finger variants.\n• Validated range of motion and interference in assemblies with evaluation tools; applied tolerance and DFM principles to improve 3D-printed joint performance.\n• Developing a 5-DOF actuation system using Arduino Nano + ESP32 + PCA9685 servo shields; integrating OpenCV-based hand tracking to map real hand motion to robot motion.",
      techStack: ["SolidWorks", "Arduino", "ESP32", "C++", "Python", "OpenCV"],
    },
    {
      category: "both" as const,
      imageSrc: "/assets/projects/smart home image.png",
      altText: "Smart Home",
      aspectRatio: "3/2",
      title: "Smart Home Sensor System",
      caption: "esp32 sensor network connected to a pi",
      description:
        "• Built an ESP32 sensor network streaming room data to a Raspberry Pi hub; validated data within ±1°C and ±5% RH.\n• Implemented a Flask REST API to receive, store, and process telemetry; sustained 1000+ data points/hour.\n• Designed tolerance-driven enclosures in SolidWorks; iterated 4 revisions for cable routing, airflow, fit, and aesthetics.\n• Built a repeatable deployment workflow with sensor calibration, schema versioning, and basic trend/anomaly visualizations.",
      techStack: ["SolidWorks", "ESP32", "C++", "Python", "Flask", "Raspberry Pi"],
    },
    {
      category: "both" as const,
      imageSrc: "/assets/projects/vex.png",
      altText: "VEX Robotics",
      aspectRatio: "3/4",
      title: "VEX Robotics",
      caption: "competition robot design and programming",
      description:
        "• Led mechanical design for V5RC teams (3388N, 3388C); won 2024 Alberta Provincial Championship, competed at World Championship, and ranked 11th at Canada's largest robotics tournament.\n• Designed and fabricated mechanisms (pneumatics, gearboxes, flywheels, PTO); machined custom polycarbonate and acetal parts for competition robots.\n• Developed autonomous routines in C++ using PID, odometry, and Pure Pursuit; deployed reliably at competitions.\n• Maintained 300+ pages of engineering documentation and mentored 15+ junior members.",
      techStack: ["C++", "PID", "Odometry", "Pure Pursuit", "Onshape", "Fusion 360"],
    },
    {
      category: "mechanical" as const,
      imageSrc: "/assets/projects/card dealer.png",
      altText: "Card Dealer",
      aspectRatio: "16/9",
      title: "Card Dealer",
      caption: "automated card dealing robot",
      description:
        "• Designed a VEX-based robot that deals a customizable number of cards to automate card games.\n• Developed a dispenser over 4 iterations, achieving ~99.5% single-card success (about 1 misdeal per 200 deals).\n• Built C++ software using 5 input sources and PID; able to sort cards with ~99% accuracy and built a modular UI.\n• Implemented a custom randomized dealing-path algorithm to simulate card shuffling through software.",
      techStack: ["C++", "PID", "VEX"],
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/waterloowash.png",
      altText: "WaterlooWash",
      aspectRatio: "2/1",
      title: "WaterlooWash",
      caption: "laundry tracking mobile app",
      description:
        "• Designed a Figma prototype that gamifies residence laundry; applied HTML/CSS skills to refine UI/UX.\n• Built a component-driven React UI (hooks, responsive layout, accessibility) with Tailwind CSS.\n• Building a SQLite-backed API, WebSockets for live updates and auth so only residents can claim/rate machines.",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Figma", "SQLite", "WebSockets"],
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/wato asd.png",
      altText: "Self-Driving Car Sim",
      aspectRatio: "4/3",
      title: "Self-Driving Car Sim",
      caption: "watch video",
      href: "https://www.youtube.com/watch?v=mIYiKe8uu4Q",
      description:
        "• Developing ROS 2 robot navigation stack in C++ on Linux, using LiDAR data to assist autonomous pathing.\n• Implement and test A* pathfinding and Pure Pursuit; debug multi-node behavior via logs/telemetry and Foxglove.\n• Containerize builds and runtime dependencies with Docker to improve reproducibility across team environments.",
      techStack: ["C++", "ROS 2", "LiDAR", "A*", "Pure Pursuit", "Docker", "Linux", "Foxglove"],
    },
    {
      category: "both" as const,
      imageSrc: "/assets/projects/rover.png",
      altText: "Autonomous Mars Rover",
      aspectRatio: "3/2",
      title: "Autonomous Mars Rover",
      caption: "ROS 2 autonomy stack for a competition Mars rover",
      description:
        "• Built a ROS 2 autonomous navigation stack in C++ on Linux; generated LiDAR-based occupancy grids/costmaps and integrated A* planning with Pure Pursuit control.\n• Designed and tuned a PID controller for a Mars rover; implemented adaptive speed reduction to improve path tracking.\n• Built a URDF model with STL meshes for Foxglove visualization; calibrated a Gazebo physics simulation to better match real rover properties.",
      techStack: ["C++", "Python", "ROS 2", "LiDAR", "PID", "A*", "Pure Pursuit", "Gazebo", "Docker", "Linux"],
    },
    {
      category: "software" as const,
      title: "Valorant Fantasy",
      caption: "'fantasy football' style app for VCT",
      description:
        "• Built a full-stack fantasy esports platform with Next.js, React and TypeScript.\n• Developed a Python scraper to automate data collection, parsing HTML into structured datasets for analysis.\n• Designed a database in SQLite with SQLAlchemy ORM to store stats; automated fantasy points calculation.\n• Implemented a responsive UI with Tailwind CSS; enforced code quality with ESLint; deployed on Vercel.",
      techStack: ["Next.js", "React", "TypeScript", "Python", "SQLAlchemy", "SQLite", "Tailwind CSS"],
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/personal site.png",
      altText: "Personal Portfolio",
      aspectRatio: "3/2",
      title: "Personal Portfolio",
      caption: "this website",
      description: "This portfolio website — built from scratch with a focus on clean design and performance.",
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/molehunt.png",
      altText: "Molehunt",
      aspectRatio: "16/9",
      title: "Molehunt",
      caption: "custom minecraft minigame datapack",
      description:
        "• Built and hosted custom minigames for 20+ users, supporting 200+ total hours of gameplay.\n• Developed Java server plugins and custom mcfunction datapack logic; iterated mechanics using playtesting feedback.",
      techStack: ["Java", "mcfunction"],
    },
    {
      category: "both" as const,
      title: "Autonomous ATV",
      caption: "ROS 2 autonomy stack for electric outdoor ATV",
      description:
        "• Modified existing ATV steering system for electric power steering compatibility with ODrive motor controller; designed mechanical integration for actuator mounting and linkage geometry.\n• Contributed to overall system architecture for ROS 2 autonomy stack targeting full outdoor autonomous operation.",
      techStack: ["SolidWorks", "ROS 2", "ODrive", "Arduino", "Jetson Orin Nano"],
    },
  ];

  const handleMouseEnter = (id: string) => setExpandedId(id);
  const handleMouseLeave = () => setExpandedId(null);
  const handleClick = (id: string) => {
    // For mobile tap-to-toggle
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleResize = () => {
      setExperienceTitleSize(MAX_EXPERIENCE_TITLE_SIZE);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExperienceTitleSize = (size: number) => {
    setExperienceTitleSize((current) => Math.min(current, size));
  };

  const handleSendMessage = async () => {
    if (isSending) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error(`Message send failed: ${response.status}`);
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  const socialLinks = [
    { label: "Devpost", href: "https://devpost.com/ryan-muxiwang", icon: <DevpostIcon /> },
    { label: "Email", href: "mailto:ryan.muxiwang@gmail.com", icon: <EmailIcon /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ryan-muxi-wang/", icon: <LinkedInIcon /> },
    { label: "GitHub", href: "https://github.com/sym7534", icon: <GitHubIcon /> },
  ];

  return (
    <Container>
      {/* Left Panel - Main Content (sticky, doesn't scroll) */}
      <Panel side="left" className="flex flex-col">
        <div>
          {/* Hero Section */}
          <Section className="mb-[clamp(1rem,3vh,2rem)]">
            <h1 className="text-xl text-text-secondary leading-tight">
              hey, i&apos;m <span className="text-text-primary">Ryan Wang</span>
            </h1>
            <div className="w-full max-w-md h-px bg-text-secondary/20 my-[clamp(0.75rem,2.5vh,1.5rem)]" />
            <p className="text-sm text-text-secondary">
              <span className="underline">mechatronics engineering</span> @
              <span className="inline-flex items-baseline gap-1 ml-2">
                <Image
                  src={UWaterlooLogo}
                  alt="UWaterloo Logo"
                  width={14}
                  height={14}
                  className="object-contain relative top-[2px]"
                />
                <Link href="https://uwaterloo.ca" className="font-medium">
                  UWaterloo
                </Link>
              </span>
            </p>
            <p className="text-sm text-text-secondary mt-2">
              I&apos;m passionate about robotics systems, building useful tools, and
              bringing experiences to life. I love working at the intersection of
              hardware and software, from embedded sensing to autonomy, and I&apos;m
              always chasing projects that turn messy ideas into clean, reliable
              systems people can actually use.
            </p>
          </Section>

          {/* Social Links - fixed below bio */}
          <div className="flex items-center gap-4 mb-[clamp(1rem,3vh,2rem)]">
            <Navbar items={socialLinks} />
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-sm text-text-secondary underline hover:text-text-primary transition-colors"
              >
                my resume
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Experience Section */}
          <Section className="space-y-[clamp(0.5rem,2vh,1rem)]">
            <ExperienceCard
              logo={
                <Image
                  src="/assets/images/wato-logo.png"
                  alt="WATonomous logo"
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              }
              title="WATonomous"
              subtitle="software engineering member"
              date="jan 26' - present"
              description="Developing perception and autonomous pathing software for Rover on Waterloo's AV design team."
              skills={["c++", "python", "ROS 2", "docker"]}
              isExpanded={expandedId === "watonomous"}
              titleSize={experienceTitleSize}
              onTitleSizeChange={handleExperienceTitleSize}
              onMouseEnter={() => handleMouseEnter("watonomous")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("watonomous")}
            />
            <ExperienceCard
              logo={
                <Image
                  src="/assets/images/warg-logo.png"
                  alt="WARG logo"
                  width={50}
                  height={50}
                  className="rounded-md object-cover bg-white"
                />
              }
              title="Waterloo Aerial Robotics Group"
              subtitle="mechanical engineering member"
              date="dec 25' - present"
              description="Developing a competition firefighting drone."
              skills={["solidworks", "CAD"]}
              isExpanded={expandedId === "warg"}
              titleSize={experienceTitleSize}
              onTitleSizeChange={handleExperienceTitleSize}
              onMouseEnter={() => handleMouseEnter("warg")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("warg")}
            />
            <ExperienceCard
              logo={
                <Image
                  src="/assets/images/churchill-logo.png"
                  alt="Churchill Robotics logo"
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              }
              title="Churchill Robotics"
              subtitle="robotics coach, V5RC competitor"
              date="sept 22' - june 25'"
              description="Directed a robotics club of 10+ teams totalling 150+ members, built world-class competition robots."
              skills={["c++", "onshape", "fusion360", "PID", "pure pursuit"]}
              isExpanded={expandedId === "churchill"}
              titleSize={experienceTitleSize}
              onTitleSizeChange={handleExperienceTitleSize}
              onMouseEnter={() => handleMouseEnter("churchill")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("churchill")}
            />
          </Section>

          {/* Message Input */}
          <Section className="mt-[clamp(1.5rem,4vh,3rem)]">
            <Input
              placeholder="leave me a message"                                                                                    
              icon={<ArrowIcon />}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
              onIconClick={() => {
                void handleSendMessage();
              }}
              maxLength={500}
              aria-label="Leave a message"
              aria-busy={isSending}
            />
          </Section>
        </div>
      </Panel>

      {/* Right Panel - Projects & Skills */}
      <Panel side="right">
        <Section title="ABOUT ME">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="group relative flex items-start gap-4 pl-4">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <div className="flex flex-col gap-1 transition-transform duration-200 group-hover:translate-x-1">
                <span>
                  Proud
                  <span className="inline-flex items-baseline gap-1 ml-2">
                    <Image
                      src={CanadaLogo}
                      alt="Canada flag"
                      width={14}
                      height={14}
                      className="object-contain relative top-[2px]"
                    />
                    Canadian citizen.
                  </span>
                </span>
                <span className="pl-4">↳ Currently in Waterloo, grew up in Calgary.</span>
              </div>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                Favorite game:
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Image
                    src={MinecraftLogo}
                    alt="Minecraft"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  Minecraft
                </span>
                ; currently playing
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Image
                    src={BalatroLogo}
                    alt="Balatro"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  Balatro
                </span>
                .
              </span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>Skilled in 🎹 piano, 🎻 violin, 🪈 flute, and 🎷 alto sax.</span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>When I have time, I like to 🎨 paint.</span>
            </li>
          </ul>
        </Section>

        <Section title="TECH STACK">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                <span className="text-text-secondary">Languages:</span>{" "}
                <span className="inline-flex items-baseline gap-1">
                  <Image
                    src="/assets/icons/skill-cpp.svg"
                    alt="C++"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  C++
                </span>
                ,{" "}
                <span className="inline-flex items-baseline gap-1">
                  <Image
                    src="/assets/icons/skill-python.svg"
                    alt="Python"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  Python
                </span>
                , Java,{" "}
                <span className="inline-flex items-baseline gap-1">
                  <Image
                    src="/assets/icons/skill-typescript.svg"
                    alt="TypeScript"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  JavaScript/TypeScript
                </span>
                ,{" "}
                <span className="inline-flex items-baseline gap-1">
                  <Image
                    src="/assets/icons/skill-html.svg"
                    alt="HTML"
                    width={14}
                    height={14}
                    className="object-contain relative top-[2px]"
                  />
                  HTML/CSS
                </span>
              </span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                <span className="text-text-secondary">Robotics/Controls:</span> ROS 2,
                OpenCV, PID control, Odometry, A* Path Planning, Pure Pursuit
              </span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                <span className="text-text-secondary">Backend/Systems:</span> Node.js,
                Flask, Docker, Linux, REST APIs
              </span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                <span className="text-text-secondary">Tools:</span> Git, GitHub, VS Code,
                MATLAB, Arduino
              </span>
            </li>
            <li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-text-secondary rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>
                <span className="text-text-secondary">CAD &amp; Manufacturing:</span>{" "}
                SolidWorks (
                <Link
                  href="https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-ZEANMHFSWG"
                  className="underline text-text-secondary"
                >
                  CSWP
                </Link>
                ), AutoCAD, Fusion 360, Onshape,
                GD&amp;T/Technical Drawings, 3D Printing
              </span>
            </li>
          </ul>
        </Section>

        <Section className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-lg text-text-primary tracking-wide">PROJECTS</h2>
            <button
              onClick={() => setProjectFilter(projectFilter === "software" ? "all" : "software")}
              className={`font-serif text-sm transition-colors ${
                projectFilter === "software"
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              software
            </button>
            <button
              onClick={() => setProjectFilter(projectFilter === "mechanical" ? "all" : "mechanical")}
              className={`font-serif text-sm transition-colors ${
                projectFilter === "mechanical"
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              mechanical
            </button>
          </div>
          <div className="columns-2 gap-4">
            {projects
              .filter(p => projectFilter === "all" || p.category === projectFilter || p.category === "both")
              .map(project => (
                <TiltedCard
                  key={project.title}
                  imageSrc={project.imageSrc}
                  altText={project.altText}
                  aspectRatio={project.aspectRatio}
                  title={project.title}
                  caption={project.caption}
                  href={project.href}
                  onClick={() => setSelectedProject(project)}
                  className="mb-4 break-inside-avoid"
                />
              ))}
          </div>
        </Section>
      </Panel>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Container>
  );
}
