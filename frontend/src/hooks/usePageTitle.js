import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    const base = "Club Deportivo Ajax";
    document.title = title ? `${title} | ${base}` : base;
  }, [title]);
}
