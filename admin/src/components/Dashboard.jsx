import DashboardPreview from "./DashboardPreview";
import Preview from "./Preview";

function Dashboard() {
  return (
    <div className="flex">
      <DashboardPreview />
      <Preview />
    </div>
  );
}

export default Dashboard;
