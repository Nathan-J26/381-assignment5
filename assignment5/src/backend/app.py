# GROUP INFORMATION
# Nathan Jourdain (UCID: 30214488)
# Christian Vicaldo (UCID: 30205585)


from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load static JSON data
with open(os.path.join(BASE_DIR, "courses.json"), "r") as f:
    courses = json.load(f)

with open(os.path.join(BASE_DIR, "testimonials.json"), "r") as f:
    testimonials = json.load(f)

students = [
    {
        "id": 1,
        "username": "alice",
        "password": "Password123!",
        "email": "alice@example.com",
        "enrolled_courses": []
    } # adding one hardcoded student for testing
]


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() # Retrieves the JSON data from the incoming request and store it in a dictionary
    duplicateStudent = False
    for student in students:
        if(student["username"] == data["username"]):
            duplicateStudent = True
            break
    if(duplicateStudent):
        print(students)
        return "Error: Username is already in use. Please select another username."
    else:
        students.append(
            {
                "id":len(students)+1,
                "username":data["username"],
                "password":data["password"],
                "email":data["email"],
                "enrolled_courses":[]
            }
        )
        print(students)
        return "Successfully enrolled. Redirecting to login page."

@app.route('/login', methods=['POST'])
def login():
    print(type(testimonials))
    data = request.get_json()
    username = data['username']
    password = data['password']
    valid = False
    user = None
    for i in students:
        if(i["username"]==username):
            if(i["password"]==password):
                valid = True
                user = i
                break
    if valid:
        return {'success':True, 'message':"Successful Login", 'user':user}
    return {'success':False, 'message':"Error, no matching credentials"}

@app.route('/testimonials', methods=["GET"] )
def getTestimonials():
    random.shuffle(testimonials)
    return {'testimonials':testimonials[0:2]}

@app.route('/courses', methods=["GET"])
def getCourses():
    return{'courses':courses}


@app.route("/enroll/<int:student_id>", methods=["POST"])
def enroll_course(student_id):
    data = request.get_json()
    print(f"Enroll request for student {student_id}: {data}")
    
    for student in students:
        if student["id"] == student_id:
            if(data in student["enrolled_courses"]):
                return f"Course '{data.get('name')}' is already enrolled.", 400
            
            student["enrolled_courses"].append(data)
            print(students)
            return f"Course '{data.get('name')}' enrolled successfully!", 200

    return "Student not found.", 404

@app.route("/drop/<int:student_id>", methods=["DELETE"])
def drop_course(student_id):
    data = request.get_json()
    print(f"Drop request for student {student_id}: {data}")
    
    for student in students:
        print(student)
        if student["id"] == student_id:
            print(student)
            if(data in student["enrolled_courses"]):
                student["enrolled_courses"].remove(data)
                return f"Course '{data.get('name')}' dropped successfully!", 200
            
            return f"Course '{data.get('name')}' is not enrolled.", 400

    return "Student not found.", 404

@app.route("/student_courses/<int:student_id>", methods=["GET"])
def get_student_courses(student_id):
    for student in students:
        if student["id"] == student_id:
            return jsonify(student["enrolled_courses"]), 200
    return jsonify([]), 200


if __name__ == "__main__":
    app.run(debug=True)