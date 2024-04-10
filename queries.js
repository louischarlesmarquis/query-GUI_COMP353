const query8 = `
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
ORDER BY province, city, facility_type_name, doctor_count;
`
const query9 = `SELECT person.first_name,
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
last_name DESC;`

module.exports = {
    query8,
    query9,
};