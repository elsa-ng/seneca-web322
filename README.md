# Fall 2017 WEB322 Web Development Project: seneca-web322

Note that automatic deploys from master branch to Heroku are enanbled: https://seneca-web322-wcng1.herokuapp.com/

## Getting Started
This Node.js web application is developed using Visual Studio Code. To obtain a copy of the project, simply clone the master branch. 

### Prerequisites
Should you wish to modify/run this Node.js web application on your local machine, you will need to use an IDE such as Visual Studio Code and install Node.js. 

In addition, you will need to install the following dependencies:
* [Express.js](https://expressjs.com/)
* [Handlebars.js](http://handlebarsjs.com/)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [sequelize](https://www.npmjs.com/package/sequelize)

To simply access this web application online, please visit: https://seneca-web322-wcng1.herokuapp.com/

### Installation
To install Node.js, please visit https://nodejs.org/ to download the current release. Please follow the on screen instructions to install the current release. 

To install the dependencies, simply run the following commands:
```
npm install express --save
```
```
npm install express-handlebars --save
```
```
npm install body-parser --save
```
```
npm install sequelize --save
```

To simply access this web application online, please visit: https://seneca-web322-wcng1.herokuapp.com/

## Built With
* [Node.js](https://nodejs.org/) - JavaScript runtime
* [Express.js](https://expressjs.com/) - Web application framework
* [Body-parser](https://www.npmjs.com/package/body-parser) - Parses incoming request bodies in a middleware
* [Handlebars.js](http://handlebarsjs.com/) - Templates the layout
* [Bootstrap 4](https://v4-alpha.getbootstrap.com/) - Framework for building responsive application
* [sequelize](http://docs.sequelizejs.com/) - Promised-based Node.js ORM for Postgres
* HTML
* CSS
* JavaScript

## Deployment
Automatic deploys from master branch to Heroku are enanbled: https://seneca-web322-wcng1.herokuapp.com/

## Author
* **Elsa (Wai Chi) Ng**

## License
This project is licensed under the [ISC License](https://www.isc.org/downloads/software-support-policy/isc-license/)

**Keep Calm, Code On and Don't Plagiarize!**
A special note to current Seneca WEB322 students: It is okay to read someone's code and learn from it. If you find my code useful and would like to include it in your solution then please reference it.

## Project Specifications
### Iteration 2
An ongoing development that:
* creates a web app that uses multiple routes which serve static files (HTML and CSS)
* serves as the "scaffolding" for future assignments
* deploys a web app that is hosted on Heroku: https://seneca-web322-wcng1.herokuapp.com/

### Iteration 3
An ongoing development that:
* extends the app to listen on a number of additional routes using Express
* handles requests for data on mock datasets using a custom (promise driven) module

### Iteration 4
An ongoing development that:
* extends the app to listen on a number of additional routes
* works with Handlebars.js as a templating engine
* handles POST routes
* processes POST data from server
* updates the existing routes to return rendered HTML pages using the "express-handlebars" modules
* creates web forms using HTML and Bootstrap Forms classes
* extends data-service.js module to accommodate requests to add or update mock datasets

### Iteration 5
An ongoing development that:
* Works with Postgres data source on the server (data persistence)
* Refactors the application