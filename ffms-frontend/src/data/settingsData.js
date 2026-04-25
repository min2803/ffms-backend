import { getCurrentYear } from "../utils/dateTime";

export const settingsProfileData = {
  name: "Alex Thompson",
  role: "Family Administrator",
  status: "ACTIVE MEMBER",
  joinedDate: `JOINED ${getCurrentYear()}`,
  uid: "772910483526",
  avatar:
    "https://www.figma.com/api/mcp/asset/f9b81ed0-e230-4803-ab16-1d35d4e38500",
};

export const personalInfoData = {
  fullName: "Alex Thompson",
  phone: "+1 (555) 123-4567",
  dob: "06/12/1985",
  gender: "male",
};

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
