//Original code written by me
// Import necessary modules
const express = require('express');
const router = express.Router(); // Router to handle HTTP requests
const db = require('../config/db'); // Database connection

// For query-results ==============================================================================================

// Get all students
// Define a GET route to handle requests to the '/students' URL path
router.get('/students', (req, res) => {
    const query = 'SELECT * FROM Student'; // SQL query to select all records from the Student table
    
    // Execute the query on the database
    db.query(query, (err, results) => {
      
        // If there's an error executing the query, return a 500 error with the error details in JSON format
      if (err) return res.status(500).json(err);
      
      // If the query is successful, render a view (ejs) named query-results with the following data:
      res.render('query-results', {
        title: 'Students Records', // Set the title of the view to Students Records
        results, // Pass the results of the query to the view as the results variable
        issue: null, // Set issue to null, indicating there are no issues to display in this case
        showDropdown: false, // Set showDropdown to false, meaning that the dropdown menu will NOT be rendered in the view
      });
    });
  });
  
// Get students filtered by mental health issue
// Define a GET route to handle requests to '/students-by-issue' URL path
router.get('/students-by-issue', (req, res) => {
  
    // Get the issue query parameter from the request URL
    const issue = req.query.issue || 'Depression'; // Default to Depression if no issue is selected
  
    // Define a list of valid mental health issues that can be queried in the database
    const validIssues = ['Depression', 'Anxiety', 'PanicAttack'];
  
    // Validate the issue query parameter to ensure it is one of the valid issues
    if (!validIssues.includes(issue)) 
    {
      // If the issue is not valid, return a 400 status code with an error message in JSON format
      return res.status(400).json({ error: 'Invalid mental health issue selected.' });
    }
  
    // Define the SQL query string to select student data with the chosen mental health issue
    const query = `
      SELECT Student.*, MentalHealth.${issue}
      FROM Student
      JOIN MentalHealth ON Student.StudentID = MentalHealth.StudentID
      WHERE MentalHealth.${issue} = 1;
    `;
    
    // Execute the SQL query on the database
    db.query(query, (err, results) => {
      
      // If there's an error executing the query, return a 500 status code with the error details
      if (err) return res.status(500).json(err);
  
      // If the query is successful, render the query-results view with the following data:
      res.render('query-results', {
        title: 'Students with Mental Health Issues Records', // Set the title of the view
        results, // Pass the query results (list of students) to the view as results
        issue, // Pass the selected issue to the view so it can be displayed or used within the template
        showDropdown: true, // Indicate that the dropdown for selecting a mental health issue should be shown on the page
        mentalHealthIssues: validIssues, // Pass the valid list of mental health issues to the view as mentalHealthIssues
      });
    });
  });
  

// Correlation between CGPA & Mental Health issues
// Define a GET route to handle requests to /cgpa-mental-health URL path
router.get('/cgpa-mental-health', (req, res) => {

  // Define the SQL query to fetch CGPA & mental health issues (Depression, Anxiety, PanicAttack) for all students
  const query = `
    SELECT Student.CGPA, MentalHealth.Depression, MentalHealth.Anxiety, MentalHealth.PanicAttack
    FROM Student
    JOIN MentalHealth ON Student.StudentID = MentalHealth.StudentID;
  `;

  // Execute the SQL query on the database
  db.query(query, (err, results) => {

    // If there's an error executing the query, throw the error
    if (err) throw err;
  
    // If the query is successful, render the query-results view with the following data:
    res.render('query-results', {
        title: 'Correlation Between CGPA and Mental Health Issues', // Set the title of the VIEW
        results, // Pass the query results (CGPA & mental health data)
        issue: null, // Set issue to null, meaning no specific issue is being filtered
      showDropdown: false, // Set showDropdown to false, meaning that the dropdown menu will NOT be rendered in the view
    });
  });
});

// For statistics ===================================================================================================

// Define a GET route to handle requests to /statistics URL path
router.get('/statistics', async (req, res) => {
  
    // Array of SQL queries that retrieve various statistics from the database
    const queries = [
      "SELECT COUNT(*) AS TotalStudents FROM Student;", // Get total number of students
      "SELECT AVG(CGPA) AS AvgCGPA FROM Student;", // Get average CGPA of students
      "SELECT AVG(Age) AS AvgAge FROM Student;", // Get average age of students
      "SELECT COUNT(*) AS TotalDepressionCases FROM MentalHealth WHERE Depression = 1;", // Get total number of depression cases
      "SELECT COUNT(*) AS TotalAnxietyCases FROM MentalHealth WHERE Anxiety = 1;", // Get total number of anxiety cases
      "SELECT COUNT(*) AS TotalPanicAttackCases FROM MentalHealth WHERE PanicAttack = 1;", // Get total number of panic attack cases
      "SELECT AVG(SleepQuality) AS AvgSleepQuality FROM Lifestyle;", // Get average sleep quality of students
      "SELECT AVG(StudyStressLevel) AS AvgStudyStressLevel FROM Lifestyle;", // Get average study stress level of students
      "SELECT AVG(StudyHoursPerWeek) AS AvgStudyHoursPerWeek FROM Lifestyle;", // Get average study hours per week
      "SELECT AVG(AcademicEngagement) AS AvgAcademicEngagement FROM Lifestyle;", // Get average academic engagement
      "SELECT Gender, COUNT(*) AS Total FROM Student GROUP BY Gender;", // Get total number of students by gender
      "SELECT Course, COUNT(*) AS Total FROM Student GROUP BY Course;", // Get total number of students by course
      "SELECT YearOfStudy, COUNT(*) AS Total FROM Student GROUP BY YearOfStudy;", // Get total number of students by year of study
      "SELECT SpecialistTreatment, COUNT(*) AS Total FROM MentalHealth GROUP BY SpecialistTreatment;", // Get number of students receiving specialist treatment
      "SELECT HasMentalHealthSupport, COUNT(*) AS Total FROM MentalHealth GROUP BY HasMentalHealthSupport;", // Get number of students with mental health support
      "SELECT AVG(SymptomFrequency_Last7Days) AS AvgSymptomFrequency FROM MentalHealth;", // Get average symptom frequency over the last 7 days
      "SELECT Course, AVG(CGPA) AS AvgCGPA FROM Student GROUP BY Course;", // Get average CGPA by course
      "SELECT Course, AVG(SleepQuality) AS AvgSleepQuality FROM Student JOIN Lifestyle ON Student.StudentID = Lifestyle.StudentID GROUP BY Course;", // Get average sleep quality by course
      "SELECT Course, AVG(StudyStressLevel) AS AvgStudyStress FROM Student JOIN Lifestyle ON Student.StudentID = Lifestyle.StudentID GROUP BY Course;", // Get average study stress by course
      "SELECT YearOfStudy, AVG(StudyStressLevel) AS AvgStressByYear FROM Student JOIN Lifestyle ON Student.StudentID = Lifestyle.StudentID GROUP BY YearOfStudy;" // Get average study stress by year of study
    ];
  
    // Initialize an empty object to hold the statistics results
    const statistics = {};
  
    try 
    {
      // Loop through all the SQL queries & execute them sequentially
      for (let i = 0; i < queries.length; i++) 
    {
        
        // Use an asynchronous function (Promise) to wait for each query to finish
        await new Promise((resolve, reject) => {
          
          // Execute the SQL query
          db.query(queries[i], (err, result) => {
            
            if (err) return reject(err); // If an error occurs in the query, reject the promise with the error
            statistics[`stat${i + 1}`] = result; // Store the query result in the statistics object using a dynamic key
            
            resolve(); // Resolve the promise when the query is complete
          });
        });
      }
  
      // Once all queries have been processed, render the statistics view with the statistics object
      res.render('statistics', { statistics });
  
    } 
    catch (error) 
    {
      // If any error occurs during the execution of the queries, log the error & send a 500 response
      console.error(error);
      res.status(500).send('An error occurred while fetching statistics.');
    }
  });
  
// For mental-health-by-gender =======================================================================================

// Define a GET route to handle requests to /mental-health-by-gender URL path
router.get('/mental-health-by-gender', (req, res) => {
  
    // Retrieve the problem query parameter from the request. 
    const problem = req.query.problem || 'Depression'; // If no problem is specified, Default to Depression
    
    // Define the SQL query to retrieve the count of students by gender & the selected mental health problem
    const query = `
      SELECT 
          Gender,
          ${problem} AS MentalHealthProblem,
          COUNT(*) AS Count
      FROM 
          Student
      JOIN 
          MentalHealth ON Student.StudentID = MentalHealth.StudentID 
      GROUP BY Gender, ${problem}; 
    `;
    
    // Execute the query to fetch the data from the database
    db.query(query, (err, results) => {
      // If an error occurs during the query execution, throw the error 
      if (err) throw err;
  
      // Initialize an object to format the results in a way suitable for visualization
      const data = {
        Male: { Yes: 0, No: 0 }, // Initialize male data for mental health problem Yes & No
        Female: { Yes: 0, No: 0 }, // Initialize female data for mental health problem Yes & No
      };
  
      // Iterate over the results to organize them by gender & mental health problem (Yes/No)
      results.forEach(row => {
        if (row.Gender === 'Male') 
        {
          // If the mental health problem value is 1 (Yes), assign to Yes count, else assign to No count
          if (row.MentalHealthProblem === 1) data.Male.Yes = row.Count;
          else data.Male.No = row.Count;
        } 
        else if (row.Gender === 'Female') 
        {
          // Same logic for female gender
          if (row.MentalHealthProblem === 1) data.Female.Yes = row.Count;
          else data.Female.No = row.Count;
        }
      });
  
      // Send the formatted data as a JSON response, along with the selected problem type
      res.json({ problem, data });
    });
  });
  
// For mental-health-by-course =======================================================================================

// Define a GET route to handle requests to /specialist-treatment-by-course URL path
router.get('/specialist-treatment-by-course', (req, res) => {

  // Retrieve the 'course' query parameter from the request
  const course = req.query.course || 'Biotechnology'; // If no course is specified, default to Biotechnology

  // Define the SQL query to retrieve the count of students by specialist treatment status for the specified course
  const query = `
      SELECT 
          SpecialistTreatment AS TreatmentStatus,
          COUNT(*) AS Count
      FROM 
          Student
      JOIN 
          MentalHealth ON Student.StudentID = MentalHealth.StudentID
      WHERE 
          Course = ?
      GROUP BY 
          SpecialistTreatment;
  `;

  // Execute the SQL query with the provided course as a parameter
  db.query(query, [course], (err, results) => {

      if (err) throw err; // If an error occurs during the query execution, throw the error 

      // Initialize an object to hold the counts of Yes & No for the specialist treatment status
      const data = { Yes: 0, No: 0 };

      // Iterate over the query results to organize the counts by TreatmentStatus (Yes or No)
      results.forEach(row => {
          if (row.TreatmentStatus === 1) 
          {
              data.Yes = row.Count; // If the treatment status is 1 (indicating Yes), assign the count to Yes
          } 
          else 
          {
              data.No = row.Count; // Otherwise, assign the count to No
          }
      });

      // Send the formatted data as a JSON response, including the course name & the treatment data
      res.json({ course, data });
  });
});

// Route to fetch list of all courses for dropdown
// Define a GET route to handle requests to /courses URL path
router.get('/courses', (req, res) => {

  // Define the SQL query to fetch distinct course names from the Student table
  const query = `
      SELECT DISTINCT Course FROM Student ORDER BY Course; 
  `; // Get distinct courses and order them alphabetically

  // Execute the query to fetch the list of courses
  db.query(query, (err, results) => {

      if (err) throw err; // If an error occurs during the query execution, throw the error 
      const courses = results.map(row => row.Course); // Map the results to an array of course names
      res.json(courses); // Send the list of courses as a JSON response
  });
});
  
// For mental-health-by-yaer =======================================================================================

// Handle GET request to /mental-health-by-year route
router.get('/mental-health-by-year', (req, res) => {

  // Get the 'issue' query parameter from the request
  const issue = req.query.issue || 'Depression'; // Default to Depression if not specified

  // Define the SQL query to retrieve the count of students by their year of study who have the selected mental health issue
  const query = `
      SELECT 
          YearOfStudy,
          COUNT(*) AS Count
      FROM 
          Student
      JOIN 
          MentalHealth ON Student.StudentID = MentalHealth.StudentID
      WHERE 
          ${issue} = 1
      GROUP BY 
          YearOfStudy
      ORDER BY 
          YearOfStudy;
  `;

  // Execute the SQL query to fetch the results
  db.query(query, (err, results) => {

      if (err) throw err; // If an error occurs during the query execution, throw the error

      // Initialize an empty object to store the results, where the key is the YearOfStudy & value is the count
      const data = {};

      // Iterate through the results & populate the data object with YearOfStudy as the key & Count as the value
      results.forEach(row => {
          data[row.YearOfStudy] = row.Count;
      });

      // Send the results as a JSON response, including the mental health issue & the data by YearOfStudy
      res.json({ issue, data });
  });
});

// Handle GET request to /mental-health-issues route
router.get('/mental-health-issues', (req, res) => {
  
    // Respond with a JSON array containing the list of available mental health issues for the dropdown
    res.json(['Depression', 'Anxiety', 'PanicAttack']); // List of mental health issues
  });
   
// For avg-engagement-stress =======================================================================================

// Handle GET request to /avg-engagement-stress route
router.get('/avg-engagement-stress', (req, res) => {

    // Define the SQL query to calculate average academic engagement & stress levels,
    // grouped by whether the student has mental health support or not
    const query = `
    SELECT 
        MentalHealth.HasMentalHealthSupport,
        AVG(Lifestyle.AcademicEngagement) AS AvgEngagement,
        AVG(Lifestyle.StudyStressLevel) AS AvgStress
    FROM 
        Lifestyle
    JOIN 
        MentalHealth ON Lifestyle.StudentID = MentalHealth.StudentID
    GROUP BY 
        MentalHealth.HasMentalHealthSupport;
  `;
  
  // Execute the SQL query to fetch the results
  db.query(query, (err, results) => {
    
    if (err) throw err; // If an error occurs during the query execution, throw the error
  
    // Initialize an empty object to store the results for average engagement & stress, grouped by support status
    const data = {
      supportStatus: [], // Array to store support status (e.g., Has Support, No Support)
      avgEngagement: [], // Array to store average engagement levels
      avgStress: [] // Array to store average stress levels
    };
  
    // Iterate over the query results and populate the data object
    results.forEach(row => {
      // Push the appropriate support status (Has Support or No Support) based on the HasMentalHealthSupport value
      data.supportStatus.push(row.HasMentalHealthSupport ? 'Has Support' : 'No Support');
      // Push the average engagement & stress levels into their respective arrays
      data.avgEngagement.push(row.AvgEngagement);
      data.avgStress.push(row.AvgStress);
    });
  
    res.json(data); // Send the populated data object as a JSON response
  });
});
  
// For cgpa-study-sleep ==========================================================================================  

// Handle GET request to /cgpa-study-sleep route
router.get('/cgpa-study-sleep', (req, res) => {

    // Define the SQL query to fetch CGPA, study hours per week & sleep quality for each student
    const query = `
        SELECT 
            Student.CGPA,
            Lifestyle.StudyHoursPerWeek,
            Lifestyle.SleepQuality
        FROM 
            Student
        JOIN 
            Lifestyle ON Student.StudentID = Lifestyle.StudentID;
    `;
  
    // Execute the SQL query to fetch the results
    db.query(query, (err, results) => {

        if (err) throw err; // If an error occurs during the query execution, throw the error
  
        // Map the query results to a new structure where:
        const data = results.map(row => ({
            x: row.CGPA, // Set x as CGPA
            y: row.StudyHoursPerWeek, // Set y as Study Hours per Week
            r: row.SleepQuality // Set r (radius) as Sleep Quality (for bubble size in a chart)
          }));
  
        res.json(data);
    });
  });

// sleep-treatment-course ========================================================================================

// Route to fetch specialist treatment frequency by sleep quality for a selected course
router.get('/sleep-treatment-by-course', (req, res) => {
    
    // Retrieve the course query parameter from the request
    const course = req.query.course || 'Biotechnology'; // default to Biotechnology if not specified

    // SQL query to fetch the frequency of specialist treatment for each sleep quality level (1 to 10)
    const query = `
        SELECT 
            sq.SleepQuality AS SleepQuality,
            IFNULL(COUNT(MentalHealth.SpecialistTreatment), 0) AS TreatmentFrequency 
        FROM 
            (SELECT 1 AS SleepQuality UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
             UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
             UNION ALL SELECT 9 UNION ALL SELECT 10) sq
        LEFT JOIN 
            Lifestyle ON sq.SleepQuality = Lifestyle.SleepQuality
        LEFT JOIN 
            Student ON Student.StudentID = Lifestyle.StudentID
        LEFT JOIN 
            MentalHealth ON Student.StudentID = MentalHealth.StudentID AND MentalHealth.SpecialistTreatment = 1
        WHERE 
            Student.Course = ?
        GROUP BY 
            sq.SleepQuality
        ORDER BY 
            sq.SleepQuality;
    `;
  
    // Execute the SQL query, passing the selected course as a parameter
    db.query(query, [course], (err, results) => {
        
        if (err) throw err; // If an error occurs during the query execution, throw the error

        // Initialize an object to store the results of sleep quality & treatment frequency
        const data = {
            sleepQuality: [], // Array to store the sleep quality values (1 to 10)
            treatmentFrequency: [] // Array to store the frequency of specialist treatment for each sleep quality level
        };

        // Process each result row & add the SleepQuality & TreatmentFrequency values to the data object
        results.forEach(row => {
            data.sleepQuality.push(row.SleepQuality); // Add SleepQuality value to the array
            data.treatmentFrequency.push(row.TreatmentFrequency); // Add TreatmentFrequency value to the array
        });

        // Send the results as a JSON response, including the course & the data for sleep quality & treatment frequency
        res.json({ course, data });
    });
});
 
// symptom-freq-&-reports ========================================================================================

// Route to fetch symptom frequency data for a selected symptom type
router.get('/symptom-frequency', (req, res) => {
    
    // Retrieve the symptom query parameter from the request, 
    const symptom = req.query.symptom || 'Depression'; // defaulting to Depression if not specified

    // SQL query to fetch the frequency of symptoms (last 7 days) & the count of reports for each frequency
    const query = `
        SELECT 
            SymptomFrequency_Last7Days AS Frequency,
            COUNT(*) AS Reports
        FROM 
            MentalHealth
        WHERE 
            ${symptom} = 1
        GROUP BY 
            SymptomFrequency_Last7Days
        ORDER BY 
            SymptomFrequency_Last7Days;
    `;
  
    // Execute the SQL query
    db.query(query, (err, results) => {
        
        if (err) throw err; // If an error occurs during the query execution, throw the error
  
        // Initialize an object to store the results: frequency levels & report counts
        const data = {
            frequency: [], // Array to store symptom frequency levels
            reports: [] // Array to store the number of reports for each frequency level
        };
  
        // Process each row of the query result
        results.forEach(row => {
            data.frequency.push(row.Frequency); // Push the symptom frequency value into the array
            data.reports.push(row.Reports); // Push the count of reports into the array
        });
  
        // Send the processed data as a JSON response, including the symptom type & data
        res.json({ symptom, data });
    });
});
  
// Route to fetch the available mental health symptom types for the dropdown (Depression, Anxiety, PanicAttack)
router.get('/symptom-types', (req, res) => {
    res.json(['Depression', 'Anxiety', 'PanicAttack']);  // Return a list of possible symptom types
});
  
module.exports = router; // export the router to be used in the main app file (app.js)