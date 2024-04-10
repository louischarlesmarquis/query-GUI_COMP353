
// create a person
const query3a = `INSERT INTO person ()
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// delete a person
const query3b = `DELETE FROM person
WHERE person.social_security_number = ?`;

const query3c = `UPDATE bkc353_4.person
SET first_name = ?, last_name = ?, date_of_birth = ?, social_security_number = ?, medicare = ?, phone_number = ?, residence_id = ?, citizenship = ?, email_address = ?
WHERE bkc353_4.person.social_security_number = ?`;

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
last_name DESC;`;

const query10 = `SELECT
f.facility_name,
DAYOFYEAR(s.date) AS day_of_year,
s.start_time,
s.end_time
FROM
schedule s
JOIN
facility f ON s.facility_id = f.facility_id
WHERE
s.employee_id = ?
AND s.date BETWEEN ? AND ?
ORDER BY
f.facility_name ASC,
DAYOFYEAR(s.date) ASC,
s.start_time ASC`;


const query21a = `
    INSERT INTO infection_history
    VALUES(?,?,?);
`;

// first ? = infection_date
// second = employee_id
const query21b = `SELECT DISTINCT e2.employee_id, p.email_address, p.first_name, p.last_name, f.facility_name, f.facility_id
FROM schedule s1
INNER JOIN employee e1 ON s1.employee_id = e1.employee_id
INNER JOIN person p ON e1.social_security_number = p.social_security_number
INNER JOIN schedule s2 ON s1.facility_id = s2.facility_id INNER JOIN facility as f on f.facility_id = s1.facility_id
    AND s2.date BETWEEN DATE_SUB(?, INTERVAL 14 DAY) AND ?
    AND (
        (s2.start_time BETWEEN s1.start_time AND s1.end_time)
        OR (s2.end_time BETWEEN s1.start_time AND s1.end_time)
        OR (s1.start_time BETWEEN s2.start_time AND s2.end_time)
        OR (s1.end_time BETWEEN s2.start_time AND s2.end_time)
    )
INNER JOIN employee e2 ON s2.employee_id = e2.employee_id
WHERE e1.social_security_number = ?
      AND e2.social_security_number != ?;`;

// insert in db the logs generated by the generated
const query21c = `INSERT INTO log VALUES(?,?,?,?,?,?)`;
const query11 = `WITH PERSON_INFO as (
    SELECT person.first_name, person.last_name, person.social_security_number, person.residence_id
    FROM person
),
UNIONED_RESIDENCES AS (
    SELECT E.social_security_number as "employee_SSN", PI.residence_id AS 'residence_id'
    FROM employee as E
    INNER JOIN PERSON_INFO PI
        ON PI.social_security_number = E.social_security_number
    INNER JOIN residence AS res_1
        on PI.residence_id = res_1.residence_id
UNION
    SELECT SR.social_security_number as "employee_SSN", SR.secondary_residence_id AS 'residence_id'
    FROM employee as E
    INNER JOIN secondary_residence SR
        ON E.social_security_number = SR.social_security_number
), -- UNION COLLECTS ALL THE PEOPLE LIVING TOGETHER
LIVING_TOGETHER AS (
SELECT UR.employee_SSN, UR.residence_id, PI.social_security_number
FROM UNIONED_RESIDENCES AS UR
INNER JOIN PERSON_INFO AS PI
    ON PI.residence_id = UR.residence_id
UNION ALL
SELECT UR.employee_SSN, UR.residence_id, SR.social_security_number
FROM UNIONED_RESIDENCES AS UR
INNER JOIN secondary_residence AS SR
    ON SR. secondary_residence_id = UR.residence_id)

SELECT LT.employee_SSN, E2.employee_id, LT.residence_id, LT.social_security_number, RT.residence_type_name, CONCAT(PI.first_name, ' ', PI.last_name) AS Name, Role.role_type_name as 'Occupation',
       REL_TYPE.relationship_type_name
FROM LIVING_TOGETHER AS LT
INNER JOIN residence AS RES
    ON RES.residence_id = LT.residence_id
INNER JOIN residence_type as RT
    on RT.residence_type_id = RES.residence_type_id
INNER JOIN PERSON_INFO AS PI
    ON PI.social_security_number = LT.social_security_number
INNER JOIN employee as E
    ON E.social_security_number = LT.social_security_number
INNER JOIN role_type as Role
    on Role.role_type_id = E.role_type_id
INNER JOIN employee AS E2
    on E2.social_security_number = LT.employee_SSN
LEFT JOIN relationship as REL
    on REL.employee_id = E2.employee_id AND REL.related_to = LT.social_security_number
LEFT JOIN relationship_type AS REL_TYPE
    on REL_TYPE.relationship_id = REL.relationship_type_id
WHERE E2.employee_id = ?;`

const query12 = `SELECT doctor.first_name,
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
`
const query14 = `WITH EMPLOYEES_3_RESIDENCES AS (
    SELECT social_security_number, COUNT(secondary_residence_id) AS 'num_sec_residences'
    FROM secondary_residence as SR
    GROUP BY social_security_number
    HAVING COUNT(secondary_residence_id) > 2
),
LAST_4_WEEKS AS (
    SELECT DISTINCT schedule.employee_id, person.social_security_number, role_type.role_type_name
    FROM schedule
    INNER JOIN employee
        ON employee.employee_id = schedule.employee_id
    INNER JOIN person
        on employee.social_security_number = person.social_security_number
    INNER JOIN role_type
        on role_type.role_type_id = employee.role_type_id
    INNER JOIN facility
        ON facility.facility_id = employee.facility_id
    WHERE
        DATE_SUB(CURDATE(),INTERVAL 4 WEEK) <= schedule.date
    AND employee.facility_id = ? -- FACILITY PLACEHOLDER
)
SELECT CONCAT(person.first_name, " ", person.last_name) as 'Name_first_last',
       L4W.role_type_name, E3R.num_sec_residences
FROM LAST_4_WEEKS AS L4W
INNER JOIN EMPLOYEES_3_RESIDENCES AS E3R
    ON E3R.social_security_number = L4W.social_security_number
INNER JOIN person
    ON person.social_security_number = L4W.social_security_number
ORDER BY
    role_type_name,
    num_sec_residences;
`
const query15 = `WITH nurse_history AS
(SELECT employee.employee_id AS nurse_employee_id,
        person.first_name,
        person.last_name,
        (SELECT MIN(start_date)
         FROM employee_history AS eh2
         WHERE eh2.employee_id = employee.employee_id) AS first_day_as_nurse,
        person.date_of_birth,
        person.email_address,
        employee.social_security_number AS nurse_ssn,
        eh.facility_id AS nurse_facility_id,
        eh.end_date
 FROM employee
    JOIN employee_history AS eh
        ON employee.employee_id = eh.employee_id
    INNER JOIN person
        ON employee.social_security_number = person.social_security_number
WHERE employee.role_type_id = 1),


nurse_with_2_facilities AS
(SELECT * FROM nurse_history
 WHERE end_date IS NULL
 GROUP BY nurse_employee_id
 HAVING COUNT(DISTINCT nurse_facility_id) >= 2),


infected_nurse_with_2_facilities_details AS
(SELECT DISTINCT
        nurse_employee_id,
        nurse_ssn,
        first_name,
        last_name,
        (SELECT COUNT(infection_type_id)
         FROM infection_history AS ih2
         WHERE ih2.social_security_number = nurse_ssn
         AND ih2.infection_type_id = 1) AS num_of_COVID_infections,
        (SELECT COUNT(dose_number)
         FROM vaccination_history AS vh2
         WHERE vh2.social_security_number = nurse_ssn) AS num_of_total_vaccines,
        (SELECT COUNT(*)
         FROM secondary_residence AS sr2
         WHERE sr2.social_security_number = nurse_ssn) AS num_of_secondary_residences,
        (SELECT SUM(TIMESTAMPDIFF(HOUR, start_time, end_time))
         FROM schedule AS s WHERE s.employee_id = nurse_employee_id) AS total_hours_worked,
        first_day_as_nurse,
        infection_date
 FROM nurse_with_2_facilities
 INNER JOIN infection_history AS ih
     ON ih.social_security_number = nurse_ssn
 WHERE ih.infection_date >= CURDATE() - 14)




SELECT * FROM infected_nurse_with_2_facilities_details;`

const query16 = `
SELECT
    rt.role_type_name,
    COUNT(DISTINCT e.employee_id) AS total_employees,
    COUNT(DISTINCT CASE WHEN ih.infection_date >= CURDATE() - INTERVAL 14 DAY THEN e.employee_id ELSE NULL END) AS total_infected_by_covid
FROM
    role_type rt
JOIN
    employee e ON rt.role_type_id = e.role_type_id
LEFT JOIN
    employee_history eh ON e.employee_id = eh.employee_id AND eh.end_date IS NULL
LEFT JOIN
    infection_history as ih ON e.social_security_number = ih.social_security_number AND ih.infection_type_id = (SELECT infection_type_id FROM infection_type WHERE infection_type_name = 'COVID-19')
WHERE
    eh.end_date is NULL -- Ensures the employee is currently employed
GROUP BY
    rt.role_type_name
ORDER BY
    rt.role_type_name ASC
`
const query17 = `WITH count_infected_by_role AS (
    SELECT employee.role_type_id, facility.facility_id, COUNT(person.social_security_number) as 'num_never_infected'
    FROM person
    INNER JOIN employee
        on employee.social_security_number = person.social_security_number
    INNER JOIN facility
        on facility.facility_id = employee.facility_id
    INNER JOIN employee_history as EH
        on employee.employee_id = EH.employee_id
    WHERE person.social_security_number not in (
        SELECT DISTINCT
            social_security_number
        FROM infection_history
        )
    AND EH.end_date IS NULL
    group by employee.role_type_id, facility.facility_id
),
all_employees as (SELECT employee.role_type_id, role_type_name, employee_history.facility_id, COUNT(employee.employee_id) AS 'all_employees_working'
FROM employee_history
LEFT JOIN employee
    ON employee.employee_iD = employee_history.employee_id
LEFT JOIN role_type
    on employee.role_type_id = role_type.role_type_id
WHERE employee_history.end_date IS NULL
GROUP BY employee.role_type_id, employee.facility_id)

SELECT role_type.role_type_id, facility.facility_id, all_employees.all_employees_working, count_infected_by_role.num_never_infected
FROM role_type
JOIN facility
LEFT JOIN count_infected_by_role
    on count_infected_by_role.facility_id = facility.facility_id
    AND count_infected_by_role.role_type_id = role_type.role_type_id
LEFT JOIN all_employees
    on all_employees.role_type_id = role_type.role_type_id
    AND all_employees.facility_id = facility.facility_id
WHERE all_employees_working IS NOT NULL -- REMOVING FACILITIES WHERE NO EMPLOYEES ARE CURRENTLY WORKING
ORDER BY role_type_id
`
const query18 = `
# application should provide the time period for the time_worked subquery
SELECT province_abbreviation as province,
      COUNT(f.facility_id) as num_of_facilities,
      (SELECT COUNT(eh.employee_id)
       FROM employee_history as eh
       JOIN facility as f2
       WHERE eh.facility_id = f2.facility_id
       AND eh.end_date IS NULL
       AND f2.province = province_abbreviation) as num_of_employees_in_facilities,
       (SELECT COUNT(eh.employee_id)
       FROM employee_history as eh
       NATURAL JOIN employee as e
       JOIN infection_history as ih
           ON e.social_security_number = ih.social_security_number
       JOIN facility as f3
           ON e.facility_id = f3.facility_id
       WHERE eh.end_date IS NULL
       AND ih.infection_type_id = 1
       AND f3.province = province_abbreviation
       AND CURDATE() - ih.infection_date <= 14 ) as employees_working_and_infec_by_covid19,
       SUM(f.capacity) as maximum_capacity,
       (SELECT SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) as worked_hours
        FROM schedule AS s
        JOIN facility as f4
           ON f4.facility_id = s.facility_id
        WHERE start_time >= ? AND start_time < ?
        AND end_time >= ? AND end_time <= ?
        AND province_abbreviation = f4.province) as time_worked
FROM province as p
LEFT JOIN facility as f
   ON p.province_abbreviation = f.province
GROUP BY province_abbreviation
ORDER BY province_abbreviation; # order by ASC for province_abbreviation is redundant`

module.exports = {
    query3b,
    query3a,
    query3c,
    query8,
    query9,
    query10,
    query21a,
    query21b,
    query21c,
    query11,
    query12,
    query14,
    query15,
    query16,
    query17,
    query18
};