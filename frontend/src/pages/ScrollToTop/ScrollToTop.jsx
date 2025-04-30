import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const dashboardContainer = document.getElementById("dashboard-body");
    if (dashboardContainer) {
      dashboardContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
}
