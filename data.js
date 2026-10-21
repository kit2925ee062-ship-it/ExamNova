/**
 * ExamNova Data Store & Initial Demo Content
 */

const DEFAULT_DATA = {
  currentUser: {
    id: 'user_1',
    name: 'John',
    fullName: 'John Doe',
    email: 'john123@gmail.com',
    role: 'student', // 'student' or 'teacher'
    avatar: 'J',
    class: 'Class 10 A',
    rollNo: '24-CS-102'
  },
  
  teacherUser: {
    id: 'user_teacher',
    name: 'Prof. Anderson',
    fullName: 'Dr. Robert Anderson',
    email: 'robert.anderson@examnova.edu',
    role: 'teacher',
    avatar: 'T',
    department: 'Department of Computer Science & Mathematics'
  },

  exams: [
    {
      id: 'exam_math',
      title: 'Mathematics Quiz',
      subject: 'Mathematics',
      description: 'Comprehensive test covering Algebra, Geometry, and Arithmetic.',
      durationMinutes: 15,
      totalMarks: 20,
      passingMarks: 10,
      topic: 'Math & Quantitative Logic',
      questions: [
        {
          id: 1,
          question: 'What is the value of 2 + 3 × 4?',
          options: ['10', '14', '16', '20'],
          correctIndex: 1,
          marks: 2,
          topic: 'Algebra',
          explanation: 'According to BODMAS / PEMDAS order of operations, multiplication comes before addition: 3 × 4 = 12, and 2 + 12 = 14.'
        },
        {
          id: 2,
          question: 'What is the square root of 144?',
          options: ['10', '12', '14', '16'],
          correctIndex: 1,
          marks: 2,
          topic: 'Algebra',
          explanation: '12 × 12 = 144. Therefore, the square root of 144 is 12.'
        },
        {
          id: 3,
          question: 'If a triangle has angles 90° and 45°, what is the third angle?',
          options: ['35°', '45°', '55°', '90°'],
          correctIndex: 1,
          marks: 2,
          topic: 'Geometry',
          explanation: 'The sum of angles in a triangle is always 180°. 180° - 90° - 45° = 45°.'
        },
        {
          id: 4,
          question: 'What is the formula for the area of a circle with radius r?',
          options: ['2πr', 'πr²', '4πr²', '½πr²'],
          correctIndex: 1,
          marks: 2,
          topic: 'Geometry',
          explanation: 'The area of a circle with radius r is given by A = πr².'
        },
        {
          id: 5,
          question: 'Solve for x in the equation: 5x - 7 = 18',
          options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
          correctIndex: 2,
          marks: 2,
          topic: 'Algebra',
          explanation: '5x = 18 + 7 => 5x = 25 => x = 5.'
        },
        {
          id: 6,
          question: 'What is sin(90°)?',
          options: ['0', '0.5', '1', 'Undefined'],
          correctIndex: 2,
          marks: 2,
          topic: 'Trigonometry',
          explanation: 'The trigonometric sine of a 90 degree right angle is exactly 1.'
        },
        {
          id: 7,
          question: 'Find the mean of the numbers: 4, 8, 12, 16, 20',
          options: ['10', '12', '14', '15'],
          correctIndex: 1,
          marks: 2,
          topic: 'Data Handling',
          explanation: 'Sum = 4 + 8 + 12 + 16 + 20 = 60. Number of items = 5. Mean = 60 / 5 = 12.'
        },
        {
          id: 8,
          question: 'What is 25% of 240?',
          options: ['50', '60', '70', '80'],
          correctIndex: 1,
          marks: 2,
          topic: 'Data Handling',
          explanation: '25% = 1/4. 240 ÷ 4 = 60.'
        },
        {
          id: 9,
          question: 'In a right triangle with legs of length 3 and 4, what is the hypotenuse?',
          options: ['5', '6', '7', '8'],
          correctIndex: 0,
          marks: 2,
          topic: 'Geometry',
          explanation: 'By the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25. Thus c = 5.'
        },
        {
          id: 10,
          question: 'What is tan(45°)?',
          options: ['0', '1', '√3', '1/√3'],
          correctIndex: 1,
          marks: 2,
          topic: 'Trigonometry',
          explanation: 'tan(45°) = sin(45°) / cos(45°) = 1.'
        }
      ]
    },
    {
      id: 'exam_science',
      title: 'Science Test',
      subject: 'Science',
      description: 'Physics fundamentals, basic chemistry, and cell biology concepts.',
      durationMinutes: 20,
      totalMarks: 30,
      passingMarks: 15,
      topic: 'Natural Sciences',
      questions: [
        {
          id: 1,
          question: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
          correctIndex: 1,
          marks: 3,
          topic: 'Biology',
          explanation: 'Mitochondria produce cellular ATP energy through cellular respiration.'
        },
        {
          id: 2,
          question: 'What is the chemical formula for water?',
          options: ['H2O', 'CO2', 'NaCl', 'O2'],
          correctIndex: 0,
          marks: 3,
          topic: 'Chemistry',
          explanation: 'Water is composed of two hydrogen atoms and one oxygen atom (H2O).'
        },
        {
          id: 3,
          question: 'What is the speed of light in vacuum approximately?',
          options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
          correctIndex: 0,
          marks: 3,
          topic: 'Physics',
          explanation: 'Light travels at roughly 299,792 km/s in vacuum (approx. 3 × 10⁸ m/s).'
        },
        {
          id: 4,
          question: 'Which gas do plants absorb during photosynthesis?',
          options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
          correctIndex: 1,
          marks: 3,
          topic: 'Biology',
          explanation: 'Plants use sunlight to convert carbon dioxide and water into glucose and oxygen.'
        },
        {
          id: 5,
          question: 'What is Newton’s Second Law of Motion?',
          options: ['F = ma', 'E = mc²', 'V = IR', 'P = IV'],
          correctIndex: 0,
          marks: 3,
          topic: 'Physics',
          explanation: 'Force equals mass multiplied by acceleration (F = ma).'
        }
      ]
    },
    {
      id: 'exam_english',
      title: 'English Language',
      subject: 'English',
      description: 'Grammar mastery, sentence structure, and vocabulary quiz.',
      durationMinutes: 15,
      totalMarks: 20,
      passingMarks: 10,
      topic: 'Language & Grammar',
      questions: [
        {
          id: 1,
          question: 'Identify the synonym for "Benevolent":',
          options: ['Malevolent', 'Kind & Generous', 'Harsh', 'Indifferent'],
          correctIndex: 1,
          marks: 2,
          topic: 'Vocabulary',
          explanation: 'Benevolent means well-meaning and kindly.'
        },
        {
          id: 2,
          question: 'Which of the following is a complex sentence?',
          options: [
            'She ran fast.',
            'She was tired, so she went to sleep.',
            'Although it was raining, we went for a hike.',
            'The sun set and the moon rose.'
          ],
          correctIndex: 2,
          marks: 2,
          topic: 'Grammar',
          explanation: 'A complex sentence contains an independent clause and at least one dependent clause (beginning with "Although").'
        },
        {
          id: 3,
          question: 'Choose the correct spelling:',
          options: ['Accomodation', 'Accommodation', 'Acomodation', 'Accommadation'],
          correctIndex: 1,
          marks: 2,
          topic: 'Vocabulary',
          explanation: 'Accommodation has double "c" and double "m".'
        }
      ]
    }
  ],

  examHistory: [
    {
      id: 'hist_1',
      examId: 'exam_math',
      testName: 'Mathematics Quiz',
      subject: 'Math',
      date: 'Apr 20, 2025',
      score: 16,
      totalMarks: 20,
      percentage: 80,
      status: 'Passed',
      timeTaken: '11:45'
    },
    {
      id: 'hist_2',
      examId: 'exam_science',
      testName: 'Science Test',
      subject: 'Science',
      date: 'Apr 18, 2025',
      score: 18,
      totalMarks: 20,
      percentage: 90,
      status: 'Passed',
      timeTaken: '14:20'
    },
    {
      id: 'hist_3',
      examId: 'exam_english',
      testName: 'English Language',
      subject: 'English',
      date: 'Apr 15, 2025',
      score: 14,
      totalMarks: 20,
      percentage: 70,
      status: 'Passed',
      timeTaken: '09:15'
    },
    {
      id: 'hist_4',
      examId: 'exam_social',
      testName: 'Social Studies',
      subject: 'Social',
      date: 'Apr 12, 2025',
      score: 17,
      totalMarks: 20,
      percentage: 85,
      status: 'Passed',
      timeTaken: '12:05'
    },
    {
      id: 'hist_5',
      examId: 'exam_cs',
      testName: 'Computer Basics',
      subject: 'Computer',
      date: 'Apr 10, 2025',
      score: 15,
      totalMarks: 20,
      percentage: 75,
      status: 'Passed',
      timeTaken: '08:30'
    }
  ],

  upcomingEvents: [
    { examName: 'Mathematics Quiz', subject: 'Mathematics', dateTime: 'Tomorrow - 10:00 AM', status: 'Upcoming' },
    { examName: 'Science Test', subject: 'Science', dateTime: 'Apr 26, 02:00 PM', status: 'Scheduled' },
    { examName: 'English Language', subject: 'English', dateTime: 'Apr 27, 10:00 AM', status: 'Upcoming' }
  ],

  recentActivities: [
    { text: 'John submitted Mathematics Quiz', time: '1 hour ago', type: 'submission' },
    { text: 'New exam created: Science Test', time: '2 hours ago', type: 'created' },
    { text: 'Sarah scored 85% in English Test', time: '2 hours ago', type: 'score' },
    { text: 'Student joined: Class 10 A', time: '3 hours ago', type: 'student' }
  ],

  studentSubmissions: [
    {
      id: 'sub_1',
      studentName: 'John Doe',
      studentEmail: 'john123@gmail.com',
      studentClass: 'Class 10 A',
      examTitle: 'Mathematics Quiz',
      subject: 'Mathematics',
      score: 17,
      totalMarks: 20,
      percentage: 85,
      submittedAt: 'Today, 10:42 AM',
      status: 'Evaluated'
    },
    {
      id: 'sub_2',
      studentName: 'Sarah Jenkins',
      studentEmail: 'sarah.j@example.com',
      studentClass: 'Class 10 A',
      examTitle: 'English Language',
      subject: 'English',
      score: 17,
      totalMarks: 20,
      percentage: 85,
      submittedAt: 'Today, 09:15 AM',
      status: 'Evaluated'
    },
    {
      id: 'sub_3',
      studentName: 'Alex Turner',
      studentEmail: 'alex.t@example.com',
      studentClass: 'Class 10 B',
      examTitle: 'Science Test',
      subject: 'Science',
      score: 24,
      totalMarks: 30,
      percentage: 80,
      submittedAt: 'Yesterday, 04:30 PM',
      status: 'Evaluated'
    },
    {
      id: 'sub_4',
      studentName: 'Emily Watson',
      studentEmail: 'emily.w@example.com',
      studentClass: 'Class 10 A',
      examTitle: 'Mathematics Quiz',
      subject: 'Mathematics',
      score: 19,
      totalMarks: 20,
      percentage: 95,
      submittedAt: 'Yesterday, 02:10 PM',
      status: 'Evaluated'
    },
    {
      id: 'sub_5',
      studentName: 'Michael Brown',
      studentEmail: 'michael.b@example.com',
      studentClass: 'Class 10 B',
      examTitle: 'Science Test',
      subject: 'Science',
      score: 15,
      totalMarks: 30,
      percentage: 50,
      submittedAt: 'Oct 09, 11:20 AM',
      status: 'Evaluated'
    }
  ]
};

// Storage helper functions
const STORAGE_KEY = 'examnova_store_v1';

function getStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse store, resetting:', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return DEFAULT_DATA;
  }
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  window.location.reload();
}
