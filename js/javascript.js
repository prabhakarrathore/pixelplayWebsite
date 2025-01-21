const ApiKey = "44062922-cd468afa0b651c957755954fe";

// Define a list of available pages
const validPages = ["index.", "about", "contact"];

// Function to check the page and redirect if necessary
function handlePageRouting() {
    // Extract the page from the URL (e.g., /about or /contact)
    const path = window.location.pathname.replace("/", "");

    // Check if the requested page exists in the list of valid pages
    if (!validPages.includes(path)) {
        // Redirect to 404 page if the page does not exist
        window.location.href = "/404.html";
    }
}

// Call the function when the script loads
handlePageRouting();


async function getPhotos() {
    const listContainers = document.getElementById("minibox");
    listContainers.innerHTML = "";

    try {
        const response = await fetch(`https://pixabay.com/api/?key=${ApiKey}&image_type=all&pretty=true&per_page=30&editors_choice=true`);
        const data = await response.json();

        if (data.hits.length === 0) {
            listContainers.textContent = "No results found.";
            listContainers.style.color = "red";
            listContainers.style.fontWeight = "bold";
            listContainers.style.textAlign = "center";
            listContainers.style.display = "flex";
            listContainers.style.justifyContent = "center";
            listContainers.style.alignItems = "center";
            return;
        }

        data.hits.forEach(image => {
            const img = document.createElement("img");
            img.src = image.webformatURL;
            img.alt = image.tags;
            img.loading = "lazy";
            img.addEventListener("click", () => {
                window.location.href = `image.html?src=${image.largeImageURL}&search=${image.tags}`;
            });
            listContainers.appendChild(img);
        });
    } catch (error) {
        window.location.href = `/404.html`;
    }
}

getPhotos();


// Search Bar Functionality
const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", async () => {
    const inputValue = searchBar.value.trim().toLowerCase();
    const data = await fetchTags(inputValue);
    const results = data.filter(item => item.toLowerCase().includes(inputValue));
    displayResults(results);
});

// // Trigger search when Enter is pressed, regardless of results
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const inputValue = searchBar.value;
        if (inputValue) {
            localStorage.setItem("currentPage", 1);
            window.location.href = `gallery.html?search=${encodeURIComponent(inputValue)}`;
        }
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

/// Scroll to top button

window.onscroll = () => {
    const back = document.getElementById("back");
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        back.style.display = "flex";
    }
    else {
        back.style.display = "none";
    }
}


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


// slider 
async function fetchImages() {
    const response = await fetch(`https://pixabay.com/api/?key=${ApiKey}&editors_choice=true&image_type=photo&pretty=true&per_page=200`);
    const data = await response.json();
    return data.hits.map(image => [image.largeImageURL, image.imageHeight]);
}

// Function to change the image on the slider
async function startSlider() {
    const images = await fetchImages();
    if (!images[0] || images[0].length === 0) {
        console.error("No images available for the slider.");
        return;
    }

    let currentIndex = parseInt(localStorage.getItem("currentIndex")) || 0;

    // Get the image element
    const sliderImage = document.getElementById('sliderImage');
    if (!sliderImage) {
        console.error("Slider image element not found.");
        return;
    }

    // Set the first image based on the current index
    sliderImage.src = images[currentIndex][0];

    const updateImage = () => {
        currentIndex = (currentIndex + 1) % images.length;
        if (images[currentIndex][1] < 2400) {
            sliderImage.src = images[currentIndex][0];
            localStorage.setItem("currentIndex", currentIndex);

            setTimeout(updateImage, 5000);
        } else {
            updateImage();
        }
    };
    updateImage();
}

// Start the image slider
startSlider();