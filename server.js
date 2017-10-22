/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Wai Chi Ng          Student ID: 140634163         Date: October 4, 2017
*
* Online (Heroku) Link: https://seneca-web322-wcng1.herokuapp.com/
*
********************************************************************************/ 

const data_service = require("./data-service.js");
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

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

/* I updated my server.js using the logic from the standard solution
   which I obtained from Patrick. After reading the standard solution,
   I realized I overlooked one important factor which stemmed from my
   misunderstanding and misreading Assignment 3's instructions.
 */

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.get("/employees", (req, res)=>{
    if (req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        });
    } else if (req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        });
    } else if (req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        });
    } else {
        data_service.getAllEmployees().then((data)=>{
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch((err)=>{
            res.render("employeeList", {data: {}, title: "Employees"});
        });
    }
});

app.get("/employee/:value", (req,  res)=>{
    data_service.getEmployeeByNum(req.params.value).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});

app.get("/managers", (req, res)=>{
    data_service.getManagers().then((data)=>{
        res.render("employeeList", {data: data, title: "Employees (Managers)"});
    }).catch((err)=>{
        res.render("employeeList", {data: {}, title: "Employees (Managers)"});
    });
});

app.get("/departments", (req, res)=>{
    data_service.getDepartments().then((data)=>{
        res.render("departmentList", {data: data, title: "Departments"});
    }).catch((err)=>{
        res.render("departmentList", {data: {}, title: "Departments"});
    }); 
});

app.get("/employees/add", (req, res)=>{
    res.render("addEmployee");
});

app.post("/employees/add", (req, res)=>{
    console.log(req.body);
    res.redirect("/employees");
});

app.use((req, res)=>{
    res.status(404).send("Page Not Found");
});

data_service.initialize().then(()=>{
    app.listen(HTTP_PORT, () =>{
        console.log("server listening on " + HTTP_PORT);
    }); 
}).catch((err)=>{
    res.json(err);
});