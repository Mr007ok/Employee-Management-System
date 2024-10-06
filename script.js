let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Display employees in the table
function displayEmployees() {
    const tbody = document.getElementById('employee-table-body');
    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>₹${emp.salary % 1 === 0 ? parseInt(emp.salary) : emp.salary.toFixed(2)}</td> <!-- Show salary without .00 for whole numbers -->
            <td>${emp.performance}</td>
            <td>
                <button class="btn" onclick="confirmRemoveEmployee('${emp.empId}')">Remove</button>
                <button class="btn" onclick="promoteEmployee('${emp.empId}')">Promote</button>
            </td>
        </tr>
    `).join('');
    calculateDepartmentSummary();
    saveEmployees(); // Save updated employee data to localStorage
}

// Add employee from form
document.getElementById('employee-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const empId = document.getElementById('emp-id').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const salary = parseFloat(document.getElementById('salary').value);
    const performance = document.getElementById('performance').value;

    // Validation: Ensure employee ID is unique and salary is valid
    if (employees.some(emp => emp.empId === empId)) {
        alert('Employee ID must be unique.');
        return;
    }
    if (salary <= 0 || isNaN(salary)) {
        alert('Please enter a valid salary.');
        return;
    }

    const newEmployee = { empId, name, department, salary, performance };
    employees.push(newEmployee);
    displayEmployees();
    this.reset(); // Reset the form fields
});

// Confirm before removing employee
function confirmRemoveEmployee(empId) {
    if (confirm('Are you sure you want to remove this employee?')) {
        removeEmployee(empId);
    }
}

// Remove employee
function removeEmployee(empId) {
    employees = employees.filter(emp => emp.empId !== empId);
    displayEmployees();
}

// Promote employee (User inputs new salary)
function promoteEmployee(empId) {
    const emp = employees.find(emp => emp.empId === empId);
    const newSalary = parseFloat(prompt(`Enter the new salary for ${emp.name}:`, emp.salary));
    
    if (!isNaN(newSalary) && newSalary > emp.salary) {  // Ensure the new salary is valid and greater than the current salary
        emp.salary = newSalary;
        saveEmployees();  // Save the updated salary to localStorage
        displayEmployees();  // Re-display the updated employee list
    } else {
        alert('Invalid or lower salary entered. No changes made.');
    }
}

// Search employees
function searchEmployees() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredEmployees = employees.filter(emp =>
        emp.empId.includes(searchValue) || emp.name.toLowerCase().includes(searchValue) || emp.department.toLowerCase().includes(searchValue)
    );
    const tbody = document.getElementById('employee-table-body');
    tbody.innerHTML = filteredEmployees.map(emp => `
        <tr>
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>₹${emp.salary % 1 === 0 ? parseInt(emp.salary) : emp.salary.toFixed(2)}</td> <!-- Show salary without .00 for whole numbers -->
            <td>${emp.performance}</td>
            <td>
                <button class="btn" onclick="confirmRemoveEmployee('${emp.empId}')">Remove</button>
                <button class="btn" onclick="promoteEmployee('${emp.empId}')">Promote</button>
            </td>
        </tr>
    `).join('');
}

// Calculate department summary
function calculateDepartmentSummary() {
    const summary = {};
    employees.forEach(emp => {
        summary[emp.department] = summary[emp.department] || { count: 0, totalSalary: 0 };
        summary[emp.department].count++;
        summary[emp.department].totalSalary += emp.salary;
    });
    const report = document.getElementById('summary-report');
    report.innerHTML = Object.entries(summary).map(([dept, data]) => `
        <p><strong>${dept}:</strong> ${data.count} Employees, Total Salary: ₹${data.totalSalary % 1 === 0 ? parseInt(data.totalSalary) : data.totalSalary.toFixed(2)}</p>
    `).join('');
}

// Initial display of employees from localStorage
displayEmployees();
