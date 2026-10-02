import { WeekClient } from "./client";

export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, index) => ({
    week: String(index + 1),
  }));
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;
  return <WeekClient weekNumber={Number(week)} />;
}
