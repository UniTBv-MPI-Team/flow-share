document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const confirmLogoutBtn = document.getElementById("confirm-logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      openModal("logout-modal");
    });
  }

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", async () => {
      try {
        confirmLogoutBtn.disabled = true;
        confirmLogoutBtn.textContent = "Logging out...";

        const response = await fetch("/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          window.location.href = "/login";
        } else {
          alert("Logout failed. Please try again.");
          confirmLogoutBtn.disabled = false;
          confirmLogoutBtn.textContent = "Logout";
        }
      } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout. Please try again.");
        confirmLogoutBtn.disabled = false;
        confirmLogoutBtn.textContent = "Logout";
      }
    });
  }

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
