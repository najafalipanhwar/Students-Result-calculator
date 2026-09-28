const subjectsContainer = document.getElementById("subjectsContainer");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const printBtn = document.getElementById("printBtn");
const resultSection = document.getElementById("resultSection");

function createSubjectRow() {
    const row = document.createElement("div");
    row.className = "subject-row";

    row.innerHTML = `
        <input type="text" class="subject-name" placeholder="Subject name">
        <input type="number" class="total-marks" placeholder="Total Marks" min="1">
        <input type="number" class="obtained-marks" placeholder="Obtained Marks" min="0">
        <button class="remove-btn" type="button">×</button>
    `;

    row.querySelector(".remove-btn").addEventListener("click", () => {
        const rows = document.querySelectorAll(".subject-row");
        if (rows.length > 1) {
            row.remove();
        } else {
            alert("At least one subject is required.");
        }
    });

    return row;
}

function addDefaultSubjects() {
    subjectsContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        subjectsContainer.appendChild(createSubjectRow());
    }
}

addDefaultSubjects();

addSubjectBtn.addEventListener("click", () => {
    subjectsContainer.appendChild(createSubjectRow());
});

function getGrade(percentage) {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 40) return "E";
    return "F";
}

function createSubjectTable(subjects) {
    const subjectResult = document.getElementById("subjectResult");

    let html = `
        <table class="subject-result">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Total</th>
                    <th>Obtained</th>
                    <th>Percentage</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    subjects.forEach(subject => {
        const passed = subject.percentage >= 40;

        html += `
            <tr>
                <td>${escapeHtml(subject.name)}</td>
                <td>${subject.total}</td>
                <td>${subject.obtained}</td>
                <td>${subject.percentage.toFixed(2)}%</td>
                <td class="${passed ? "pass" : "fail"}">
                    ${passed ? "Pass" : "Fail"}
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    subjectResult.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

calculateBtn.addEventListener("click", () => {
    const studentName = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const rows = document.querySelectorAll(".subject-row");

    if (!studentName) {
        alert("Please enter student name.");
        return;
    }

    if (!rollNumber) {
        alert("Please enter roll number.");
        return;
    }

    let totalMarks = 0;
    let obtainedMarks = 0;
    const subjectData = [];

    for (const row of rows) {
        const name = row.querySelector(".subject-name").value.trim();
        const total = Number(row.querySelector(".total-marks").value);
        const obtained = Number(row.querySelector(".obtained-marks").value);

        if (!name || total <= 0 || obtained < 0 || obtained > total) {
            alert("Please enter valid subject names and marks. Obtained marks cannot be greater than total marks.");
            return;
        }

        totalMarks += total;
        obtainedMarks += obtained;

        subjectData.push({
            name,
            total,
            obtained,
            percentage: (obtained / total) * 100
        });
    }

    const percentage = (obtainedMarks / totalMarks) * 100;
    const grade = getGrade(percentage);
    const status = percentage >= 40 ? "Pass" : "Fail";

    document.getElementById("resultName").textContent = studentName;
    document.getElementById("resultRoll").textContent = rollNumber;
    document.getElementById("resultTotal").textContent = totalMarks;
    document.getElementById("resultObtained").textContent = obtainedMarks;
    document.getElementById("resultPercentage").textContent = percentage.toFixed(2) + "%";
    document.getElementById("resultGrade").textContent = grade;
    document.getElementById("resultStatus").textContent = status;

    createSubjectTable(subjectData);

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
});

resetBtn.addEventListener("click", () => {
    document.getElementById("studentName").value = "";
    document.getElementById("rollNumber").value = "";
    resultSection.classList.add("hidden");
    addDefaultSubjects();
});

printBtn.addEventListener("click", () => {
    window.print();
});
