const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");

const employees = [];

function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "What is your new employee's role?",
            choices: [
                "Manager",
                "Engineer",
                "Intern"
            ],
        },
        {
            type: "input",
            name: "name",
            message: "What is your employee's name?"
        },
        {
            type: "input",
            name: "id",
            message: "What is your employee's id number?"
        },
        {
            type: "input",
            name: "email",
            message: "What is your employee's email address?"
        }
    ]).then(answers => {
        if (answers.role === "Manager") {
            inquirer.prompt([{
                type: "input",
                name: "officeNumber",
                message: "What is your manager's office number?"
            }]).then(res => {
                const manager = new Manager(answers.name, answers.id, answers.email, res.officeNumber);
                employees.push(manager);
                addEmployee();
            }) 
        } else if (answers.role === "Engineer") {
            inquirer.prompt([{
                type: "input",
                name: "github",
                message: "What is your engineer's GitHub url?"
            }]).then(res => {
                const engineer = new Engineer(answers.name, answers.id, answers.email, res.github);
                employees.push(engineer);
                addEmployee();
            })
        } else {
            inquirer.prompt([{
                type: "input",
                name: "school",
                message: "Where does your intern go to school?"
            }]).then(res => {
                const intern = new Intern(answers.name, answers.id, answers.email, res.school);
                employees.push(intern);
                addEmployee();
            })
        }
    })
};

function addEmployee() {
    inquirer.prompt([{
        type: "confirm",
        name: "response",
        message: "Would you like to add another employee?"
    }]).then(res => {
        if (res.response === true){
            init();
        } else {
            fs.writeFile("team.html", render(employees), "utf-8", () =>{console.log("file created!")})
        }
    })
}

init();