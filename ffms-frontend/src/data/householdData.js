import { getCurrentDateLabel, getCurrentYear } from "../utils/dateTime";
export { householdNavItems } from "./navigation";

export const householdInfo = {
  name: "Thompson Family",
  description:
    `Centralized management for main residence expenses, rainy day funds, and collective grocery planning for ${getCurrentYear()} fiscal year.`,
  createdOn: getCurrentDateLabel(),
  status: "Active",
};

export const existingHouseholdNames = [
  "Thompson Family",
  "Nguyen Family",
  "Tran Household",
  "Rivera Family",
];

export const householdMembers = [
  {
    id: "m1",
    name: "Alex Thompson",
    email: "alex.t@nexus.com",
    role: "ADMIN",
    isOwner: true,
    avatar: "https://www.figma.com/api/mcp/asset/bc045820-381c-4a4e-b56c-cd5da50b1f8a",
  },
  {
    id: "m2",
    name: "Sarah Thompson",
    email: "sarah.j@nexus.com",
    role: "EDITOR",
    isOwner: false,
    avatar: "https://www.figma.com/api/mcp/asset/738e908e-6421-45c8-a4a0-311dca26d284",
  },
  {
    id: "m3",
    name: "Leo Miller",
    email: "leo.m@nexus.com",
    role: "VIEWER",
    isOwner: false,
    avatar: "https://i.pravatar.cc/150?u=leo",
  },
];

export const editHouseholdPermissions = [
  {
    id: "p1",
    initials: "AT",
    name: "Alex Thompson",
    subtitle: "Owner • alex.t@email.com",
    roleLabel: "Owner",
  },
  {
    id: "p2",
    initials: "ST",
    name: "Sarah Thompson",
    subtitle: "Admin • sarah.t@email.com",
    roleLabel: "Admin",
  },
  {
    id: "p3",
    initials: "MT",
    name: "Michael Thompson",
    subtitle: "Member • mike.t@email.com",
    roleLabel: "Member",
  },
  {
    id: "p4",
    initials: "RJ",
    name: "Riley Jenkins",
    subtitle: "Viewer • staff@estate.com",
    roleLabel: "Viewer",
  },
];

export const memberSearchHistory = [
  {
    id: "u1",
    name: "Julian Rivers",
    uid: "@julian_fin",
    avatar: "https://i.pravatar.cc/100?u=julian",
    defaultSelected: true,
  },
  {
    id: "u2",
    name: "Sarah Chen",
    uid: "@schen_88",
    avatar: "https://i.pravatar.cc/100?u=sarah",
    defaultSelected: true,
  },
  {
    id: "u3",
    name: "Marcus Vane",
    uid: "@mvane_arch",
    avatar: "https://i.pravatar.cc/100?u=marcus",
  },
  {
    id: "u4",
    name: "Elena Rodriguez",
    uid: "@elena_rodz",
    avatar: "https://i.pravatar.cc/100?u=elena",
  },
];
