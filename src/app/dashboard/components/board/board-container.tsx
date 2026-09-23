const BoardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="board-canvas relative flex h-full flex-col overflow-hidden rounded-xl">
      <h2 className="sr-only">Board Container</h2>
      <div className="flex h-full flex-col overflow-hidden">
        {children}
      </div>
    </section>
  );
};

export default BoardContainer;
