//CREATE FACILITY DATA FETCHING
document.getElementById('facilityForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collecting the form data
  const formData = {
      facility_type_id: document.getElementById('facilityTypeId').value,
      facility_name: document.getElementById('facilityName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postal_code: document.getElementById('postalCode').value,
      phone_number: document.getElementById('phoneNumber').value,
      web_address: document.getElementById('webAddress').value,
      capacity: document.getElementById('capacity').value,
      general_manager_employee_id: document.getElementById('generalManagerEmployeeId').value
  };

  // Sending the data to the server via a fetch() request
  fetch('/createFacility', { //error here
      method: 'POST', // Method type
      headers: {
          'Content-Type': 'application/json', // Indicates the content type of the request body
      },
      body: JSON.stringify(formData), // Convert the JavaScript object to a JSON string
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); // or response.text() if your server responds with text
  })
  .then(data => {
      console.log(data); // Handle the success response here
      alert('Facility created successfully');
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error); //error here
      alert('Error creating facility');
  });
});

//DELETE FACILITY DATA FETCHING
document.getElementById('deleteFacilityForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the ID value from the input field
  const facilityId = document.getElementById('facilityId').value;

  // Sending the delete request to the server
  fetch('/deleteFacility', {
      method: 'DELETE', // Use the DELETE HTTP method
      headers: {
          'Content-Type': 'application/json', // Content type
      },
      body: JSON.stringify({ facility_id: facilityId }), // Send the facility ID in the request body
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); 
  })
  .then(data => {
      console.log(data); // Success message from the server
      alert('Facility deleted successfully');
  })
  .catch(error => {
      console.error('There was a problem with the delete operation:', error);
      alert('Error deleting facility');
  });
});

//VIEW FACILITY DATA FETCHING
document.getElementById('viewFacilityForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the ID value from the input field
  const facilityId = document.getElementById('viewFacilityId').value;

  // Sending the request to the server
  fetch(`/viewFacility/${facilityId}`) // Use template literals to include the facilityId in the URL
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Log the facility data

      // Displaying the facility info on the webpage
      const facilityDisplay = document.getElementById('facilityInfo');
      facilityDisplay.innerHTML = JSON.stringify(data, null, 2);
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Error retrieving facility information');
  });
});

//UPDATE FACILITY DATA FETCHING
document.getElementById('updateFacilityForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collecting the updated facility data
  const updatedData = {
    facility_id: document.getElementById('updateFacilityId').value,
    facility_name: document.getElementById('updateFacilityName').value,
    address: document.getElementById('updateAddress').value,
    city: document.getElementById('updateCity').value,
    province: document.getElementById('updateProvince').value,
    postal_code: document.getElementById('updatePostalCode').value,
    phone_number: document.getElementById('updatePhoneNumber').value,
    web_address: document.getElementById('updateWebAddress').value,
    capacity: document.getElementById('updateCapacity').value,
    general_manager_employee_id: document.getElementById('updateGeneralManagerEmployeeId').value
  };

  // Sending the update request to the server
  fetch('/updateFacility', {
      method: 'PUT', // Use the PUT HTTP method for updates
      headers: {
          'Content-Type': 'application/json', // Content type
      },
      body: JSON.stringify(updatedData), // Convert the JavaScript object to a JSON string
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); // Assuming the server sends a text response
  })
  .then(data => {
      console.log(data); // Success message from the server
      alert('Facility updated successfully');
  })
  .catch(error => {
      console.error('There was a problem with the update operation:', error);
      alert('Error updating facility');
  });
});

//LIST ALL FACILITIES FETCH
document.getElementById('runQuery1').addEventListener('click', function() {
  fetch('/query1')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      // Get the reference to the queryResult1 div
      const queryResult1 = document.getElementById('queryResult1');

      // Clear the existing content of the div
      queryResult1.innerHTML = '';

      // Create a table element
      const table = document.createElement('table');
      table.classList.add('facility-table');

      // Create table header row
      const headerRow = document.createElement('tr');

      // Add table header cells
      const headers = ['Facility ID', 'Facility Type ID', 'Facility Name', 'Address', 'City', 'Province', 'Postal Code', 'Phone Number', 'Web Address', 'Capacity', 'General Manager ID'];
      headers.forEach(headerText => {
          const headerCell = document.createElement('th');
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
      });
      table.appendChild(headerRow);

      // Loop through each object in the data array
      data.forEach(obj => {
          // Create a table row
          const row = document.createElement('tr');

          // Add table cells with object properties
          Object.values(obj).forEach(value => {
              const cell = document.createElement('td');
              cell.textContent = value;
              row.appendChild(cell);
          });

          // Append the row to the table
          table.appendChild(row);
      });

      // Append the table to the queryResult1 div
      queryResult1.appendChild(table);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


//CREATE RESIDENCE DATA FETCHING
document.getElementById('createResidenceForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collecting the new residence data
  const newResidenceData = {
      residence_type_id: document.getElementById('residenceTypeId').value,
      name: document.getElementById('residenceName').value,
      address: document.getElementById('residenceAddress').value,
      city: document.getElementById('residenceCity').value,
      province: document.getElementById('residenceProvince').value,
      postal_code: document.getElementById('residencePostalCode').value,
      phone_number: document.getElementById('residencePhoneNumber').value,
      number_of_bedrooms: document.getElementById('residenceBedrooms').value
  };

  // Sending the data to the server via a fetch() request
  fetch('/createResidence', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResidenceData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
      alert('Residence created successfully');
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Error creating residence');
  });
});

//DELETE RESIDENCE DATA FETCHING
document.getElementById('deleteResidenceForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the ID value from the input field
  const residenceId = document.getElementById('residenceId').value;

  // Sending the delete request to the server
  fetch('/deleteResidence', {
      method: 'DELETE', // Use the DELETE HTTP method
      headers: {
          'Content-Type': 'application/json', // Content type
      },
      body: JSON.stringify({ residence_id: residenceId }), // Send the facility ID in the request body
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); 
  })
  .then(data => {
      console.log(data); // Success message from the server
      alert('Facility deleted successfully');
  })
  .catch(error => {
      console.error('There was a problem with the delete operation:', error);
      alert('Error deleting facility');
  });
});

//VIEW RESIDENCE DATA FETCHING
document.getElementById('viewResidenceForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the ID value from the input field
  const facilityId = document.getElementById('viewResidenceId').value;

  // Sending the request to the server
  fetch(`/viewResidence/${residenceId}`) // Use template literals to include the facilityId in the URL
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Log the facility data

      // Displaying the facility info on the webpage
      const facilityDisplay = document.getElementById('residenceInfo');
      facilityDisplay.innerHTML = JSON.stringify(data, null, 2);
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Error retrieving facility information');
  });
});

//UPDATE RESIDENCE DATA FETCHING
document.getElementById('updateResidenceForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const updatedData = {
      // Capture the form data as key-value pairs
      residenceId: document.getElementById('residenceId').value,
      residenceName: document.getElementById('residenceName').value,
      residenceAddress: document.getElementById('residenceAddress').value,
      residenceCity: document.getElementById('residenceCity').value,
      residenceProvince: document.getElementById('residenceProvince').value,
      residencePostalCode: document.getElementById('residencePostalCode').value,
      residencePhoneNumber: document.getElementById('residencePhoneNumber').value,
      residenceBedrooms: document.getElementById('residenceBedrooms').value,
  };

  fetch('/updateResidence', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text(); // or .text() if not JSON
  })
  .then(data => {
      alert('Residence updated successfully');
      // Additional actions upon successful update
  })
  .catch(error => {
      console.error('Error updating residence:', error);
      alert('Error updating residence');
  });
});

//LIST ALL RESIDENCES FETCH
document.getElementById('allResidence').addEventListener('click', function() {
  fetch('/allResidence')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('allResidenceResult').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});



document.getElementById('runquery2').addEventListener('click', function() {
  fetch('/query8')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult2').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery3').addEventListener('click', function() {
  fetch('/query9')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult3').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});

document.getElementById('runquery10').addEventListener('click', function() {
  // Collect data from input fields
  const employeeId = document.getElementById('employee_id').value;
  const startDate = document.getElementById('start_date').value;
  const endDate = document.getElementById('end_date').value;
  
  // Send a POST request with the collected data
  fetch('/query10', {
      method: 'POST', // Specify the request method
      headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify({ // Convert the data to a JSON string
          employee_id: employeeId,
          start_date: startDate,
          end_date: endDate
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON in the response
  })
  .then(data => {
      // Display the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult10').innerText = JSON.stringify(data, null, 2);
  })
  .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery5').addEventListener('click', function() {
  fetch('/query11')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult5').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery6').addEventListener('click', function() {
  fetch('/query12')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult6').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery7').addEventListener('click', function() {
  fetch('/query13')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult7').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery8').addEventListener('click', function() {
  fetch('/query14')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult8').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery9').addEventListener('click', function() {
  fetch('/query15')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult9').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery10').addEventListener('click', function() {
  fetch('/query16')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult10').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery11').addEventListener('click', function() {
  fetch('/query17')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult11').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});


document.getElementById('runquery12').addEventListener('click', function() {
  fetch('/query18')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Displaying the result in the console or on the webpage
      console.log(data);
      document.getElementById('queryResult12').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
});

