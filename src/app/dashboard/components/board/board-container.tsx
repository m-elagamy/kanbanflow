const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-0 md:px-4">
      <h2 className="sr-only">Board Container</h2>
      {children}
    </section>
  );
};

export default BoardContainer;
