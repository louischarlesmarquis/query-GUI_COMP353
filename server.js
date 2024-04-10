const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// get queries from queries.js file
const queries = require('./queries');

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
    console.log(results);
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
app.get('/query8', (req, res) => {
  let query = `
  WITH facility_info as (
    SELECT facility.facility_name, facility.address, facility.city, facility.province, facility.postal_code,facility.phone_number,
           facility.web_address, facility.capacity, facility.facility_type_id, facility.general_manager_employee_id, facility_id
    FROM facility),
type_info as (
    SELECT facility_type.facility_type_name, facility_type.facility_type_id
    FROM facility_type
),
general_manager_info_person as (
    SELECT person.first_name, person.last_name, person.social_security_number
    FROM person
),
general_manager_info_employee as (
    SELECT employee.employee_id, employee.social_security_number
    FROM employee
),
current_employees_at_facility as (
    SELECT COUNT(employee_id) AS employee_count, facility_id
    FROM employee_history
    WHERE end_date IS NULL
    GROUP BY facility_id
),
nurse_count_table as (
    SELECT EH.facility_id, COUNT(role_type_id) AS nurse_count
    FROM employee AS E
    INNER JOIN employee_history AS EH
        ON EH.employee_id = E.employee_id
    WHERE E.role_type_id = 1  -- corresponds to nurses and doctors
    GROUP BY EH.facility_id
    ORDER BY facility_id
),
doctor_count_table as (
    SELECT EH.facility_id, COUNT(role_type_id) AS doctor_count
    FROM employee AS E
    INNER JOIN employee_history AS EH
        ON EH.employee_id = E.employee_id
    WHERE E.role_type_id = 2  -- corresponds to nurses and doctors
    GROUP BY EH.facility_id
    ORDER BY facility_id
)

SELECT FI.facility_name, FI.address, FI.city, FI.province, FI.postal_code, FI.phone_number, FI.web_address, TI.facility_type_name, FI.capacity,
    CONCAT(P.first_name, " ", P.last_name) as general_manager_name, CE.employee_count, nurse_count, doctor_count
FROM facility_info as FI
INNER JOIN type_info AS TI
    ON TI.facility_type_id = FI.facility_type_id
INNER JOIN general_manager_info_employee AS GME
    ON GME.employee_id = FI.general_manager_employee_id
INNER JOIN person AS P
    ON P.social_security_number = GME.social_security_number
INNER JOIN current_employees_at_facility as CE
    ON CE.facility_id = FI.facility_id
INNER JOIN nurse_count_table as nurses
    ON nurses.facility_id = FI.facility_id
INNER JOIN doctor_count_table AS doctors
    ON doctors.facility_id = FI.facility_id
ORDER BY province, city, facility_type_name, doctor_count;`
  
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
   (SELECT COUNT(secondary_residence.social_security_number)
    FROM secondary_residence
    WHERE employee.social_security_number = secondary_residence.social_security_number) as count_secondary_residence
  FROM employee
  JOIN person ON employee.social_security_number = person.social_security_number
  JOIN residence ON person.residence_id = residence.residence_id
  JOIN secondary_residence ON person.social_security_number = secondary_residence.social_security_number
  WHERE employee.facility_id = 44
  ORDER BY start_date_of_work DESC,
  first_name DESC,
  last_name DESC;`;
  
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

// Query 10
app.post('/query10', (req, res) => {
  // Extract parameters from the request body
  const { employee_id, start_date, end_date } = req.body;

  // Check for missing parameters
  if (!employee_id || !start_date || !end_date) {
      return res.status(400).send('Missing one or more required parameters');
  }

  // Execute the query with parameters
  con.query(queries.query10, [employee_id, start_date, end_date], (err, results) => {
      if (err) {
          console.error("Error fetching schedule data:", err);
          return res.status(500).send("Error fetching data");
      }
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

app.get('/query13', (req, res) => {
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

app.get('/query14', (req, res) => {
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

app.get('/query15', (req, res) => {
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

app.get('/query16', (req, res) => {
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

app.get('/query17', (req, res) => {
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

app.get('/query18', (req, res) => {
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

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
