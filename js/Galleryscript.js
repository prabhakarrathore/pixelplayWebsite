const ApiKey = "44062922-cd468afa0b651c957755954fe";
const paginationElement = document.getElementById("pagination");

async function getPhotos(value, page) {
    const listContainers = document.getElementById("minibox");
    listContainers.innerHTML = "";
    page = localStorage.getItem("currentPage");
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${ApiKey}&q=${value}&image_type=all&pretty=true&per_page=75&page=${page}`);
        const data = await response.json();

        if (data.hits.length === 0) {
            listContainers.textContent = "No results found.";
            listContainers.style.color = "red";
            listContainers.style.fontWeight = "bold";
            listContainers.style.textAlign = "center";
            listContainers.style.display = "flex";
            listContainers.style.justifyContent = "center";
            listContainers.style.alignItems = "center";
            paginationElement.style.display = "none";
            return;
        }
        if (data.hits.length < 75) {
            localStorage.setItem("currentPage", 1);
            paginationElement.style.display = "none";
        }
        data.hits.forEach(image => {
            const img = document.createElement("img");
            img.src = image.webformatURL;
            img.alt = image.tags;
            img.loading = "lazy";
            img.addEventListener("click", () => {
                window.location.href = `image.html?src=${image.largeImageURL}&search=${encodeURIComponent(value)}`;
            });
            listContainers.appendChild(img);
        });
    } catch (error) {
        window.location.href = `/404.html`;
    }
}

// Search Bar Functionality
const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", async () => {
    const inputValue = searchBar.value.trim().toLowerCase();
    const data = await fetchTags(inputValue);
    const results = data.filter(item => item.toLowerCase().includes(inputValue));
    displayResults(results);
});

// Trigger search when Enter is pressed
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const inputValue = searchBar.value.trim();
        localStorage.setItem("currentPage", 1);
        getPhotos(inputValue, currentPage);
        window.location.href = `gallery.html?search=${encodeURIComponent(inputValue)}`;
    }
});

async function fetchTags(value) {
    const response = await fetch(`https://pixabay.com/api/?key=${ApiKey}&q=${value}&image_type=photo&pretty=true&per_page=200`);
    const data = await response.json();
    // Use unique tags from the API
    return [...new Set(data.hits.flatMap(image => image.tags.split(",").map(tag => tag.trim())))];
}

function displayResults(results) {
    const resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
        results.forEach(result => {
            const p = document.createElement("p");
            p.textContent = result;
            p.addEventListener("click", () => {
                // Use the clicked word as the new input value
                searchBar.value = result;
                window.location.href = `gallery.html?search=${encodeURIComponent(result)}`;
                resultsDiv.innerHTML = ""; // Clear suggestions
            });
            resultsDiv.appendChild(p);
        });
    } else {
        resultsDiv.innerHTML = "<p>No results found</p>";
    }
}


// Fetch images when the search term is in the URL
function getSearchTerm() {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('search');
    searchBar.value = searchTerm;
    console.log(searchBar.value);
    if (searchTerm) {
        getPhotos(searchTerm, currentPage);
    } else {
        window.location.href = "/index.html";
    }
}
window.onload = getSearchTerm;

window.onscroll = () => {
    const back = document.getElementById("back");
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        back.style.display = "flex";
    }
    else {
        back.style.display = "none";
    }
}

// hamburger
const navList = document.querySelector(".nav-list");
const hammenu = document.getElementById("hammenu");
const closemenu = document.getElementById("closemenu");
var x = window.matchMedia("(max-width: 768px)")

hammenu.addEventListener("click", () => {
    navList.style.display = "flex"
})
closemenu.addEventListener("click", () => {
    navList.style.display = "none"
})

x.addEventListener("change", function () {
    if (x.matches) {
        navList.style.display = "none"
    }
    else {
        navList.style.display = "flex"
    }
});

// pagination
const totalPages = Math.ceil(500 / 75);
let currentPage = 1;

// Render pagination buttons
function renderPagination() {
    paginationElement.innerHTML = ""; // Clear existing buttons

    if (currentPage > 3) {
        paginationElement.appendChild(createButton(1)); // First page
        if (currentPage > 4) {
            paginationElement.appendChild(createEllipsis()); // Ellipsis
        }
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        paginationElement.appendChild(createButton(i, i === currentPage));
    }

    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            paginationElement.appendChild(createEllipsis()); // Ellipsis
        }
        paginationElement.appendChild(createButton(totalPages)); // Last page
    }
}

// Create a pagination button
function createButton(page, isActive = false) {
    const button = document.createElement("button");
    button.textContent = page;
    button.className = isActive ? "active" : "";
    button.addEventListener("click", () => {
        currentPage = page;
        localStorage.setItem("currentPage", currentPage);
        getPhotos(searchBar.value, currentPage);
        renderPagination();
    });
    return button;
}

// Create an ellipsis element
function createEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    return span;
}

// Initial render
renderPagination();