# Students-Mental-Health-Dashboard-Web-App

## Sep 2024 - Jan 2025

## Associated with University of London

Link to Demo -
Dataset used - https://www.kaggle.com/datasets/junnn0126/university-students-mental-health/data

Link To the Coursera lab (with the database already created) 
To run you need a Coursera account - https://hub.labs.coursera.org/connect/sharedjfjkgdqt?forceRefresh=false&token=SUfrvh1bIhlQJVT7jaJp&path=%2F%3Ffolder%3D%2Fhome%2Fcoder%2Fproject&isIframe=false&isLabVersioning=true

## Description

This web application is designed to analyze mental health data among students. It provides various functionalities, including:

- Viewing all student records.
- Filtering students based on specific mental health issues (e.g., Depression, Anxiety, Panic Attack).
- Analyzing the correlation between CGPA, study hours, and sleep quality.
- Displaying statistics related to mental health issues, academic engagement, and stress levels.
- Visualizing data through various charts (bar, bubble, line) to understand trends and relationships.

The application uses Node.js with Express for the backend, MySQL for the database, and EJS for rendering dynamic HTML pages.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **XAMPP**: [Download XAMPP](https://www.apachefriends.org/index.html)

## Setup Instructions

### Step 1: Install XAMPP

1. Download and install XAMPP from the official website.
2. Launch the XAMPP Control Panel and start the **Apache** and **MySQL** services.

### Step 2: Configure MySQL Environment Variables

1. Open the **Control Panel** on your Windows machine.
2. Navigate to **System and Security** > **System** > **Advanced system settings**.
3. Click on the **Environment Variables** button.
4. In the **System variables** section, find the `Path` variable and select it, then click **Edit**.
5. Add the path to your MySQL installation (usually `C:\xampp\mysql\bin`) to the list of paths.
6. Click **OK** to save the changes.

### Step 3: Set Up the Database

1. Open a terminal (Command Prompt or PowerShell).
2. Start the MySQL command line by typing `mysql -u root -p` and pressing Enter. (You may not need a password if you haven't set one.)
3. Create the database and tables by executing the SQL commands from the `setup.sql` file. You can copy the following SQL commands into the terminal:

```sql
CREATE DATABASE mental_health;

USE mental_health;

CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Gender ENUM('Male', 'Female') NOT NULL,
    Age INT NOT NULL,
    Course VARCHAR(255) NOT NULL,
    YearOfStudy VARCHAR(50) NOT NULL,
    CGPA DECIMAL(4, 2) NOT NULL
);

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

CREATE TABLE Lifestyle (
    LifestyleID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    SleepQuality INT NOT NULL,
    StudyStressLevel INT NOT NULL,
    StudyHoursPerWeek INT NOT NULL,
    AcademicEngagement INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);
```

4. Load the dataset into the `Student`, `MentalHealth`, and `Lifestyle` tables. Ensure you have the `mentalhealth_dataset.csv` file in the appropriate directory. Then run:

```sql
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
```

### Step 4: Clone the Repository

1. Clone this repository to your local machine using Git or download it as a ZIP file and extract it.

```bash
git clone <repository-url>
```

### Step 5: Install Dependencies

1. Navigate to the project directory in your terminal.
2. Run the following command to install the required Node.js packages:

```bash
npm install
```

### Step 6: Run the Application

1. Start the application by running:

```bash
node app.js
```

2. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Usage

- Use the navigation menu to explore different analysis features.
- View statistics, mental health issues, and more through the provided links.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This application utilizes the Chart.js library for data visualization.
- Thanks to the contributors and the community for their support and resources.
