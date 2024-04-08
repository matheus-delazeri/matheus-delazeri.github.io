// Function to fetch commits for a specific repository with pagination
function requestCommits(username, repoName, page = 1, perPage = 10) {
    return fetch(`https://api.github.com/repos/${username}/${repoName}/commits?page=${page}&per_page=${perPage}`);
}

// Function to display commits with pagination
function displayCommits(username, repoName, page = 1) {
    const commitsContainer = document.getElementById('commitsContainer');
    commitsContainer.classList.add('commitsContainer');
    commitsContainer.classList.add('text-center');
    commitsContainer.innerHTML =`
        <p class="commits-title">Commits:</p>
    `; // Clear previous commits

    // Fetch commits
    requestCommits(username, repoName, page)
        .then(response => response.json())
        .then(commits => {
            // Display commits
            commits.forEach(commit => {
                const commitItem = document.createElement('div');
                commitItem.classList.add('commit-item');
                commitItem.classList.add('commitsItemStyle');
                commitItem.innerHTML = `
                    <p><strong>SHA:</strong> ${commit.sha}</p>
                    <p><strong>Author:</strong> ${commit.commit.author.name}</p>
                    <p><strong>Date:</strong> ${commit.commit.author.date}</p>
                    <p><strong>Message:</strong> ${commit.commit.message}</p>
                `;
                commitsContainer.appendChild(commitItem);
            });

            // Display pagination controls
            displayPagination(username, repoName, page);
        })
        .catch(error => {
            console.error('Error fetching commits:', error);
            // Display error message
            commitsContainer.innerHTML = `<p>Error fetching commits. Please try again.</p>`;
        });
}

// Function to display pagination controls
function displayPagination(username, repoName, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous Page';
    prevButton.className = 'pagination-btn';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayCommits(username, repoName, currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next Page';
    nextButton.className = 'pagination-btn'
    nextButton.addEventListener('click', () => {
        displayCommits(username, repoName, currentPage + 1);
    });
    paginationContainer.appendChild(nextButton);
}

// Event listener for form submission
const gitHubForm = document.getElementById('gitHubForm');
gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('usernameInput');
    const repoInput = document.getElementById('repoInput');
    const gitHubUsername = usernameInput.value;
    const repoName = repoInput.value;

    // Display commits for the first page
    displayCommits(gitHubUsername, repoName);
});
