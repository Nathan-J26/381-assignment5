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
        "password": "password123",
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

if __name__ == "__main__":
    app.run(debug=True)