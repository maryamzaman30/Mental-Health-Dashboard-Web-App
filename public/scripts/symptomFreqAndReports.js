//Original code written by me
// Get the 2D context of the canvas element with the id symptomBar
// The context is required to render the chart on the canvas
const ctx = document.getElementById('symptomBar').getContext('2d');

// Variable to store the Chart instance, allowing us to destroy the previous chart when rendering a new one
let chart;
    document.addEventListener('DOMContentLoaded', () => {
        const dropdown = document.getElementById('symptomDropdown');
        dropdown.addEventListener('change', event => {
            console.log('Selected:', event.target.value);
        });
    });
// Function to populate the dropdown with symptom types from the server
function populateDropdown() 
{
    // Fetch the list of symptom types from the server
    fetch('/api/symptom-types')
        .then(response => response.json()) // Parse the response as JSON
        .then(symptoms => {
            // Get the dropdown element with the id symptomDropdown
            const dropdown = document.getElementById('symptomDropdown');
            
            // For each symptom type received from the server, create an <option> element and add it to the dropdown
            symptoms.forEach(symptom => {
                const option = document.createElement('option'); // Create a new <option> element
                option.value = symptom; // Set the value of the option to the symptom type
                option.textContent = symptom; // Set the text content of the option to the symptom type
                dropdown.appendChild(option); // Append the option to the dropdown
            });

            // Automatically fetch & render data for the first symptom type in the list
            if (symptoms.length > 0) 
            {
                fetchAndRender(symptoms[0]);
            }
        });
}

// Function to fetch & render data for the selected symptom
function fetchAndRender(symptom) 
{
    // Fetch the frequency data for the selected symptom type from the server
    fetch(`/api/symptom-frequency?symptom=${symptom}`)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            // Destructure the frequency and reports from the response data
            const { frequency, reports } = data.data;

            // Destroy the old chart if it exists to avoid overlaying multiple charts
            if (chart) chart.destroy();

            // Create a new bar chart with the data
            chart = new Chart(ctx, {
                type: 'bar', // Set the chart type to bar
                data: {
                    labels: frequency, // Set the x-axis labels to represent the frequency of symptoms
                    datasets: [
                        {
                            label: `Reports for ${data.symptom}`, // Set the label for the dataset
                            data: reports, // Set the y-axis data (the number of reports for each frequency)
                            backgroundColor: 'rgba(255, 99, 132)', // background color for the bars
                            borderColor: 'rgba(255, 99, 132, 1)', // border color of the bars
                            borderWidth: 1  // border width of the bars
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true, // Set to true to display the chart title
                            text: `Frequency of ${data.symptom} Symptoms in the Last 7 Days` // Dynamically set the title
                        },
                    },
                    scales: {
                        // Configure the x-axis (representing symptom frequency)
                        x: {
                            title: {
                                display: true, // Display the title for the x-axis
                                text: 'Symptom Frequency (Last 7 Days)' // Set the title text for the x-axis
                            }
                        },
                        // Configure the y-axis (representing the number of reports)
                        y: {
                            title: {
                                display: true, // Display the title for the y-axis
                                text: 'Number of Reports' // Set the title text for the y-axis
                            },
                            beginAtZero: true // Ensure the y-axis starts from zero
                        }
                    }
                }
            });
        });
}

// Event listener for changes in the dropdown menu (with id symptomDropdown)
// When the user selects a different symptom type from the dropdown, the chart will be updated accordingly
document.getElementById('symptomDropdown').addEventListener('change', (event) => {
    // Fetch and render the data for the selected symptom
    fetchAndRender(event.target.value);
});

// Populate the dropdown and fetch data for the first symptom type on page load
populateDropdown();