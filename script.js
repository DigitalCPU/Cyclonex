function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.transform === "translateX(0px)") {
        sidebar.style.transform = "translateX(-250px)"; // Hide sidebar
    } else {
        sidebar.style.transform = "translateX(0px)"; // Show sidebar
    }
}
