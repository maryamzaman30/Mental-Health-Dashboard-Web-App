//Original code written by me
// Import necessary modules
const express = require('express');
const router = express.Router(); // Router to handle HTTP requests

// Route to render the homepage the application
router.get('/', (req, res) => {
  // Render the index view (homepage) without any additional data
  res.render('index');
});

// Same logic for other pagess
// For statistics ===================================================================================================
router.get('/statistics', (req, res) => {
  res.render('statistics');
});

// For mental-health-by-gender =======================================================================================
router.get('/mental-health-by-gender', (req, res) => {
  res.render('mental_health_by_gender');
});

// For mental-health-by-course =======================================================================================
router.get('/mental-health-by-course', (req, res) => {
  res.render('mental_health_by_course');
});

// For mental-health-by-yaer =======================================================================================
router.get('/mental-health-by-year', (req, res) => {
  res.render('mental_health_by_year');
});

// For avg-engagement-stress =======================================================================================
router.get('/avg-engagement-stress', (req, res) => {
  res.render('avg_engagement_stress');
});

// For cgpa-study-sleep ========================================================================================== 
router.get('/cgpa-study-sleep', (req, res) => {
  res.render('cgpa_study_sleep');
});

// sleep-treatment-course ========================================================================================
router.get('/sleep-treatment-course', (req, res) => {
  res.render('sleep_treatment_course');
});

// symptom-freq-&-reports ========================================================================================
router.get('/symptom-freq-and-reports', (req, res) => {
  res.render('symptom_freq_and_reports');
});

module.exports = router; // export the router to be used in the main app file (app.js)