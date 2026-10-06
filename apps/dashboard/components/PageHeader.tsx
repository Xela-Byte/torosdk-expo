interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-10 pb-8 border-b border-[#1f1f1f]">
      <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-[#71717a] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
