const ROLE_STYLES = {
  ADMIN: "bg-[var(--color-role-admin-bg)] text-[var(--color-role-admin-text)]",
  EDITOR: "bg-[var(--color-role-editor-bg)] text-[var(--color-role-editor-text)]",
  VIEWER: "bg-[var(--color-role-viewer-bg)] text-[var(--color-role-viewer-text)]",
};

export default function RoleBadge({ role }) {
  const tone = ROLE_STYLES[role?.toUpperCase()] || ROLE_STYLES.VIEWER;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] ${tone}`}
    >
      {role}
    </span>
  );
}
