const inquirer = require("inquirer");
const joi = require("joi");
const axios = require("axios");
const generateHTML = require("./generateHTML")
const fs = require("fs");

const questions = [
    {
        type: "input",
        name: "githubUser",
        message: "What is your GitHub handle?",
        validate: validateHandle
    },
    {
        type: "list",
        message: "Choose your favorite color",
        name: "bgcolor",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ],
        validate: validateColor
    }
]

function onValidation(err, val) {
        if (err) {
            console.log(err.message);
            valid = err.message;
        }
        else {
            valid = true;
        }

        return valid;
}

function validateHandle(name) {
    return joi.validate(name, joi.string().required(), onValidation);
}

function validateColor(color) {
    return joi.validate(color, joi.array().min(1), onValidation);
}

function writeToFile(data) {
    console.log(`Create profile for ${data.githubUser} with a ${data.bgcolor} background.`);

    axios
        .get(`https://api.github.com/users/${data.githubUser}`)
        .then(res => {
            console.log(res.data);
            axios
                .get(`https://api.github.com/search/repositories?q=user:${data.githubUser}&sort=stars&order=desc`)
                .then(res2 => {
                    fs.writeFile(`${data.githubUser}_profile.html`, generateHTML(res.data, res2.data, data.bgcolor), err => {
                        if (err){
                            return console.log(err);
                        }
                        
                        console.log("File created!")
                    });
                })
            
        });
}

function init() {
    inquirer.prompt(questions).then(writeToFile);
}

init();
