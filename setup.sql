-- Create the database
CREATE DATABASE mental_health;

USE mental_health; -- Use the database

-- Create the Student table
CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Gender ENUM('Male', 'Female') NOT NULL,
    Age INT NOT NULL,
    Course VARCHAR(255) NOT NULL,
    YearOfStudy VARCHAR(50) NOT NULL,
    CGPA DECIMAL(4, 2) NOT NULL
);

-- Create the MentalHealth table
CREATE TABLE MentalHealth (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    Depression TINYINT NOT NULL,
    Anxiety TINYINT NOT NULL,
    PanicAttack TINYINT NOT NULL,
    SpecialistTreatment TINYINT NOT NULL,
    SymptomFrequency_Last7Days INT NOT NULL,
    HasMentalHealthSupport TINYINT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- Create the Lifestyle table
CREATE TABLE Lifestyle (
    LifestyleID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    SleepQuality INT NOT NULL,
    StudyStressLevel INT NOT NULL,
    StudyHoursPerWeek INT NOT NULL,
    AcademicEngagement INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- Load data into the Student table
LOAD DATA LOCAL INFILE 'data/mentalhealth_dataset.csv'
INTO TABLE Student
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@Timestamp, Gender, Age, Course, YearOfStudy, CGPA, @Depression, @Anxiety, @PanicAttack, @SpecialistTreatment, @SymptomFrequency_Last7Days, @HasMentalHealthSupport, @SleepQuality, @StudyStressLevel, @StudyHoursPerWeek, @AcademicEngagement)
SET 
    Gender = TRIM(Gender),
    Age = CAST(Age AS UNSIGNED),
    Course = TRIM(Course),
    YearOfStudy = TRIM(YearOfStudy),
    CGPA = CAST(CGPA AS DECIMAL(4,2));

-- Load data into the MentalHealth table
LOAD DATA LOCAL INFILE 'data/mentalhealth_dataset.csv'
INTO TABLE MentalHealth
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@Timestamp, @Gender, @Age, @Course, @YearOfStudy, @CGPA, Depression, Anxiety, PanicAttack, SpecialistTreatment, SymptomFrequency_Last7Days, HasMentalHealthSupport, @SleepQuality, @StudyStressLevel, @StudyHoursPerWeek, @AcademicEngagement)
SET 
    StudentID = (
        SELECT StudentID 
        FROM Student 
        WHERE Gender = @Gender AND Age = CAST(@Age AS UNSIGNED) AND Course = TRIM(@Course) AND YearOfStudy = TRIM(@YearOfStudy) AND CGPA = CAST(@CGPA AS DECIMAL(4,2))
        LIMIT 1
    ),
    Depression = CAST(Depression AS UNSIGNED),
    Anxiety = CAST(Anxiety AS UNSIGNED),
    PanicAttack = CAST(PanicAttack AS UNSIGNED),
    SpecialistTreatment = CAST(SpecialistTreatment AS UNSIGNED),
    SymptomFrequency_Last7Days = CAST(SymptomFrequency_Last7Days AS UNSIGNED),
    HasMentalHealthSupport = CAST(HasMentalHealthSupport AS UNSIGNED);

-- Load data into the Lifestyle table
LOAD DATA LOCAL INFILE 'data/mentalhealth_dataset.csv'
INTO TABLE Lifestyle
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@Timestamp, @Gender, @Age, @Course, @YearOfStudy, @CGPA, @Depression, @Anxiety, @PanicAttack, @SpecialistTreatment, @SymptomFrequency_Last7Days, @HasMentalHealthSupport, SleepQuality, StudyStressLevel, StudyHoursPerWeek, AcademicEngagement)
SET 
    StudentID = (
        SELECT StudentID 
        FROM Student 
        WHERE Gender = @Gender AND Age = CAST(@Age AS UNSIGNED) AND Course = TRIM(@Course) AND YearOfStudy = TRIM(@YearOfStudy) AND CGPA = CAST(@CGPA AS DECIMAL(4,2))
        LIMIT 1
    ),
    SleepQuality = CAST(SleepQuality AS UNSIGNED),
    StudyStressLevel = CAST(StudyStressLevel AS UNSIGNED),
    StudyHoursPerWeek = CAST(StudyHoursPerWeek AS UNSIGNED),
    AcademicEngagement = CAST(AcademicEngagement AS UNSIGNED);

-- Q 1: How does the average academic engagement and stress levels differ between students who have mental 
-- health support and those who do not?
SELECT 
    HasMentalHealthSupport,
    AVG(AcademicEngagement) AS AverageAcademicEngagement,
    AVG(StudyStressLevel) AS AverageStudyStressLevel
FROM 
    MentalHealth 
JOIN 
    Lifestyle ON MentalHealth.StudentID = Lifestyle.StudentID
GROUP BY 
    HasMentalHealthSupport;

-- Q 2: What is the relationship between students' CGPA, study hours and sleep quality?
SELECT 
    CGPA, 
    StudyHoursPerWeek, 
    SleepQuality 
FROM 
    Student 
JOIN 
    Lifestyle ON Student.StudentID = Lifestyle.StudentID;

-- Q 3: What is the distribution of specialist treatment among students in different courses?
SELECT 
    Course, 
    COUNT(SpecialistTreatment) AS SpecialistTreatmentCount
FROM 
    Student 
JOIN 
    MentalHealth ON Student.StudentID = MentalHealth.StudentID
GROUP BY 
    Course;

-- Q 4: How does the prevalence of mental health issues vary between male and female students for each mental health problem?
SELECT 
    Gender, 
    AVG(Depression) AS AverageDepression, 
    AVG(Anxiety) AS AverageAnxiety, 
    AVG(PanicAttack) AS AveragePanicAttack
FROM 
    MentalHealth 
JOIN 
    Student ON MentalHealth.StudentID = Student.StudentID
GROUP BY 
    Gender;

-- Q 5: How does the prevalence of different mental health issues vary across different years of study?
SELECT 
    YearOfStudy, 
    AVG(Depression) AS AverageDepression,
    AVG(Anxiety) AS AverageAnxiety,
    AVG(PanicAttack) AS AveragePanicAttack
FROM 
    MentalHealth 
JOIN 
    Student ON MentalHealth.StudentID = Student.StudentID
GROUP BY 
    YearOfStudy;

-- Q 6: How is the frequency of specialist treatment related to different levels of sleep quality for students in each course?
SELECT 
    Course, 
    SleepQuality, 
    COUNT(SpecialistTreatment) AS TreatmentFrequency
FROM 
    Student 
JOIN 
    MentalHealth ON Student.StudentID = MentalHealth.StudentID
JOIN 
    Lifestyle ON Student.StudentID = Lifestyle.StudentID
GROUP BY 
    Course, SleepQuality;

-- Q 7: What is the frequency distribution of a selected mental health symptom in the last 7 days and how many reports have 
-- been made for each frequency level?
SELECT 
    SymptomFrequency_Last7Days, 
    COUNT(*) AS FrequencyCount
FROM 
    MentalHealth 
GROUP BY 
    SymptomFrequency_Last7Days;