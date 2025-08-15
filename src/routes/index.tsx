import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { TodoApp } from "@/components/TodoApp";
import {
	electricConfigCollection,
	electricTodoCollection,
} from "@/lib/collections";

export const Route = createFileRoute("/")({
	component: ElectricPage,
	ssr: false,
	loader: async () => {
		await Promise.all([
			electricTodoCollection.preload(),
			electricConfigCollection.preload(),
		]);

		return null;
	},
});

function ElectricPage() {
	// Get data using live queries with Electric collections
	const { data: todos } = useLiveQuery((q) =>
		q
			.from({ todo: electricTodoCollection })
			.orderBy(({ todo }) => todo.created_at, "asc"),
	);

	const { data: configData } = useLiveQuery((q) =>
		q.from({ config: electricConfigCollection }),
	);

	return (
		<TodoApp
			todos={todos}
			configData={configData}
			todoCollection={electricTodoCollection}
			configCollection={electricConfigCollection}
			title="todos (electric)"
		/>
	);
}
