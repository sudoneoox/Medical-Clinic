import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../utils/Card.tsx";

const Error = ({ error }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-red-500 py-4">
          Error loading appointments: {error}
        </div>
      </CardContent>
    </Card>
  );
};

export default Error;
