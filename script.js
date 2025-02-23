function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
    } else {
        sidebar.classList.add("hidden");
    }
}
