import Navigation from "./Navigation";
import Timer from "./Timer";

export default function Main() {
  return (
    <div className="min-h-screen grid grid-cols-[400px_1fr] mx-12 mb-12 bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-base))]">
      <nav className="bg-[rgb(var(--color-bg-secondary))] p-4">
        <Navigation />
      </nav>
      <div className="flex flex-col min-h-screen bg-[rgb(var(--color-bg-secondary))]">
        <div className="flex justify-center text-center">
          <Timer />
        </div>
      </div>
    </div>
  );
}
