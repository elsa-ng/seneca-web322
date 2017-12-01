const Sequelize = require("sequelize");

// set up connection to database
var sequelize = new Sequelize('dc9kom4jkssc90', 'vuykagilysviaa', 'd8af55153ead71c67fe984ebff081beacd0e164913634fecdd0e7a339f0c7e21', {
    host: 'ec2-50-19-110-195.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

// define the Employee model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

// define the Department model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

// exports initialize()
// returns a promise upon successful initialization
module.exports.initialize = () => {
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to sync the database");
        });
    });
};

// exports getAllEmployees()
// returns data through promise
module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            order: ["employeeNum"]
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getEmployeesByStatus()
// returns data through promise
module.exports.getEmployeesByStatus = (empStatus) => {
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            order: ["employeeNum"],
            where: {
                status: empStatus
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getEmployeesByDepartment()
// returns data through promise
module.exports.getEmployeesByDepartment = (empDepartment) => {
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            order: ["employeeNum"],
            where: {
                department: empDepartment
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getEmployeesByManager()
// returns data through promise
module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject)=>{        
        Employee.findAll({
            order: ["employeeNum"],
            where: {
                employeeManagerNum: manager
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getEmployeeByNum()
// returns data through promise
module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((data)=>{
            resolve(data[0]);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getManagers()
// returns data through promise
module.exports.getManagers = () => {
    return new Promise((resolve, reject)=>{     
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports getDepartments()
// returns data through promise
module.exports.getDepartments = () => {
    return new Promise((resolve, reject)=>{
        Department.findAll({
            order: ["departmentId"]
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

// exports addEmployee()
// adds new employee to database
module.exports.addEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    
    for (let i in employeeData){
        if (employeeData[i] == ""){
            employeeData[i] = null;
        }
    }

    return new Promise((resolve, reject)=>{
        Employee.create({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create employee");
        });
        
    });
};

// exports updateEmployee()
// updates employee information by replacing old info with new info
module.exports.updateEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    
    for (let i in employeeData){
        if (employeeData[i] == ""){
            employeeData[i] = null;
        }
    }
    
    return new Promise((resolve, reject)=>{
        Employee.update({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to update employee");
        });
    });
};

module.exports.addDepartment = (departmentData) =>{
    for (let i in departmentData){
        if (departmentData[i] == ""){
            departmentData[i] = null;
        }
    }
    
    return new Promise((resolve, reject)=>{
        Department.create({
            departmentName: departmentData.departmentName
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create department");
        });
    });
};

module.exports.updateDepartment = (departmentData) =>{
    for (let i in departmentData){
        if (departmentData[i] == ""){
            departmentData[i] = null;
        }
    }

    return new Promise((resolve, reject)=>{
        Department.update({
            departmentName: departmentData.departmentName
        }, {
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to update department");
        });
    });
};

module.exports.getDepartmentById = (id) =>{
    return new Promise((resolve, reject)=>{
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then((data)=>{
            resolve(data[0]);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
};

module.exports.deleteEmployeeByNum = (empNum) =>{
    return new Promise((resolve, reject)=>{
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("Unable to remove employee / Employee not found");
        });
    });
};