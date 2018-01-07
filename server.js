import { EWOULDBLOCK } from "constants";

/*********************************************************************************
* WEB322 – Assignment 07
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Wai Chi Ng          Student ID: 140634163         Date: January 6, 2017
*
* Online (Heroku) Link: http://web322-wcng1-assign6.herokuapp.com/
*
********************************************************************************/ 

const clientSessions = require("client-sessions");
const data_service = require("./data-service.js");
const dataServiceComments = require("./data-service-comments.js");
const dataServiceAuth = require("./data-service-auth.js");
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
var HTTP_PORT = process.env.PORT || 8080;

// register handlebars as the rendering engine for views
app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function(lvalue, rvalue, options){
            if (arguments.length < 3){
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if (lvalue != rvalue){
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");

// set up parser
app.use(bodyParser.urlencoded({extended: true}));

// setup static folder to load public files
app.use(express.static('public'));

// setup client-sessions as a middleware and configure it
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by 1 minute at each request
}));

// custom middleware to expose the session object to all templates
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// helper middleware that checks if a user is logged in
function ensureLogin(req, res, next){
    if (!req.session.user){
        res.redirect("/login");
    } else {
        next();
    }
}
   
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req, res)=>{
    res.render("home");
});

// setup another route to listen on /about
app.get("/about", (req, res)=>{
    dataServiceComments.getAllComments().then((commentData)=>{
        res.render("about", {data: commentData});
    }).catch(()=>{
        res.render("about");
    });
});

app.get("/employees", ensureLogin, (req, res)=>{
    if (req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((data)=>{
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch((err)=>{
            res.render("employeeList", {data: {}, title: "Employees"});
        });
    } else if (req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch((err)=>{
            res.render("employeeList", {data: {}, title: "Employees"});
        });
    } else if (req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data)=>{
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch((err)=>{
            res.render("employeeList", {data: {}, title: "Employees"});
        });
    } else {
        data_service.getAllEmployees().then((data)=>{
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch((err)=>{
            res.render("employeeList", {data: {}, title: "Employees"});
        });
    }
});

app.get("/employee/:empNum", ensureLogin, (req,  res)=>{
    let viewData = {}; // empty object to store values

    data_service.getEmployeeByNum(req.params.empNum).then((empData)=>{
        viewData.data = empData; // store employee data (empData) in viewData as data (viewData.data)
    }).catch(()=>{
        viewData.data = null;
    }).then(data_service.getDepartments).then((depData)=>{
        viewData.departments = depData; // store list of available departments (depData) in viewData as departments (viewData.departments)

        for (let i = 0; i < viewData.departments.length; i++){
            if (viewData.departments[i].departmentId == viewData.data.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(()=>{
        viewData.departments = [];
    }).then(()=>{
        if (viewData.data == null) {
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", {viewData: viewData});
        }
    });
});

app.get("/managers", ensureLogin, (req, res)=>{
    data_service.getManagers().then((data)=>{
        res.render("employeeList", {data: data, title: "Employees (Managers)"});
    }).catch((err)=>{
        res.render("employeeList", {data: {}, title: "Employees (Managers)"});
    });
}); // view an employee who is a manager by employeeId

app.get("/departments", ensureLogin, (req, res)=>{
    data_service.getDepartments().then((data)=>{
        res.render("departmentList", {data: data, title: "Departments"});
    }).catch((err)=>{
        res.render("departmentList", {data: {}, title: "Departments"});
    }); 
});

app.get("/employees/add", ensureLogin, (req, res)=>{
    data_service.getDepartments().then((data)=>{
        res.render("addEmployee", {departments: data});
    }).catch((err)=>{
        res.render("addEmployee", {departments: []});
    });
});

app.post("/employees/add", ensureLogin, (req, res)=>{
    data_service.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.json(err);
    });
});

app.post("/employee/update", ensureLogin, (req, res)=>{
    data_service.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.json(err);
    });
});

app.get("/department/:departmentId", ensureLogin, (req,  res)=>{
    data_service.getDepartmentById(req.params.departmentId).then((data)=>{
        res.render("department", {data: data});
    }).catch(()=>{
        res.status(404).send("Department Not Found");
    });
});

app.get("/departments/add", ensureLogin, (req, res)=>{
    res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res)=>{
    data_service.addDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.json(err);
    });
});

app.post("/department/update", ensureLogin, (req, res)=>{
    data_service.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.json(err);
    });
});

app.get("/employee/delete/:empNum", ensureLogin, (req, res)=>{
    data_service.deleteEmployeeByNum(req.params.empNum).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

app.post("/about/addComment", (req, res)=>{
    dataServiceComments.addComment(req.body).then(()=>{
        res.redirect("/about");
    }).catch((err)=>{
        console.log("Fail to add comment: " + err);
        res.redirect("/about");
    });
});

app.post("/about/addReply", (req, res)=>{
    dataServiceComments.addReply(req.body).then(()=>{
        res.redirect("/about");
    }).catch((err)=>{
        console.log("Fail to reply to comment: " + err);
        res.redirect("/about");
    });
});

// renders the login view upon matching route
app.get("/login", (req, res)=>{
    res.render("login");
});

// renders the register view upon matching route
app.get("/register", (req, res)=>{
    res.render("register");
});

// submits user data for registration
app.post("/register", (req, res)=>{
    dataServiceAuth.registerUser(req.body).then(()=>{
        res.render("register", {successMessage: "User created"});
    }).catch((err)=>{
        res.render("register", {errorMessage: err, user:req.body.user});
    });
});

// submits user data for authentication
app.post("/login", (req, res)=>{
    dataServiceAuth.checkUser(req.body).then(()=>{
        req.session.user = {
            username: req.body.user
        };

        res.redirect("/employees");
    }).catch((err)=>{
        res.render("login", {errorMessage: err, user: req.body.user});
    });
});

// logs out user, resets login session and renders the home view
app.get("/logout", (req, res)=>{
    req.session.reset();
    res.redirect("/");
});

app.use((req, res)=>{
    res.status(404).send("Page Not Found");
});

data_service.initialize()
.then(dataServiceComments.initialize())
.then(dataServiceAuth.initialize())
.then(()=>{
    app.listen(HTTP_PORT, () =>{
        console.log("server listening on " + HTTP_PORT);
    }); 
}).catch((err)=>{
    console.log("unable to start data_service");
});