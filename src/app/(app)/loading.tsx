import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <Card key={item}><Skeleton height="120px" /></Card>)}</div>;
}
