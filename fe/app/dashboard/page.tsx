import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardFeature } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardFeature />
    </MainLayout>
  );
}
