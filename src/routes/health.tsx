import { vars } from "@env/vars";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  component: RouteComponent,
});

function RouteComponent() {
  return <pre>{JSON.stringify(vars, null, 2)}</pre>;
}
