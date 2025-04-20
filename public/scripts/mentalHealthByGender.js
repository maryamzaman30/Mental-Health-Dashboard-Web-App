//Original code written by me
// Get the 2D context of the canvas element with the id 'mentalHealthChart'
// The context is required to render the chart on the canvas
const ctx = document.getElementById('mentalHealthChart').getContext('2d');

// Variable to store the Chart instance. This will allow us to destroy the previous chart when rendering a new one
let chart;

// Function to fetch & render data for a specific mental health problem
function fetchAndRender(problem) 
{
    // Fetch the mental health data for the selected problem (e.g., "Depression") from the server
    fetch(`/api/mental-health-by-gender?problem=${problem}`)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Labels for the chart's x-axis: "Male" & "Female" genders
            const labels = ['Male', 'Female'];

            // Data for the chart: Number of students who answered "Yes" & "No" for the mental health problem
            const yesData = [data.data.Male.Yes, data.data.Female.Yes];
            const noData = [data.data.Male.No, data.data.Female.No];

            // Destroy the old chart if it exists (This helps to switch between graphs via dropdown)
            if (chart) chart.destroy();

            // Create a new Chart instance
            chart = new Chart(ctx, {
                type: 'bar', // Set the chart type to bar
                data: { // Set the chart data, including labels & datasets
                    labels, // x-axis labels ("Male" & "Female")
                    datasets: [
                        {
                            // Dataset for "Yes" responses (indicating the presence of the problem)
                            label: 'Yes', // Label for this dataset
                            data: yesData, // Data for the "Yes" responses (how many males & females reported the problem)
                            backgroundColor: 'rgba(255, 99, 132, 0.6)', // background color for each bar (for "Yes")
                            borderColor: 'rgba(255, 99, 132, 1)', // border color for each bar (for "Yes")
                            borderWidth: 1 // border width for the bars
                        },
                        {
                            // Dataset for "No" responses (indicating the absence of the problem)
                            label: 'No', // Label for this dataset
                            data: noData, // Data for the "No" responses (how many males and females did not report the problem)
                            backgroundColor: 'rgba(144,238,144,0.6)', // background color for each bar (for "No")
                            borderColor: 'rgba(144,238,144, 1)', // border color for each bar (for "No")
                            borderWidth: 1 // border width for the bars
                        }
                    ]
                },
                // Configure the chart options
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: `Mental Health Problem: ${data.problem}` // Set the title text
                        }
                    },
                    scales: {
                        // Configure the x-axis (representing gender)
                        x: {
                            title: {
                                display: true, // Display the title for the x-axis
                                text: 'Gender' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis (representing the number of students)
                        y: {
                            title: {
                                display: true, // Display the title for the y-axis
                                text: 'Count of Students' // Set the title text for the y-axis
                            }
                        }
                    }
                }
            });
        });
}

// Initial render of the chart with the default mental health problem ("Depression")
fetchAndRender('Depression');

// Add an event listener to the dropdown (with id mentalHealthProblem) to listen for changes
// When the user selects a different problem from the dropdown, the chart will be updated with new data
document.getElementById('mentalHealthProblem').addEventListener('change', (event) => {
    // Call the fetchAndRender function with the selected problem
    fetchAndRender(event.target.value);
});