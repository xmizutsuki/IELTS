import { PracticeClient } from "./client";

export function generateStaticParams() {
  return [
    { skill: "reading" },
    { skill: "listening" },
  ];
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ skill: "reading" | "listening" }>;
}) {
  const { skill } = await params;
  return <PracticeClient skill={skill} />;
}
