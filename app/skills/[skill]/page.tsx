import { SkillClient } from "./client";
import { Skill } from "@/types";

export function generateStaticParams() {
  return [
    { skill: "listening" },
    { skill: "reading" },
    { skill: "writing" },
    { skill: "speaking" },
  ];
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill } = await params;
  return <SkillClient skill={skill as Skill} />;
}
