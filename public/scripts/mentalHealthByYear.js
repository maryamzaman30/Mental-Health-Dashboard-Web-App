//Original code written by me
// Get the 2D context of the canvas element with the id mentalHealthYearChart
// The context is required to render the chart on the canvas
const ctx = document.getElementById('mentalHealthYearChart').getContext('2d');

// Variable to store the Chart instance, allowing us to destroy the previous chart when rendering a new one
let chart;

// Function to populate the dropdown with mental health issue options
function populateDropdown() 
{
    // Fetch the list of mental health issues from the server
    fetch('/api/mental-health-issues')
        .then(response => response.json()) // Parse the response as JSON
        .then(issues => {
            // Get the dropdown element with the id 'issueDropdown'
            const dropdown = document.getElementById('issueDropdown');

            // Loop through each course in the courses array & create an <option> element for the dropdown
            issues.forEach(issue => {
                const option = document.createElement('option'); // Create a new <option> element
                option.value = issue; // Set the value of the option to be the issue
                option.textContent = issue; // Set the text content of the option to the issue name
                dropdown.appendChild(option); // Append the option to the dropdown
            });

            // Automatically fetch & render data for the first issue in the list
            fetchAndRender(issues[0]);
        });
}

// Function to fetch & render data for a specific mental health issue
function fetchAndRender(issue) 
{
    // Fetch the mental health data from the server based on the selected issue
    fetch(`/api/mental-health-by-year?issue=${issue}`)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Extract the years (labels) from the response data
            const labels = Object.keys(data.data); // Get the years of study from the data object
            // Extract the number of students for each year (values)
            const values = Object.values(data.data); // Get the number of students with the issue for each year

            // Destroy the old chart if it exists (This helps to switch between graphs via dropdown)
            if (chart) chart.destroy();

            // Create a new Chart instance to display the data
            chart = new Chart(ctx, {
                type: 'bar', // Set the chart type to bar
                // Set the chart data
                data: {
                    labels, // Set the x-axis labels to be the years of study
                    datasets: [
                        {
                            // Define the dataset for the mental health issue
                            label: `Number of Students with ${data.issue}`, // Dataset label
                            data: values, // Dataset values (number of students for each year)
                            backgroundColor: 'rgba(255, 99, 132, 0.6)', // background color for the bars
                            borderColor: 'rgba(255, 99, 132, 1)', // border color for the bars
                            borderWidth: 1 // border width for the bars
                        }
                    ]
                },
                // Configure the chart options
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: `Prevalence of ${data.issue} by Year of Study` // Set the title text
                        }
                    },
                    scales: {
                        // Configure the x-axis (representing the years of study)
                        x: {
                            title: {
                                display: true, // Display the title for the x-axis
                                text: 'Year of Study' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis (representing the number of students)
                        y: {
                            title: {
                                display: true, // Display the title for the y-axis
                                text: 'Number of Students' // Set the title text for the y-axis
                            }
                        }
                    }
                }
            });
        });
}

// Event listener for changes in the dropdown (with id issueDropdown)
// When the user selects a different mental health issue, the chart will update with new data
document.getElementById('issueDropdown').addEventListener('change', (event) => {
    // Call fetchAndRender with the selected issue from the dropdown
    fetchAndRender(event.target.value);
});

// Populate the dropdown with options and fetch initial data on page load
populateDropdown();
