//Original code written by me
// Get the 2D context of the canvas element with the id sleepTreatmentChart
// The context is required to render the chart on the canvas
const ctx = document.getElementById('sleepTreatmentChart').getContext('2d');

// Variable to store the Chart instance, allowing us to destroy the previous chart when rendering a new one
let chart;

// Function to populate the dropdown with course options
function populateDropdown() 
{
    // Fetch the list of courses from the server
    fetch('/api/courses')
        .then(response => response.json()) // Parse the response as JSON
        .then(courses => {
            // Get the dropdown element with the id courseDropdown
            const dropdown = document.getElementById('courseDropdown');
            dropdown.innerHTML = ''; // Clear existing options in the dropdown before adding new ones

            // Loop through each course in the courses array & create an <option> element for the dropdown
            courses.forEach(course => {
                const option = document.createElement('option'); // Create a new <option> element
                option.value = course; // Set the value of the option to the course name
                option.textContent = course; // Set the text content of the option to the course name
                dropdown.appendChild(option); // Append the option to the dropdown
            });

            // Automatically fetch & render data for the first course if the list is not empty
            if (courses.length > 0) 
            {
                fetchAndRender(courses[0]);
            }
        });
}

// Function to fetch & render data for the selected course
function fetchAndRender(course) 
{
    // Fetch the data related to sleep quality & specialist treatment for the selected course
    fetch(`/api/sleep-treatment-by-course?course=${course}`)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Destructure the sleep quality & treatment frequency from the response data
            const { sleepQuality, treatmentFrequency } = data.data;

            // Destroy the old chart if it exists (This helps to switch between graphs via dropdown)
            if (chart) chart.destroy();

            // Create a new Chart instance to display the data
            chart = new Chart(ctx, {
                type: 'line', // Set the chart type to line
                data: {
                    labels: sleepQuality, // Set the x-axis labels to the sleep quality values
                    datasets: [
                        {
                            // Define the dataset for the chart
                            label: `Specialist Treatment Frequency for ${data.course}`, // Set the dataset label
                            data: treatmentFrequency, // Set the y-axis data (frequency of specialist treatment)
                            borderColor: 'rgba(75, 192, 192, 1)', // Set the line color
                            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set the fill color below the line (for area chart effect)
                            borderWidth: 2, // line width
                            tension: 0.3 // Set the curve tension (smoothness of the line)
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: `Impact of Sleep Quality on Specialist Treatment for ${data.course}` // Dynamically set the title
                        }
                    },
                    scales: {
                        // Configure the x-axis (representing the sleep quality)
                        x: {
                            title: {
                                display: true, // Display the title for the x-axis
                                text: 'Sleep Quality' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis (representing the frequency of specialist treatment)
                        y: {
                            title: {
                                display: true, // Display the title for the y-axis
                                text: 'Frequency of Specialist Treatment' // Set the title text for the y-axis
                            }
                        }
                    }
                }
            });
        });
}

// Event listener for changes in the dropdown (with id courseDropdown)
// When the user selects a different course, the chart will update accordingly
document.getElementById('courseDropdown').addEventListener('change', (event) => {
    // Call fetchAndRender with the selected course from the dropdown
    fetchAndRender(event.target.value);
});

// Populate the dropdown with course options & render initial data on page load
populateDropdown();