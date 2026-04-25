import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import {
  EditHouseholdModal,
  HouseholdInfo,
  MemberManagement,
} from "../components/household";
import { getNavigationItems } from "../data/navigation";
import useHousehold from "../hooks/useHousehold";

export default function EditHouseholdPage() {
  const [sidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household");
  const { household, loading, error, updateHousehold } = useHousehold("current");
  
  const EXISTING_HOUSEHOLD_NAMES = []; // Can be fetched separately if needed
  const PERMISSION_MEMBERS = household?.permissions || [];

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
             Loading...
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
                onEdit={() => {}}
              />
            </div>
            <div className="lg:col-span-8">
              <MemberManagement members={household.members || []} onAddMember={() => {}} onShowAll={() => {}} />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 py-10 text-center font-medium text-[var(--color-text-secondary)]">No household data.</div>
        )}
      </div>
      {household && (
        <EditHouseholdModal
          isOpen
          initialName={household.name}
          initialDescription={household.description}
          existingHouseholdNames={EXISTING_HOUSEHOLD_NAMES}
          permissionMembers={PERMISSION_MEMBERS}
          onClose={() => navigate("/household")}
          onSave={async (data) => {
            await updateHousehold(household.id, data);
            navigate("/household");
          }}
        />
      )}
    </UserLayout>
  );
}
