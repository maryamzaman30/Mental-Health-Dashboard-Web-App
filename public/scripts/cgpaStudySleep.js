/* I mostly required help in JS code since, this is what I worked on the most
● Chart.js Documentation - https://www.chartjs.org/docs/latest/
● Chart.js Examples - https://www.chartjs.org/docs/latest/samples/information.html
*/

// Get the 2D context of the canvas element with the id cgpaBubbleChart
// The context is required to render the chart on the canvas
const ctx = document.getElementById('cgpaBubbleChart').getContext('2d');

// Function to fetch data from the server & render the chart
function fetchAndRender() 
{
    // Fetch data from the server's API endpoint /api/cgpa-study-sleep
    fetch('/api/cgpa-study-sleep')
        .then(response => response.json()) // Parse the JSON response from the server
        .then(data => { // Once data is received, proceed with rendering the chart
            // Prepare the chart data
            const chartData = {
                datasets: [
                    {
                        label: 'Students', // Label for the dataset, which will appear in the legend
                        data: data, // The data property contains the actual data for the bubble chart
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // background color for the bubbles
                        borderColor: 'rgb(255, 0, 166, 0.6)', // border color for the bubbles
                        borderWidth: 1 // width of the border for the bubbles
                    }
                ]
            };

            // Create a new bubble chart using the Chart constructor
            new Chart(ctx, {
                type: 'bubble', // Set the chart type to bubble
                data: chartData, // Set the data for the chart (the 'chartData' object prepared above)
                // Configure the chart options
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: 'Relationship Between CGPA, Study Hours, and Sleep Quality' // Set the title text
                        },
                        // Customise defualt tooltip
                        tooltip: {
                            // Callback function to customize the tooltip label
                            callbacks: {
                                // Format the tooltip label to display CGPA (x-axis), Study Hours (y-axis) & Sleep Quality (size 'r')
                                label: (tooltipItem) => 
                                    `CGPA: ${tooltipItem.raw.x}, Study Hours: ${tooltipItem.raw.y}, Sleep Quality: ${tooltipItem.raw.r}`
                            }
                        }
                    },
                    // Configure the axes
                    scales: {
                        // Configure the x-axis (CGPA)
                        x: {
                            title: {
                                display: true, // Show the title for the x-axis
                                text: 'CGPA' // Set the title text for the x-axis
                            },
                            beginAtZero: true // Ensure the x-axis begins at zero
                        },
                        // Configure the y-axis (Study Hours per Week)
                        y: {
                            title: {
                                display: true, // Show the title for the y-axis
                                text: 'Study Hours Per Week' // Set the title text for the y-axis
                            },
                            beginAtZero: true // Ensure the y-axis begins at zero
                        }
                    }
                }
            });
        });
}

// Fetch and render the data when the page loads by calling the fetchAndRender function
fetchAndRender();