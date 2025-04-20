/* I mostly required help in JS code since, this is what I worked on the most
● Chart.js Documentation - https://www.chartjs.org/docs/latest/
● Chart.js Examples - https://www.chartjs.org/docs/latest/samples/information.html
I took help in first 3 JS code then the rest I did it my self
*/

// Get the 2D context of the canvas element with the id engagementStressBarChart
// The context is required to render the chart on the canvas
const ctx = document.getElementById('engagementStressBarChart').getContext('2d');

// Function to fetch data from the server & render the chart
function fetchAndRender() 
{
    // Fetch the data from the server's API endpoint /api/avg-engagement-stress
    fetch('/api/avg-engagement-stress')
        .then(response => response.json()) // Parse the JSON response from the server
        .then(data => { // Once data is received, proceed with rendering the chart
            // Prepare the chart data
            const chartData = {
                // 'labels' are the categories for the x-axis (Mental Health Support status)
                labels: data.supportStatus,  
                datasets: [
                    {
                        // Data for Average Engagement
                        label: 'Average Engagement', // The label for the first dataset part
                        data: data.avgEngagement, // The actual data for average engagement
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for the bars
                        borderColor: 'rgba(75, 192, 192, 1)', // Border color for the bars
                        borderWidth: 1 // Width of the bar border
                    },
                    {
                        // Data for Average Stress
                        label: 'Average Stress', // The label for the second dataset part
                        data: data.avgStress, // The actual data for average stress
                        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for the stress bars
                        borderColor: 'rgba(255, 99, 132, 1)', // Border color for the stress bars
                        borderWidth: 1 // Width of the stress bar border
                    }
                ]
            };

            // Create the bar chart using the Chart constructor
            new Chart(ctx, {
                type: 'bar', // Set the chart type to bar
                data: chartData, // Set the data for the chart (the chartData object prepared above)
                // Configure the chart options
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: 'Average Engagement and Stress by Mental Health Support' // Set the title text
                        },    
                    },
                    // Configure the axes
                    scales: {
                        // Configure the x-axis (Mental Health Support Status)
                        x: {
                            title: {
                                display: true, // Show the title for the x-axis
                                text: 'Mental Health Support Status' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis (Average Score)
                        y: {
                            title: {
                                display: true, // Show the title for the y-axis
                                text: 'Average Score' // Set the title text for the y-axis
                            },
                            beginAtZero: true // Ensure the y-axis starts from zero
                        }
                    }
                }
            });
        });
}

// Fetch and render the data when the page loads by calling the fetchAndRender function
fetchAndRender();