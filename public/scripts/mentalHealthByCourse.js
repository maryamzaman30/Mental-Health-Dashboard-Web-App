/* I mostly required help in JS code since, this is what I worked on the most
● Chart.js Documentation - https://www.chartjs.org/docs/latest/
● Chart.js Examples - https://www.chartjs.org/docs/latest/samples/information.html
*/

// Get the 2D context of the canvas element with the id specialistTreatmentChart
// The context is required to render the chart on the canvas
const ctx = document.getElementById('specialistTreatmentChart').getContext('2d');

// Variable to store the Chart instance. This will allow us to destroy the previous chart when rendering a new one
let chart;

// Function to populate the dropdown with courses
function populateDropdown() 
{
    // Fetch the list of courses from the server's API endpoint /api/courses
    fetch('/api/courses')
        .then(response => response.json()) // Parse the response as JSON
        .then(courses => {
            // Get the dropdown element by its ID courseDropdown
            const dropdown = document.getElementById('courseDropdown');
            
            // Loop through each course in the courses array and create an <option> element for the dropdown
            courses.forEach(course => {
                const option = document.createElement('option'); // Create a new <option> element
                option.value = course; // Set the value of the option to the course name
                option.textContent = course; // Set the displayed text of the option to the course name
                dropdown.appendChild(option); // Add the option to the dropdown list
            });

            // Automatically fetch & render data for the first course in the list
            fetchAndRender(courses[0]);
        });
}

// Function to fetch & render data based on the selected course
function fetchAndRender(course) 
{
    // Fetch the specialist treatment data for the selected course
    fetch(`/api/specialist-treatment-by-course?course=${course}`)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Labels for the chart's x-axis: "No" & "Yes" for the treatment status
            const labels = ['No', 'Yes'];
            // Data for the chart: Number of students who answered "No" & "Yes"
            const treatmentData = [data.data.No, data.data.Yes];

            // Destroy the old chart (if it exists) before creating a new one (This helps to switch between graphs via dropdown)
            if (chart) chart.destroy();

            // Create a new Chart instance to display the data
            chart = new Chart(ctx, {
                type: 'bar', // Set the chart type to bar
                // Set the chart data, including labels & dataset
                data: {
                    labels, // x-axis labels ("No" & "Yes")
                    datasets: [
                        {
                            // Dataset for specialist treatment data
                            label: `Specialist Treatment for ${data.course}`, // Label for the dataset
                            data: treatmentData, // Data for the "No" & "Yes" answers
                            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(144,238,144, 0.6)'], // background color for each bar
                            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(144,238,144, 1)'], // border color for each bar
                            borderWidth: 1 // Set the border width for the bars
                        }
                    ]
                },
                // Configure the chart options
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: `Specialist Treatment for Course: ${data.course}` // Set the title text
                        }
                    },
                    scales: {
                        // Configure the x-axis
                        x: {
                            title: {
                                display: true, // Display the title for the x-axis
                                text: 'Specialist Treatment Status' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis
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

// Add an event listener to the dropdown to listen for changes
// When the user selects a different course, the chart will update accordingly
document.getElementById('courseDropdown').addEventListener('change', (event) => {
    // Call fetchAndRender with the new course selected from the dropdown
    fetchAndRender(event.target.value);
});

// Call the populateDropdown function on page load to populate the dropdown with courses
populateDropdown();