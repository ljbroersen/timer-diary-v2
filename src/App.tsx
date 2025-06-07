import Main from "./components/Main";
import "./index.css";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen fixed-width bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-base))]">
      <Main />
    </div>
  );
}
