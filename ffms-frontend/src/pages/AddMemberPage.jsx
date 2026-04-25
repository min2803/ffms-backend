import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/layout/UserLayout";
import { Sidebar, Header } from "../components/dashboard";
import {
  AddMemberModal,
  HouseholdInfo,
  MemberManagement,
} from "../components/household";
import { getNavigationItems } from "../data/navigation";
import useHousehold from "../hooks/useHousehold";

export default function AddMemberPage() {
  const [sidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavigationItems("household");
  // Assuming "current" to fetch currently active household
  const { household, loading, error, addMember } = useHousehold("current");
  
  // Example fallback for SEARCH_HISTORY (since it doesn't come from household fetch currently)
  const SEARCH_HISTORY = household?.searchHistory || [];

  const [selectedIds, setSelectedIds] = useState(
    SEARCH_HISTORY.filter((item) => item?.defaultSelected).map((item) => item.id)
  );

  const handleToggle = (memberId) => {
    setSelectedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

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
      <AddMemberModal
        isOpen
        members={SEARCH_HISTORY}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onClose={() => navigate("/household")}
        onSubmit={() => navigate("/household")}
      />
    </UserLayout>
  );
}
