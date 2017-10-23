const fs = require("fs");

var employees = [];
var departments = [];
var empCount = 0;

// exports initialize() so it can be called from server.js
// initializes the employees and departments array
// returns a promise upon successful initialization
module.exports.initialize = () => {

    return new Promise((resolve, reject)=>{
        fs.readFile("./data/employees.json", (err, data)=>{
            if (err){
                reject({message:"unable to read file"});
            } else {
                let empData = JSON.parse(data);
                for (let x in empData){
                    employees.push(empData[x]);
                }
                if (employees.length > 0){
                    fs.readFile("./data/departments.json", (err, data)=>{
                        if (err){
                            reject({message:"unable to read file"});
                        } else {
                            let depData = JSON.parse(data);
                            for (let y in depData){
                                departments.push(depData[y]);
                            }
                            if (departments.length > 0){
                                empCount = employees.length;
                                resolve();
                            } else {
                                reject({message:"unable to read file"});
                            }
                        }
                    });
                } else {
                    reject({message:"unable to read file"});
                }
            }
        });
    });
};

// exports getAllEmployees() to be called from server.js
// returns the employees array through a promise
module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject)=>{
        if (employees.length > 0){
            resolve(employees);
        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports getEmployeesByStatus() to be called from server.js
// returns the results in an array through a promise
module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject)=>{
        var empS = [];

        if (employees.length > 0){
            for (let j in employees){
                if (employees[j].status == status){
                    empS.push(employees[j]);
                }
            }

            if (empS.length > 0){
                resolve(empS);
            } else {
                reject({message:"no match is found"});
            }

        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports getEmployeesByDepartment() to be called from server.js
// returns the results in an array through a promise
module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject)=>{
        var empD = [];

        if (employees.length > 0){
            for (let m in employees){
                if (employees[m].department == department){
                    empD.push(employees[m]);
                }
            }

            if (empD.length > 0){
                resolve(empD);
            } else {
                reject({message:"no match is found"});
            }

        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports getEmployeesByManager() to be called from server.js
// returns the results in an array through a promise
module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject)=>{        
        var empM = [];

        if (employees.length > 0){
            for (let n in employees){
                if (employees[n].employeeManagerNum == manager){
                    empM.push(employees[n]);
                }
            }

            if (empM.length > 0){
                resolve(empM);
            } else {
                reject({message:"no match is found"});
            }            
        
        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports getEmployeeByNum() to be called from server.js
// returns the result through a promise
// part of the logic is taken from the standard solution obtained from Patrick
module.exports.getEmployeeByNum = (num) => {
    return new Promise ((resolve, reject)=>{
        var foundEmployee = null; // taken from the standard solution
        
        if (employees.length > 0) {
            for (let i in employees){
                if (employees[i].employeeNum == num){
                    foundEmployee = employees[i]; // taken from the standard solution
                }
            }
            
            if (!foundEmployee){ // taken from the standard solution
                reject({message:"no match is found"});
            } else {
                resolve(foundEmployee);
            }

        } else {
            reject({message: "no results returned"});
        }
        
    });
};

// exports getManagers() to be called from server.js
// returns the results in an array through a promise
module.exports.getManagers = () => {
    return new Promise((resolve, reject)=>{     
        let isMan = [];

        if (employees.length > 0){
            for (let k in employees){
                if (employees[k].isManager){
                    isMan.push(employees[k]);
                }
            }

            if (isMan.length > 0){
                resolve(isMan);
            } else {
                reject({message:"no match is found"});
            }
            
        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports getDepartments() to be called from server.js
// returns the departments array through a promise
module.exports.getDepartments = () => {
    return new Promise((resolve, reject)=>{
        if (departments.length > 0){
            resolve(departments);
        } else {
            reject({message:"no results returned"});
        }
    });
};

// exports addEmployee() to be called from server.js
// push new employee into into employees[]
module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject)=>{
        if (employeeData){
            empCount++;
            employeeData.employeeNum = empCount;
            employees.push(employeeData);
            resolve();
        } else {
            reject({message:"failed to add employee"});
        }
    });
}

// exports updateEmployee() to be called from server.js
// updates employee information by replacing old info with new info
module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject)=>{
        let notFound = true;
        
        if (employeeData) {
            for (let i = 0; i < employees.length && notFound; i++){
                if (employees[i].employeeNum == employeeData.employeeNum){
                    employees[i] = employeeData;
                    notFound = false;
                }
            }
            
            if (notFound){
                reject({message:"no match is found"});
            } else {
                resolve();
            }
        } else {
            reject({message: "did not receive employee data"});
        }
    });
}