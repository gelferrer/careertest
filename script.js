// Initialize EmailJS with your User ID
emailjs.init('mVGltA8s1sVDd9ZmH'); // Replace with your actual EmailJS User ID

// Define the questions and career suggestions
const questions = [
    { question: "Do you enjoy working with people?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you prefer working on computers?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you like solving complex problems?", options: ["Yes", "No", "Sometimes"] },
    { question: "Are you good at organizing tasks?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you enjoy creative activities?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you like working in a team?", options: ["Yes", "No", "Sometimes"] },
    { question: "Are you comfortable with public speaking?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you enjoy working with numbers?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you prefer a structured work environment?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you enjoy managing projects?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you prefer working independently?", options: ["Yes", "No", "Sometimes"] },
    { question: "Are you interested in technology?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you like to travel for work?", options: ["Yes", "No", "Sometimes"] },
    { question: "Do you enjoy working with your hands?", options: ["Yes", "No", "Sometimes"] },
    { question: "Are you interested in health or wellness?", options: ["Yes", "No", "Sometimes"] }
];

const careerSuggestions = {
    A: 'Customer Service Representative, Sales Associate, Human Resources Specialist',
    B: 'Software Developer, Data Analyst, IT Specialist',
    C: 'Graphic Designer, Content Creator, Craftsman',
    D: 'Project Manager, Quality Assurance Specialist, Administrative Assistant'
};

function renderQuestions() {
    const form = document.getElementById('careerForm');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question';
        div.innerHTML = `
            <label>${index + 1}. ${q.question}</label>
            ${q.options.map(option => `
                <label>
                    <input type="radio" name="q${index}" value="${option}" required>
                    ${option}
                </label>
            `).join('')}
        `;
        form.insertBefore(div, form.querySelector('button'));
    });
}

function submitForm() {
    const formData = new FormData(document.getElementById('careerForm'));
    const answers = {};
    for (let [key, value] of formData.entries()) {
        answers[key] = value;
    }

    const score = { A: 0, B: 0, C: 0, D: 0 };

    for (let i = 0; i < questions.length; i++) {
        const answer = answers[`q${i}`];
        if (answer === "Yes") {
            score[Object.keys(score)[i % 4]] += 1; // Simple categorization
        } else if (answer === "No") {
            score[Object.keys(score)[(i + 1) % 4]] += 1; // Alternative categorization
        } else if (answer === "Sometimes") {
            score[Object.keys(score)[(i + 2) % 4]] += 1; // Alternative categorization
        }
    }

    const topCategory = Object.keys(score).reduce((a, b) => score[a] > score[b] ? a : b);

    const suggestions = careerSuggestions[topCategory] || 'No suggestions available for this choice';

    document.getElementById('results').style.display = 'block';
    document.getElementById('suggestions').innerHTML = `Your top career suggestion is: ${suggestions}`;

    // Show the email form
    document.getElementById('emailForm').style.display = 'block';
}

function sendEmail() {
    const name = document.getElementById('name').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const receiveEmail = document.getElementById('receiveEmail').checked;

    if (!receiveEmail) {
        alert('You need to check the box to receive the email.');
        return;
    }

    if (!userEmail || !validateEmail(userEmail)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Prepare email parameters
    const templateParams = {
        from_name: name || 'Anonymous',
        to_name: name || 'Recipient',
        reply_to: userEmail,
        message: `
              ${document.getElementById('suggestions').innerHTML}
        `
    };

    emailjs.send('service_c2tfkew', 'template_1ibcgxi', templateParams)
        .then((response) => {
            console.log('Email sent successfully:', response);
            alert('Results sent to your email!');
            document.getElementById('emailForm').style.display = 'none'; // Hide email form after sending
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please check the console for details.');
        });
}

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Render questions on page load
document.addEventListener('DOMContentLoaded', renderQuestions);
