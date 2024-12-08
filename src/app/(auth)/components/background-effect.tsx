export default function BackgroundEffect() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] opacity-20 [background-size:16px_16px] dark:bg-[radial-gradient(#4B5563_1px,transparent_1px)] dark:opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background/20 to-secondary/5 opacity-50 dark:from-primary/10 dark:via-background/10 dark:to-secondary/10" />
    </>
  );
}
