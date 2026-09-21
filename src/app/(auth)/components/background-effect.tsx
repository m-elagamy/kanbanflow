export default function BackgroundEffect() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-[0.12] [background-size:18px_18px] dark:bg-[radial-gradient(#4B5563_1px,transparent_1px)] dark:opacity-25" />
      <div className="absolute -top-32 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-background/30 to-secondary/5 dark:from-primary/10 dark:via-background/20 dark:to-secondary/10" />
    </>
  );
}
