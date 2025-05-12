import Diary from "./Diary";
import Timer from "./Timer";

function Main() {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr] mx-12 mb-12 bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-base))]">
      
      <nav className="bg-[rgb(var(--color-bg-secondary))] p-4">
        Text
      </nav>

      <div className="flex flex-col min-h-screen">
        <div className="bg-[rgb(var(--color-bg-secondary))] p-4 h-1/2">
        <Timer />
        </div>
        <div className="bg-[rgb(var(--color-bg-secondary))] p-4 h-1/2">
        <Diary />
        </div>
      </div>

    </div>
  );
}

export default Main;
