import Badge from "./components/ui/Badge";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-10 space-y-6">

      {/* Button variants */}
      <div className="flex gap-3">
        <Button variant="primary">Analyze</Button>
        <Button variant="secondary">Upload File</Button>
        <Button variant="ghost">Clear</Button>
        <Button variant="primary" loading>Analyzing...</Button>
      </div>

      {/* Badge variants */}
      <div className="flex gap-2">
        <Badge variant="high">High</Badge>
        <Badge variant="medium">Medium</Badge>
        <Badge variant="low">Low</Badge>
        <Badge variant="success">Valid</Badge>
        <Badge variant="indigo">O(n²)</Badge>
      </div>

      {/* Card with title and action */}
      <Card
        title="Summary Card"
        headerAction={<Badge variant="success">Success</Badge>}
      >
        <p className="text-sm text-gray-500">
          Card body content goes here.
        </p>
      </Card>

    </main>
  );
}