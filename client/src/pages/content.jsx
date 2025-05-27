import React from 'react';

function Content() {
  return (
    <div>
      {/* Cards Section */}
      <div className="card-section">
        <div className="card">
          <h1>Total Analysis</h1>
          <p style={{ color: "red", fontSize: "25px" }}>100</p>
        </div>

        <div className="card">
          <h1>Recent Uploads</h1>
          <p style={{ color: "red", fontSize: "25px" }}>50</p>
        </div>

        <div className="card">
          <h1>Completed Reports</h1>
          <p style={{ color: "red", fontSize: "25px" }}>28</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <div className="table-card">
          <h2 className="recent-activity-title">Recent Activity</h2>
          <table>
            <thead>
              <tr>
                <th style={{ color: "purple", fontSize: "20px" }}>Date</th>
                <th style={{ color: "purple", fontSize: "20px" }}>Analysis Type</th>
                <th style={{ color: "purple", fontSize: "20px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oct 23, 2024</td>
                <td>Image Segmentation</td>
                <td className="completed">Completed</td>
              </tr>
              <tr>
                <td>October 23, 2024</td>
                <td>Image Processing</td>
                <td className="completed">Completed</td>
              </tr>
              <tr>
                <td>October 23, 2024</td>
                <td>Report Generation</td>
                <td className="completed">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Content;
