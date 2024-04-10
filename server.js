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

// create a person:
app.post('/createPerson', (req, res) => {
  const data = req.body; // Your data from the client
  console.log(data);

  // Execute the query with the data
  con.query(queries.query3a, [data.first_name, data.last_name, data.date_of_birth, data.social_security_number, data.medicare, data.phone_number, data.residence_id, data.citizenship, data.email_address], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Error creating facility');
          return;
      }
      res.send('Facility created successfully');
  });
});

// delete a person:
app.delete('/deletePerson', (req, res) => {
  const data = req.body; // Your data from the client
  console.log(data);

  // Execute the query with the data
  con.query(queries.query3b, [data.social_security_number], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Error creating facility');
          return;
      }
      res.send('Facility deleted successfully');
  });
});

// update a person:
app.put('/updatePerson', (req, res) => {
  const data = req.body; // Your data from the client
  console.log(data);

  // Execute the query with the data
  con.query(queries.query3c, [data.first_name, data.last_name, data.date_of_birth, data.social_security_number, data.medicare, data.phone_number, data.residence_id, data.citizenship, data.email_address, data.social_security_number], (error, results) => {
    if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Error creating facility');
          return;
      }
      res.send('Facility updated successfully');
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
    facility_type_id,
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
  console.log(req.body);
  // Construct the SQL query
  const query = `UPDATE facility 
                 SET facility_type_id = ?,
                     facility_name = ?, 
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
  con.query(query, [facility_type_id, facility_name, address, city, province, postal_code, phone_number, web_address, capacity, general_manager_employee_id, facility_id], (error, results) => {
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
      console.log(results);
    res.json(results)
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
  con.query(queries.query8, function(err, results) {
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
  
  con.query(queries.query9, function(err, results) {
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



app.post('/query11', (req, res) => {
  
  const {employee_id} = req.body;

  if (!employee_id) {
    return res.status(400).send('Missing one or more required parameters');
}
  con.query(queries.query11,[employee_id] ,function(err, results) {
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
    con.query(queries.query12, function(err, results) {
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

app.post('/query14', (req, res) => {
  
  const {facility_id} = req.body;

  if (!facility_id) {
    return res.status(400).send('Missing one or more required parameters');
}
  con.query(queries.query14,[facility_id] ,function(err, results) {
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
  
  con.query(queries.query15, function(err, results) {
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
  
  con.query(queries.query16, function(err, results) {
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
  con.query(queries.query17, function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results); // Send JSON response
  });
});

app.post('/query18', (req, res) => {
  // Extract parameters from the request body
  const {start_time_18, start_time_18_2, end_time_18, end_time_18_2} = req.body;
  
  // Check for missing parameters
  if (! start_time_18 || ! start_time_18_2 || ! end_time_18 || ! end_time_18_2) {
      return res.status(400).send('Missing one or more required parameters');
  }

  // Execute the query with parameters
  con.query(queries.query18, [start_time_18, start_time_18_2, end_time_18, end_time_18_2], (err, results) => {
      if (err) {
          console.error("Error fetching schedule data:", err);
          return res.status(500).send("Error fetching data");
      }
      res.json(results); // Send JSON response
  });
});

// add infection history, if covid, cancels all employee schedule for next 2 weeks
app.post('/query21', (req, res) => {
  // Extract parameters from the request body
  const { social_security_num, infec_date, infection_type } = req.body;

  // insert an infection
  con.query(queries.query21a, [social_security_num, infec_date, infection_type], function(err, results) {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
  });
  let employees_to_notify = []

  if(infection_type == 1){
      // if infection_type_id == 1, get employees who worked the same day
    con.query(queries.query21b, [infec_date, infec_date, social_security_num, social_security_num], function(err, results) {
      if (err) {
        console.error("Error fetching employee data:", err);
        res.status(500).send("Error fetching data");
        return;
      }

      //console.log(results);

      const subject = "WARNING!"
  
      const dateObj = new Date();
      const month   = dateObj.getUTCMonth() + 1; // months from 1-12
      const day     = dateObj.getUTCDate();
      const year    = dateObj.getUTCFullYear();
      const newDate = year + "/" + month + "/" + day;
  
      results.forEach(employee => {
        let email = employee.email_address;
        let sender_id = employee.facility_id;
        let sender_name = employee.facility_name;
        let sender_employee_id = employee.employee_id;
        let receiver = employee.first_name + " " + employee.last_name;
        let email_body_beginning = "You worked in the past two weeks with someone infected by covid-19";
          con.query(queries.query21c, [sender_id, sender_employee_id, newDate, subject, email_body_beginning, sender_name], function(err, results) {
            if (err) {
              console.error("Error fetching employee data:", err);
              res.status(500).send("Error fetching data");
              return;
            }
        });
      });
      
      res.json(results);

    });
  }

  
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


//CREATE infection
app.post('/createInfection', (req, res) => {
  const data = req.body; // Your data from the client
  console.log(req.body);
  // Construct the SQL query
  const query = `INSERT INTO infection (infection_type_id, infection_name, address, city, province, postal_code, phone_number, web_address, capacity, general_manager_employee_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the query with the data
  con.query(query, [data.infection_type_id, data.infection_name, data.address, data.city, data.province, data.postal_code, data.phone_number, data.web_address, data.capacity, data.general_manager_employee_id], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Error creating infection');
          return;
      }
      res.send('infection created successfully');
  });
});

//DELETE infection
app.delete('/deleteInfection', (req, res) => {
  const { infection_id } = req.body;

  const query = 'DELETE FROM infection WHERE infection_id = ?';

  con.query(query, [infection_id], (error, results) => {
      if (error) {
          console.error('Error executing delete query:', error);
          res.status(500).send('Error deleting infection');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('infection not found');
      } else {
          res.send('infection deleted successfully');
      }
  });
});

//VIEW infection
app.get('/viewInfection/:infectionId', (req, res) => {
  const { infectionId } = req.params;

  // Construct the SQL query
  const query = 'SELECT * FROM infection WHERE infection_id = ?';

  // Execute the query with the provided infection ID
  con.query(query, [infectionId], (error, results) => {
      if (error) {
          console.error('Error fetching infection:', error);
          res.status(500).send('Error fetching infection');
          return;
      }
      if (results.length === 0) {
          res.status(404).send('infection not found');
      } else {
          res.json(results[0]); // Send the infection data as a JSON response
      }
  });
});

//UPDATE infection
app.put('/updateInfection', (req, res) => {
  const {
    infection_id,
    infection_type_id,
    infection_name,
    address,
    city,
    province,
    postal_code,
    phone_number,
    web_address,
    capacity,
    general_manager_employee_id
  } = req.body;
  console.log(req.body);
  // Construct the SQL query
  const query = `UPDATE infection 
                 SET infection_type_id = ?,
                     infection_name = ?, 
                     address = ?, 
                     city = ?, 
                     province = ?, 
                     postal_code = ?, 
                     phone_number = ?, 
                     web_address = ?, 
                     capacity = ?, 
                     general_manager_employee_id = ?
                 WHERE infection_id = ?`;
  // Execute the query with the updated data
  con.query(query, [infection_type_id, infection_name, address, city, province, postal_code, phone_number, web_address, capacity, general_manager_employee_id, infection_id], (error, results) => {
      if (error) {
          console.error('Error executing update query:', error);
          res.status(500).send('Error updating infection');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('infection not found or no new data to update');
      } else {
          res.send('infection updated successfully');
      }
      console.log(results);
    res.json(results)
  });
});