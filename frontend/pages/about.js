export default function About() {
    return (
      <div className="container">
        <h1>About This Application</h1>
        <div className="about-content">
          <p>
            This is a simple CRUD application built with React, Next.js, Node.js, and Microsoft SQL Server.
            It allows users to manage a list of records with the following features:
          </p>
          <ul>
            <li>Create new records </li>
            <li>View all records in a table format</li>
            <li>Edit existing records</li>
            <li>Delete records with confirmation</li>
          </ul>
          <p>
            The application is containerized using Docker and Docker Compose for easy deployment.
            It was developed as a demonstration of full-stack development capabilities.
          </p>
          <p>Version: 1.0.0 | Date: April 2025</p>
        </div>
      </div>
    );
  }