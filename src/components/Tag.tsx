type TagProps = {
  children: React.ReactNode;
  tone?: "default" | "locked" | "free";
};

export function Tag({ children, tone = "default" }: TagProps) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
