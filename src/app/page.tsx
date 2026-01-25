"use client";

import { useState } from "react";
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
  CppIcon,
  PythonIcon,
  TypeScriptIcon,
  HtmlIcon,
  SolidWorksIcon,
  NextJsIcon,
  TailwindIcon,
  RosIcon,
  UnrealIcon,
  UbuntuIcon,
  TiltedCard,
} from "@/components";
import Image from "next/image";

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => setExpandedId(id);
  const handleMouseLeave = () => setExpandedId(null);
  const handleClick = (id: string) => {
    // For mobile tap-to-toggle
    setExpandedId((prev) => (prev === id ? null : id));
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
          <Section className="mb-8">
            <h1 className="text-xl text-text-secondary leading-tight">
              hey, i&apos;m <span className="text-text-primary">Ryan Wang</span>
            </h1>
            <div className="w-full max-w-md h-px bg-text-secondary/20 my-6" />
            <p className="text-base text-text-secondary">
              <span className="underline">mechatronics engineering</span> @ UWaterloo
            </p>
            <p className="text-base text-text-secondary mt-2">
              I&apos;m passionate about robotics systems, building useful tools, and
              bringing experiences to life.
            </p>
          </Section>

          {/* Social Links - fixed below bio */}
          <Navbar items={socialLinks} className="mb-8" />

          {/* Experience Section */}
          <Section className="space-y-4">
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
                  className="rounded-md object-cover"
                />
              }
              title="Waterloo Aerial Robotics Group"
              subtitle="mechanical engineering member"
              date="dec 25' - present"
              description="Developing a competition firefighting drone."
              skills={["solidworks", "CAD"]}
              isExpanded={expandedId === "warg"}
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
              onMouseEnter={() => handleMouseEnter("churchill")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick("churchill")}
            />
          </Section>

          {/* Message Input */}
          <Section className="mt-12">
            <Input
              placeholder="leave me a message"
              icon={<ArrowIcon />}
            />
          </Section>
        </div>
      </Panel>

      {/* Right Panel - Projects & Skills */}
      <Panel side="right">
        <Section title="TECHNICAL SKILLS">
          <div className="flex flex-wrap gap-4">
            <CppIcon />
            <PythonIcon />
            <TypeScriptIcon />
            <HtmlIcon />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <SolidWorksIcon />
            <NextJsIcon />
            <TailwindIcon />
            <RosIcon />
            <UnrealIcon />
            <UbuntuIcon />
          </div>
        </Section>

        <Section title="PROJECTS" className="mt-12">
          <div className="grid grid-cols-2 gap-4">
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj1/400/300"
              altText="Project 1"
              className="h-60"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 1</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj2/400/450"
              altText="Project 2"
              className="h-72 row-span-2"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 2</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj3/400/450"
              altText="Project 3"
              className="h-72"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 3</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj4/400/250"
              altText="Project 4"
              className="h-48"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 4</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj5/400/400"
              altText="Project 5"
              className="h-64"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 5</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
            <TiltedCard
              imageSrc="https://picsum.photos/seed/proj6/400/350"
              altText="Project 6"
              className="h-56"
              overlayContent={
                <div className="text-white">
                  <h3 className="font-serif text-base font-medium">Project 6</h3>
                  <p className="font-serif text-xs opacity-80">Description placeholder</p>
                </div>
              }
            />
          </div>
        </Section>
      </Panel>
    </Container>
  );
}
