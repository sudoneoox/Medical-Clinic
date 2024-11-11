import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../utils/Card.tsx";

const DashboardCard = ({ title, icon, children }) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default DashboardCard;
