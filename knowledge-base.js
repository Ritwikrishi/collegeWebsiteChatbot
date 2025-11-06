// Knowledge Base for St. Xavier's College Chatbot
const knowledgeBase = {
    // College Information
    college: {
        name: "St. Xavier's College",
        established: "1965",
        affiliation: "University of Delhi",
        accreditation: "NAAC 'A' Grade",
        location: "Rajpur Road, Civil Lines, New Delhi - 110054",
        phone: "+91-11-2397-XXXX",
        email: "info@stxaviers.edu.in",
        admissionsEmail: "admissions@stxaviers.edu.in"
    },

    // Courses Information
    courses: [
        {
            name: "B.A. (Hons) English",
            duration: "3 Years",
            seats: 120,
            description: "Comprehensive study of English literature and language with career opportunities in media, publishing, and education.",
            eligibility: "Class 12th pass with minimum 50% marks"
        },
        {
            name: "B.Sc. (Hons) Computer Science",
            duration: "3 Years",
            seats: 80,
            description: "Advanced computer science curriculum covering programming, algorithms, AI, and software development.",
            eligibility: "Class 12th pass with Mathematics and minimum 60% marks"
        },
        {
            name: "B.Com (Hons)",
            duration: "3 Years",
            seats: 150,
            description: "Commerce education with focus on accounting, finance, taxation, and business management.",
            eligibility: "Class 12th pass with Commerce stream and minimum 55% marks"
        },
        {
            name: "B.A. (Hons) Economics",
            duration: "3 Years",
            seats: 100,
            description: "Study of economic theory, policy analysis, and quantitative methods with excellent career prospects.",
            eligibility: "Class 12th pass with Mathematics and minimum 55% marks"
        },
        {
            name: "B.Sc. (Hons) Mathematics",
            duration: "3 Years",
            seats: 60,
            description: "Advanced mathematics curriculum covering pure and applied mathematics.",
            eligibility: "Class 12th pass with Mathematics and minimum 60% marks"
        },
        {
            name: "B.A. (Hons) Psychology",
            duration: "3 Years",
            seats: 80,
            description: "Comprehensive psychology program with practical training and research opportunities.",
            eligibility: "Class 12th pass with minimum 50% marks"
        }
    ],

    // Admissions Information
    admissions: {
        year: "2025-26",
        applicationStart: "May 15, 2025",
        applicationDeadline: "June 30, 2025",
        meritListRelease: "July 15, 2025",
        classesCommence: "August 1, 2025",
        process: [
            "Fill the online application form on DU portal",
            "Pay the application fee",
            "Check merit lists on our website",
            "Complete document verification",
            "Pay admission fees to confirm seat"
        ],
        generalEligibility: "Candidates must have passed Class 12th examination from a recognized board with the required percentage as per course requirements."
    },

    // Facilities Information
    facilities: [
        {
            name: "Library",
            description: "Modern library with over 100,000 books, journals, and digital resources"
        },
        {
            name: "Computer Labs",
            description: "Well-equipped labs with latest technology and high-speed internet"
        },
        {
            name: "Sports Complex",
            description: "Indoor and outdoor sports facilities including gym, basketball, and cricket"
        },
        {
            name: "Auditorium",
            description: "State-of-the-art auditorium for cultural events and seminars"
        },
        {
            name: "Cafeteria",
            description: "Hygienic cafeteria serving nutritious meals and snacks"
        },
        {
            name: "Transport",
            description: "College bus service covering major routes across the city"
        }
    ],

    // Statistics
    stats: {
        students: "5000+",
        faculty: "200+",
        yearsOfExcellence: "50+",
        placementRate: "95%"
    },

    // Office Hours
    officeHours: {
        weekdays: "Monday - Friday: 9:00 AM - 5:00 PM",
        saturday: "Saturday: 9:00 AM - 1:00 PM",
        sunday: "Closed"
    },

    // FAQ Keywords and Responses
    faqPatterns: {
        greeting: {
            keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
            responses: [
                "Hello! Welcome to St. Xavier's College. How can I help you today?",
                "Hi there! I'm here to assist you with information about St. Xavier's College. What would you like to know?",
                "Greetings! Feel free to ask me anything about our college, courses, admissions, or facilities."
            ]
        },
        courses: {
            keywords: ["course", "courses", "program", "programs", "degree", "study", "what courses", "available courses"],
            response: "We offer the following undergraduate courses:\n\n1. B.A. (Hons) English - 120 seats\n2. B.Sc. (Hons) Computer Science - 80 seats\n3. B.Com (Hons) - 150 seats\n4. B.A. (Hons) Economics - 100 seats\n5. B.Sc. (Hons) Mathematics - 60 seats\n6. B.A. (Hons) Psychology - 80 seats\n\nWould you like to know more about any specific course?"
        },
        admissions: {
            keywords: ["admission", "apply", "application", "how to apply", "admission process", "when to apply"],
            response: "Admissions for 2025-26:\n\n📅 Application Start: May 15, 2025\n📅 Application Deadline: June 30, 2025\n📅 Merit List Release: July 15, 2025\n📅 Classes Start: August 1, 2025\n\nAdmission Process:\n1. Fill online application on DU portal\n2. Pay application fee\n3. Check merit lists\n4. Document verification\n5. Pay admission fees\n\nWould you like to know about eligibility criteria?"
        },
        fees: {
            keywords: ["fee", "fees", "cost", "tuition", "how much", "price"],
            response: "For detailed fee structure, please:\n📧 Email: admissions@stxaviers.edu.in\n📞 Call: +91-11-2397-XXXX\n\nFees vary by course. Our admission team will provide you with the complete fee structure for your chosen course."
        },
        facilities: {
            keywords: ["facility", "facilities", "infrastructure", "amenities", "library", "lab", "sports"],
            response: "Our college offers excellent facilities:\n\n📚 Library - 100,000+ books and digital resources\n💻 Computer Labs - Latest technology\n🏋️ Sports Complex - Gym, basketball, cricket\n🎭 Auditorium - For events and seminars\n🍽️ Cafeteria - Nutritious meals\n🚌 Transport - College bus service\n\nWould you like details about any specific facility?"
        },
        contact: {
            keywords: ["contact", "phone", "email", "address", "location", "where", "how to reach"],
            response: "📍 Address: Rajpur Road, Civil Lines, New Delhi - 110054\n\n📞 Phone: +91-11-2397-XXXX\n📧 Email: info@stxaviers.edu.in\n📧 Admissions: admissions@stxaviers.edu.in\n\n⏰ Office Hours:\nMon-Fri: 9:00 AM - 5:00 PM\nSaturday: 9:00 AM - 1:00 PM"
        },
        placement: {
            keywords: ["placement", "placements", "job", "career", "recruitment", "companies"],
            response: "St. Xavier's College has an excellent placement record with 95% placement rate! Our placement cell actively works with top companies across various sectors including IT, Finance, Consulting, and Education.\n\nFor detailed placement statistics and company list, please contact our placement cell at info@stxaviers.edu.in"
        },
        eligibility: {
            keywords: ["eligibility", "eligible", "qualification", "criteria", "requirement", "12th marks"],
            response: "General Eligibility: Class 12th pass from recognized board\n\nCourse-specific requirements:\n• English/Psychology: 50% minimum\n• Economics: 55% + Mathematics\n• Commerce: 55% minimum\n• Computer Science: 60% + Mathematics\n• Mathematics: 60% + Mathematics\n\nWould you like to know about a specific course?"
        },
        about: {
            keywords: ["about", "college", "history", "established", "accreditation"],
            response: "St. Xavier's College, established in 1965, is a premier institution affiliated with Delhi University. We are NAAC 'A' Grade accredited.\n\n📊 Our Stats:\n• 5000+ Students\n• 200+ Faculty Members\n• 50+ Years of Excellence\n• 95% Placement Rate\n\nWe are committed to providing quality education and holistic development of our students."
        },
        thanks: {
            keywords: ["thank", "thanks", "thank you", "appreciate"],
            responses: [
                "You're welcome! Feel free to ask if you have any other questions.",
                "Happy to help! Let me know if you need anything else.",
                "My pleasure! Don't hesitate to ask if you have more questions."
            ]
        },
        bye: {
            keywords: ["bye", "goodbye", "see you", "exit"],
            responses: [
                "Goodbye! Best wishes for your academic journey. Feel free to return if you have more questions!",
                "See you! Good luck with your college search!",
                "Take care! We hope to see you at St. Xavier's College!"
            ]
        }
    }
};
