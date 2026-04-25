import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import { HouseholdInfo, MemberManagement } from "../components/household";
import { getNavigationItems } from "../data/navigation";
import useHousehold from "../hooks/useHousehold";

export default function HouseholdPage() {
  const [sidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household");
  
  // Here we would typically pass a household ID or use user context to get it. 
  // For now using empty call to trigger fetchMyHousehold (if it was implemented)
  // Tự động lấy household "me" và bootstrap nếu cần
  const { household, loading, error, removeMember } = useHousehold();

  return (
    <UserLayout
      sidebar={<Sidebar navItems={navItems} collapsed={sidebarCollapsed} />}
      header={
        <Header
          title="Household Management"
          subtitle="Configure your shared financial environment and manage access control."
          notificationCount={1}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {loading ? (
           <div className="lg:col-span-12 py-10 text-center font-medium text-[var(--color-text-secondary)]">
             Loading household data...
           </div>
        ) : error ? (
           <div className="lg:col-span-12 py-10 text-center font-medium text-red-500">
             Error: {error}
           </div>
        ) : household ? (
          <>
            <div className="lg:col-span-4">
              <HouseholdInfo
                name={household.name}
                description={household.description}
                createdOn={household.createdOn}
                status={household.status}
                onEdit={() => navigate("/household/edit")}
              />
            </div>
            <div className="lg:col-span-8">
              <MemberManagement
                members={household.members || []}
                onAddMember={() => navigate("/household/add-member")}
                onShowAll={() => console.log("Expand full member list...")}
                onRemove={(id) => removeMember(household.id, id)}
              />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 py-10 text-center font-medium text-[var(--color-text-secondary)]">No household data.</div>
        )}
      </div>
    </UserLayout>
  );
}
