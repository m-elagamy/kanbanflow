const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex h-full flex-col overflow-hidden">
      <h2 className="sr-only">Board Container</h2>
      {children}
    </section>
  );
};

export default BoardContainer;
