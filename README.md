# 🎓 ExamNova - Online Examination & Quiz System
> Live Working Model for Academic Presentation & Demonstration

---

## 🌟 Overview
**ExamNova** is a comprehensive, interactive, and responsive web application designed for conducting online exams, assessments, and quizzes. It accurately implements the 6 key interfaces shown in the architectural mockup:

1. **🔐 Login Page** (Dual-role authentication for Students and Teachers)
2. **🏠 Student Dashboard** (Exam progress ring chart, upcoming tests, metrics, available quiz catalog)
3. **👨‍🏫 Teacher Dashboard** (Class performance analytics, recent activity feed, schedule, AI exam generator, question builder, and student result evaluation)
4. **⏱️ Exam Attempt Page** (Live countdown timer, question palette with real-time status indicators, question navigation, review marking, and submission)
5. **🏆 Results & Performance Analytics** (Confetti celebration, score doughnut gauge, correct/wrong breakdown, topic-wise mastery bars, and detailed step-by-step solutions)
6. **📜 Exam History & Profile** (Historical test records, performance percentages, and editable student profile)

---

## 🚀 How to Run the Website for Your Presentation Tomorrow

You have **two effortless ways** to run this website:

### Method 1: One-Click Launch (Recommended)
Simply double-click the **`start.bat`** file located in this folder:
- It detects your Java installation (`Java 26`).
- It automatically starts the Java HTTP Server (`ExamNovaServer.java`) on port `8080`.
- It automatically opens your default web browser to:
  ```
  http://localhost:8080/index.html
  ```

### Method 2: Direct Browser Open (No Server Needed)
Simply **double-click `index.html`** in File Explorer.
- Opens instantly in Google Chrome, Microsoft Edge, Firefox, or Brave.
- 100% of the functionality, animations, timer, questions, and charts will work offline with local storage persistence.

### Method 3: Command Line (Java)
Open PowerShell or Command Prompt in this folder and run:
```bash
java ExamNovaServer.java
```

---

## 🎤 Step-by-Step Presentation Script (What to Show & Say)

### Step 1: Login Page (Screen 1)
- **What to say:** *"Good morning respected evaluators. Welcome to ExamNova, an online examination and quiz system designed for modern e-learning. As you can see on the login portal, we support dual role-based access for both Students and Teachers."*
- **Action:** Click the **`Student`** and **`Teacher`** toggle pills or use the **`⚡ Enter as Student (John)`** quick button to log in.

### Step 2: Student Dashboard (Screen 2)
- **What to say:** *"Upon login, the student is greeted by their personalized dashboard. On the top left, a real-time progress doughnut displays their completion rate (60%). In the center, key metrics show 5 total tests, 3 completed, and a 78% average. Below, students can see available tests like Mathematics Quiz, Science Test, and English Language."*
- **Action:** Point out the progress chart, metrics, and click **`Start Test`** on the Mathematics Quiz.

### Step 3: Exam Attempt Page with Live Countdown Timer (Screen 4)
- **What to say:** *"This is the live examination portal. Notice the active countdown timer ticking down in the header. On the left is the question with multiple-choice radio options. On the right is the interactive Question Palette."*
- **Action:** 
  1. Click an answer (e.g., Option B: 14 for Question 1: 'What is the value of 2 + 3 × 4?').
  2. Notice the button turns **Green** (Answered) in the palette!
  3. Click **`Save for Revision`** on a question to turn it **Amber** (Marked for Review).
  4. Use **`Next`**, **`Back`**, or jump directly to any question by clicking numbers on the palette.
  5. Click **`Submit Exam`** to see the confirmation summary modal.

### Step 4: Results & Analytics Page (Screen 5)
- **What to say:** *"Once submitted, the system instantly evaluates the responses without manual intervention. Confetti celebrates the student's completion, showing an 85% score radial gauge, correct vs wrong breakdown, time taken, and a topic-wise mastery analysis across Algebra, Geometry, and Trigonometry."*
- **Action:** 
  1. Click **`View Detailed Question Solutions`** to showcase the question-by-question review explaining why the correct answer is correct.

### Step 5: Exam History & Student Profile (Screen 6)
- **What to say:** *"Students can track their historical progress over time under the Exam History tab, viewing past scores, dates, and percentages across subjects. Students can also manage their profile information."*
- **Action:** Click **`Edit Profile`** to show interactive data updating.

### Step 6: Teacher Dashboard & Evaluation (Screen 3)
- **What to say:** *"Now let's switch to the Teacher Dashboard. Teachers have high-level visibility over class performance with interactive subject-wise bar charts and real-time student activity logs."*
- **Action:**
  1. Click **`3. Teacher Dashboard`** on the top navigator.
  2. Scroll to **`Evaluate Student Results`** to show how teachers examine individual student answer sheets and add remarks.
  3. Click **`Add New Exam / Questions`** to demonstrate adding a custom question live.
  4. Click **`Generate Exam with AI`** to demonstrate the automated question generator!

---

## 🛠️ Technology Stack
- **Frontend Architecture:** Clean HTML5, Responsive Tailwind CSS, FontAwesome 6, Google Fonts (Plus Jakarta Sans & Outfit)
- **Data Visualizations:** Chart.js (Doughnut progress rings, Class performance bar graphs)
- **Interactive Effects:** Canvas Confetti for celebratory result feedback
- **Persistence:** Browser `localStorage` with initial seed datasets matching the mockup
- **Java Backend:** `ExamNovaServer.java` built with zero-dependency `com.sun.net.httpserver.HttpServer` compatible with Java 11 through Java 26.

---

## 💡 Emergency Demo Tips
- At any time during the presentation, you can click any of the **numbered pills (1 to 6)** in the top presentation bar to jump directly to any screen if an evaluator asks to see a specific feature!
- If you want to reset everything back to the initial state, simply click the red **`Reset Data`** button on the top right.
