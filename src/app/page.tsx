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
} from "@/components";
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

  const projects = [
    {
      category: "mechanical" as const,
      imageSrc: "/assets/projects/robot hand.png",
      altText: "Anthropomorphic Robot Hand",
      aspectRatio: "3/2",
      title: "Anthropomorphic Robot Hand",
      caption: "realistic robot hand controlled by OpenCV",
    },
    {
      category: "both" as const,
      imageSrc: "/assets/projects/smart home image.png",
      altText: "Smart Home",
      aspectRatio: "3/2",
      title: "Smart Home Sensor System",
      caption: "esp32 sensor network connected to a pi",
    },
    {
      category: "both" as const,
      imageSrc: "/assets/projects/vex.png",
      altText: "VEX Robotics",
      aspectRatio: "3/4",
      title: "VEX Robotics",
      caption: "competition robot design and programming",
    },
    {
      category: "mechanical" as const,
      imageSrc: "/assets/projects/card dealer.png",
      altText: "Card Dealer",
      aspectRatio: "16/9",
      title: "Card Dealer",
      caption: "automated card dealing robot",
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/waterloowash.png",
      altText: "WaterlooWash",
      aspectRatio: "2/1",
      title: "WaterlooWash",
      caption: "laundry tracking mobile app",
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/wato asd.png",
      altText: "WATonomous ASD Assignment",
      aspectRatio: "4/3",
      title: "WATonomous ASD Assignment",
      caption: "watch video",
      href: "https://www.youtube.com/watch?v=mIYiKe8uu4Q",
    },
    {
      category: "software" as const,
      title: "Valorant Fantasy",
      caption: "'fantasy football' style app for VCT",
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/personal site.png",
      altText: "Personal Portfolio",
      aspectRatio: "3/2",
      title: "Personal Portfolio",
      caption: "this website",
    },
    {
      category: "software" as const,
      imageSrc: "/assets/projects/molehunt.png",
      altText: "Molehunt",
      aspectRatio: "16/9",
      title: "Molehunt",
      caption: "custom minecraft minigame datapack",
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
              I love robotics.
            </p>
          </Section>

          {/* Social Links - fixed below bio */}
          <div className="flex items-center gap-4 mb-[clamp(1rem,3vh,2rem)]">
            <Navbar items={socialLinks} />
            <ThemeToggle />
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
              date="oct 23' - may 25'"
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
            <h2 className="font-serif text-lg text-text-section tracking-wide">PROJECTS</h2>
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
                  className="mb-4 break-inside-avoid"
                />
              ))}
          </div>
        </Section>
      </Panel>
    </Container>
  );
}
