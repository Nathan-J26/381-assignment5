import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CourseItem from "./CourseItem";
import EnrollmentList from "./EnrollmentList";

const CoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [theCourses, setTheCourses] = useState([]);

  // Fetch all available courses
  useEffect(() => {
    fetch("http://127.0.0.1:5000/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTheCourses(data["courses"]);
      });
  }, []);

  // Fetch enrolled courses from backend when page loads
  useEffect(() => {
    const studentId = localStorage.getItem("studentID");
    if (!studentId) return;

    fetch(`http://127.0.0.1:5000/student_courses/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const coursesWithIds = data.map((course) => ({
          ...course,
          enrollmentId: Date.now() + Math.random(), // generate unique IDs
        }));
        setEnrolledCourses(coursesWithIds);
        localStorage.setItem("enrollments", JSON.stringify(coursesWithIds));
      })
      .catch((error) => {
        console.error("Failed to fetch enrolled courses:", error);
        setEnrolledCourses([]);
      });
  }, []);

  // Save to localStorage when enrolledCourses changes
  useEffect(() => {
    localStorage.setItem("enrollments", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const handleEnroll = async (course) => {
    const studentId = localStorage.getItem("studentID");
    course = {
      ...course,
      enrollmentId: Date.now(), // add a unique enrollmentID
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/enroll/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      const message = await response.text();

      if (response.ok) {
        setEnrolledCourses((prev) => [
          ...prev,
          {
            ...course,
          },
        ]);
        alert(message);
      } else {
        alert("Enrollment failed: " + message);
      }
    } catch (error) {
      alert("Error during enrollment. Try again later.");
      console.error(error);
    }
  };

  const handleRemove = async (enrollmentId) => {
    const studentId = localStorage.getItem("studentID");
    const courseToDrop = enrolledCourses.find(course => course.enrollmentId === enrollmentId);
    if (!courseToDrop) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/drop/${studentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseToDrop),
      });

      const message = await response.text();

      if (response.ok) {
        setEnrolledCourses((prev) =>
          prev.filter((course) => course.enrollmentId !== enrollmentId)
        );
        alert(message);
      } else {
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error("Failed to drop course:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "20px",
          gap: "30px",
        }}
      >
        <div style={{ flex: 3 }}>
          <h2 style={{ color: "#004080" }}>Available Courses</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {theCourses.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>

        <EnrollmentList
          enrolledCourses={enrolledCourses}
          onRemove={handleRemove}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
