const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-background">
      <h2 className="sr-only">Board Container</h2>
      {/* Enhanced gradient overlay for depth and glassmorphism effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10 dark:to-muted/8" />
      {/* Subtle radial gradient for visual interest */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.01),transparent_50%)]" />
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {children}
      </div>
    </section>
  );
};

export default BoardContainer;
