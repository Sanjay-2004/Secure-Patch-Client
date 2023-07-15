import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function FromUsers() {
  const [bugReports, setBugReports] = useState([]);

  useEffect(() => {
    fetchBugReports();
  }, []);

  const fetchBugReports = async () => {
    try {
      const response = await axios.get(`${process.env.VITE_BASE_URL}/bugs`);
      const data = response.data;

      setBugReports(data);
    } catch (error) {
      console.error('Error fetching bug reports:', error);
    }
  };

  const handleCheckboxChange = async (event, bugId) => {
    const isChecked = event.target.checked;

    try {
      await axios.put(`${process.env.VITE_BASE_URL}/bugs/${bugId}`, { okbyReporter: isChecked });

      fetchBugReports();
    } catch (error) {
      console.error('Error updating bug report:', error);
    }
  };


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2>NEW BUGS:</h2>
          <ul className="list-group my-2" id="bugsByUsers">
            {bugReports
              .filter((bug) => !bug.okbyReporter)
              .map((bug) => (
                <li className="list-group-item" key={bug._id}>
                  <strong>Email:</strong> {bug.email}
                  <br />
                  <strong>Bug Description:</strong> {bug.bugDescription}
                  <br />
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={bug.okbyReporter}
                      onChange={(event) => handleCheckboxChange(event, bug._id)}
                    />
                    <label className="form-check-label">
                      Mark as Reported
                    </label>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>REPORTED:</h2>
          <ul className="list-group my-2" id="reportedBugs">
            {bugReports
              .filter((bug) => bug.okbyReporter)
              .map((bug) => (
                <li className="list-group-item" key={bug._id}>
                  <strong>Email:</strong> {bug.email}
                  <br />
                  <strong>Bug Description:</strong> {bug.bugDescription}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
