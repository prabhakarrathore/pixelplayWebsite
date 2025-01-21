const imagepage = document.getElementById("card-image");
const searchBar = document.querySelector(".footer-text");
const download = document.querySelector("#download");
const back = document.querySelector(".back");


function getSearchTerm() {
    const params = new URLSearchParams(window.location.search);
    const searchSrc = params.get('src');
    const searchTerm = params.get('search').split(",")[0];
    searchBar.innerText = searchTerm;
    if (searchSrc) {
        imagepage.src = searchSrc;
    } else {
        window.location.href = `index.html`
    }
}
window.onload = getSearchTerm;

document.querySelectorAll(".popover-trigger").forEach((button) => {
    const popoverGroup = button.closest(".popover-group");

    button.addEventListener("click", () => {
        // Close other popovers
        document.querySelectorAll(".popover-group").forEach((group) => {
            setInterval(() => {
                group.classList.remove("active");
            }, 1000);
        });

        // Toggle the current popover
        popoverGroup.classList.toggle("active");
    });
});

// Close popovers when clicking outside
document.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const searchSrc = params.get('src');
    navigator.clipboard.writeText(searchSrc);
});

download.addEventListener("click", async () => {
    console.log("download");
    const params = new URLSearchParams(window.location.search);
    const searchSrc = params.get('src');
    const image = await fetch(searchSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = searchSrc.split("/").pop()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
})

back.addEventListener("click", () => {
    window.history.back();
});
