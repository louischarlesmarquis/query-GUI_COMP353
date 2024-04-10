const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
//db credentials
var con = mysql.createConnection({
  host: 'bkc353.encs.concordia.ca',
  port: '3306',
  user: 'bkc353_4',
  password: 'Potato123',
  database: 'bkc353_4',
});
//connect to the db
con.connect(function(err) {
  if (err){ 
    console.error("db connection error: ", err);
    return;
  }
  console.log("db connected!");
});

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
  next();
});
// Serve static files from 'public' directory
app.use(express.static('public'));
app.use(express.json()); //fetch objects as json



let selectAllFacility = "select * from facility";
// ALL FACILITY
app.get('/query1', (req, res) => {
  con.query(selectAllFacility, function(err, results) {
    if (err) {
      console.error("Error fetching facility data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results); // Send JSON response
  });
});

//CREATE FACILITY
app.post('/createFacility', (req, res) => {
  const data = req.body; // Your data from the client
  console.log(req.body);
  // Construct the SQL query
  const query = `INSERT INTO facility (facility_type_id, facility_name, address, city, province, postal_code, phone_number, web_address, capacity, general_manager_employee_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the query with the data
  con.query(query, [data.facility_type_id, data.facility_name, data.address, data.city, data.province, data.postal_code, data.phone_number, data.web_address, data.capacity, data.general_manager_employee_id], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Error creating facility');
          return;
      }
      res.send('Facility created successfully');
  });
});

//DELETE FACILITY
app.delete('/deleteFacility', (req, res) => {
  const { facility_id } = req.body;

  const query = 'DELETE FROM facility WHERE facility_id = ?';

  con.query(query, [facility_id], (error, results) => {
      if (error) {
          console.error('Error executing delete query:', error);
          res.status(500).send('Error deleting facility');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('Facility not found');
      } else {
          res.send('Facility deleted successfully');
      }
  });
});

//VIEW FACILITY
app.get('/viewFacility/:facilityId', (req, res) => {
  const { facilityId } = req.params;
  // Construct the SQL query
  const query = 'SELECT * FROM facility WHERE facility_id = ?';

  // Execute the query with the provided facility ID
  con.query(query, [facilityId], (error, results) => {
      if (error) {
          console.error('Error fetching facility:', error);
          res.status(500).send('Error fetching facility');
          return;
      }
      if (results.length === 0) {
          res.status(404).send('Facility not found');
      } else {
          res.json(results[0]); // Send the facility data as a JSON response
      }
  });
});

//UPDATE FACILITY
app.put('/updateFacility', (req, res) => {
  const {
    facility_id,
    facility_name,
    address,
    city,
    province,
    postal_code,
    phone_number,
    web_address,
    capacity,
    general_manager_employee_id
  } = req.body;

  // Construct the SQL query
  const query = `UPDATE facility 
                 SET facility_name = ?, 
                     address = ?, 
                     city = ?, 
                     province = ?, 
                     postal_code = ?, 
                     phone_number = ?, 
                     web_address = ?, 
                     capacity = ?, 
                     general_manager_employee_id = ?
                 WHERE facility_id = ?`;

  // Execute the query with the updated data
  con.query(query, [facility_name, address, city, province, postal_code, phone_number, web_address, capacity, general_manager_employee_id, facility_id], (error, results) => {
      if (error) {
          console.error('Error executing update query:', error);
          res.status(500).send('Error updating facility');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('Facility not found or no new data to update');
      } else {
          res.send('Facility updated successfully');
      }
  });
});



let selectAllResidence = "select * from residence";
//ALL RESIDENCES
app.get('/allResidence', (req, res) => {
  
  con.query(selectAllResidence, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

//CREATE RESIDENCE
app.post('/createResidence', (req, res) => {
  const {
      residence_type_id,
      name,
      address,
      city,
      province,
      postal_code,
      phone_number,
      number_of_bedrooms
  } = req.body;

  // Construct the SQL query
  const query = `INSERT INTO residence (residence_type_id, name, address, city, province, postal_code, phone_number, number_of_bedrooms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the query with the new residence data
  con.query(query, [residence_type_id, name, address, city, province, postal_code, phone_number, number_of_bedrooms], (error, results) => {
      if (error) {
          console.error('Error executing insert query:', error);
          res.status(500).send('Error creating residence');
          return;
      }
      res.send('Residence created successfully');
  });
});

//DELETE RESIDENCE
app.delete('/deleteResidence', (req, res) => {
  const { residence_id } = req.params; // Extract the ID from the request parameters

  const sql = "DELETE FROM residence WHERE residence_id = ?";
  con.query(sql, [residence_id], (err, result) => {
      if (err) {
          console.error("Error deleting residence: ", err);
          res.status(500).send("Error deleting residence");
          return;
      }
      if (result.affectedRows === 0) {
          // No rows were deleted, which means the residence was not found
          res.status(404).send("Residence not found");
          return;
      }
      res.send("Residence deleted successfully");
  });
});

//VIEW RESIDENCE BY ID
app.get('/viewResidence/:residenceId', (req, res) => {
  const { residenceId } = req.params;

  // Construct the SQL query
  const query = 'SELECT * FROM residence WHERE residence_id = ?';

  // Execute the query with the provided residence ID
  con.query(query, [residenceId], (error, results) => {
      if (error) {
          console.error('Error fetching residence:', error);
          res.status(500).send('Error fetching residence');
          return;
      }
      if (results.length === 0) {
          res.status(404).send('residence not found');
      } else {
          res.json(results[0]); // Send the facility data as a JSON response
      }
  });
});

//UPDATE RESIDENCE
app.put('/updateResidence', (req, res) => {
  const { residenceId, residenceName, residenceAddress, residenceCity, residenceProvince, residencePostalCode, residencePhoneNumber, residenceBedrooms } = req.body;

  // Assuming you have a table named 'Residence'
  const sql = `
      UPDATE residence
      SET name = ?, address = ?, city = ?, province = ?, postal_code = ?, phone_number = ?, number_of_bedrooms = ?
      WHERE id = ?`;

  con.query(sql, [residenceName, residenceAddress, residenceCity, residenceProvince, residencePostalCode, residencePhoneNumber, residenceBedrooms, residenceId], (err, result) => {
      if (err) {
          console.error("Error updating residence: ", err);
          res.status(500).send("Error updating residence");
          return;
      }
      if (result.affectedRows === 0) {
          // No rows were updated, which means the residence was not found
          res.status(404).send("Residence not found");
          return;
      }
      res.send("Residence updated successfully");
  });
});





//MISCELLANOUS QUERIES (#8 ET +)
//add 6 to get the query # listed on the doc. ex: query2 (the one below) is query#8 (as stated in the docs)
app.get('/query2', (req, res) => {
  let query = `SELECT person.first_name,
  person.last_name,
  (SELECT employee_history.start_date
   FROM employee_history
   WHERE employee_history.facility_id = employee.facility_id
   AND employee.employee_id = employee_history.employee_id) as start_date_of_work,
   person.date_of_birth,
   person.medicare,
   person.phone_number,
   residence.address as primary_address,
   residence.city,
   residence.province,
   residence.postal_code,
   person.citizenship,
   person.email_address,
   (SELECT COUNT(ssn)
    FROM secondary_residence
    WHERE employee.social_security_number = secondary_residence.ssn) as count_secondary_residence
FROM employee
JOIN person ON employee.social_security_number = person.social_security_number
JOIN residence ON person.residence_id = residence.residence_id
JOIN secondary_residence ON person.social_security_number = secondary_residence.ssn
WHERE employee.facility_id = 44
ORDER BY start_date_of_work DESC,
first_name DESC,
last_name DESC;
  `;
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query3', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query4', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query5', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query6', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query7', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query8', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query9', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query10', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query11', (req, res) => {
  let query = "";
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.get('/query12', (req, res) => {
  let query = `SELECT doctor.first_name,
  doctor.last_name,
  infection_history.infection_date,
  facility.facility_name,
  (SELECT COUNT(*)
   FROM secondary_residence
   WHERE secondary_residence.social_security_number = doctor.doc_ssn) as num_of_second_residence
FROM (SELECT
       person.first_name,
       person.last_name,
       employee.social_security_number as doc_ssn,
       facility_id as doc_facility_id
   FROM employee
   JOIN person ON employee.social_security_number = person.social_security_number
   WHERE employee.role_type_id = 2) as doctor
JOIN infection_history ON doctor.doc_ssn = infection_history.social_security_number
JOIN facility ON doctor.doc_facility_id = facility.facility_id
WHERE infection_history.infection_date > curdate() - 14
ORDER BY
facility_name,
num_of_second_residence;
`;
  
  con.query(query, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));