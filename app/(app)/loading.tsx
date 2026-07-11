import LoadingSpinner from "@/components/LoadingSpinner";

function Loading() {
  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-32 text-foreground lg:px-8">
      <LoadingSpinner
        className="min-h-[55vh]"
        size="lg"
        text="جار التحميل..."
      />
    </main>
  );
}

export default Loading;
