import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegForm.module.css';

const RegForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');



    function validateUsername(user_inp) {
        // username between 3 and 20
        let alpharegex = /[a-zA-Z]/;
        let alpha_numregex = /[a-zA-Z0-9]/;
  
        if (user_inp.length < 3 || user_inp.length > 20) {
          return false;
        }
  
        // if it does not start with a letter,
        if (!user_inp[0].match(alpharegex)) {
          return false;
        }
  
        for (let i = 0; i < user_inp.length; i++) {
          if (
            // if the character is not alphanumeric, hyphen, and underscore
            !user_inp[i].match(alpha_numregex) &&
            user_inp[i] != "-" &&
            user_inp[i] != "_"
          ) {
            return false;
          }
        }
        return true;
    }
  
    function validatePassword(user_inp) {
        let regex = [
            /[a-z]/,
            /[A-Z]/,
            /[0-9]/,
            /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~]/,
        ];

        // for mustcontain: let [0] = uppercase, [1] = lowercase, [2] = number, [3] = special character
        let mustcontain = [0, 0, 0, 0];

        if (user_inp.length < 8) {
            // must be at least 8 char
            return false;
    }

    for (let i = 0; i < user_inp.length; i++) {
        for (let j = 0; j < regex.length; j++) {
        // check if the character matches with upper/lowercase, number, or regex and
        // increment the mustcontain value for that.
        if (user_inp[i].match(regex[j])) {
            mustcontain[j] += 1;
        }
        }

        if (
        // if the character does not match any of them,
        !user_inp[i].match(regex[0]) &&
        !user_inp[i].match(regex[1]) &&
        !user_inp[i].match(regex[2]) &&
        !user_inp[i].match(regex[3])
        ) {
        return false;
        }
    }

    for (let i = 0; i < mustcontain.length; i++) {
        if (mustcontain[i] == 0) {
        // if one of the mustcontain characters is 0
        return false;
        }
    }

    return true;
    }
  
    function validateMatch(first, second) {
        if (first.length != second.length) {
            return false;
        }
        // Make sure it matches password
        for (let i = 0; i < first.length; i++) {
            if (first[i] != second[i]) {
            return false;
            }
        }
        return true;
    }
  
    function validateEmail(user_inp) {
        let emailRegex = /^[a-z0-9_.]+@[a-z]+\.[a-z]+$/i;
        // email must be in the form abc123@something.xyz
        return emailRegex.test(user_inp);
    }

    function validateSignUp() {
        let div_box = document.getElementById("login-div");
        let msg_boxes = [
            document.getElementById("username_msg"),
            document.getElementById("password_msg"),
            document.getElementById("password_match_msg"),
            document.getElementById("email_msg"),
        ];

        for (let i = 0; i < msg_boxes.length; i++) {
            //reset the msg displays if user is retrying to sign up
            msg_boxes[i].style.display = "none";
        }
        let username_valid = validateUsername(
            document.getElementById("username").value
        );
        console.log(document.getElementById("username").value, username_valid);
        
        let password_valid = validatePassword(
            document.getElementById("password").value
        );
        console.log(document.getElementById("password").value);

        let password_confirm_valid = validateMatch(
            document.getElementById("password").value,
            document.getElementById("confirm-password").value
        );
        console.log(document.getElementById("confirm-password").value);

        let email_valid = validateEmail(document.getElementById("email").value);
        console.log(document.getElementById("email").value);

        if (!username_valid) {
            msg_boxes[0].style.display = "block";
        }
        if (!password_valid) {
            msg_boxes[1].style.display = "block";
        }
        if (!password_confirm_valid) {
            msg_boxes[2].style.display = "block";
        }
        if (!email_valid) {
            msg_boxes[3].style.display = "block";
        }
        div_box.style.display = "block";
        console.log(
            username_valid,
            password_valid,
            password_confirm_valid,
            email_valid
        );

        if (
            username_valid &&
            password_valid &&
            password_confirm_valid &&
            email_valid
        ) {
            console.log("LOGIN WILL WORK"); // THIS WILL ROUTE TO BACKEND ONCE SETUP

            handleSubmit();

        }
    }

    // Function to handle form submission
    async function handleSubmit(event) {
        // event.preventDefault();
    
        const backendEndpoint = 'http://127.0.0.1:5000/register';
        try {
        const response = await fetch(backendEndpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({'username':username, "password":password, "email":email}), //Converts a JavaScript object or value into a JSON string.
        });
    
        const data = await response.text();
    
        if (response.ok) {
            console.log(data);
            document.getElementById("signup_status").textContent = data;
            if(data == "Successfully enrolled. Redirecting to login page.") {
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
            console.log('Form submitted successfully!');
        } else {
            console.error('Form submission failed.');
        }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    }

    return (
        <div className="login">
            <h2>Sign Up</h2>
            <form>
                <label htmlFor="username">Username:</label>
                <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                onChange={(e) => setUsername(e.target.value)}/>
                <br /><br />

                <label htmlFor="password">Password:</label>
                <input
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}/>
                <br /><br />

                <label htmlFor="password">Confirm Password:</label>
                <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required/>
                <br /><br />

                <label htmlFor="email">Email:</label>
                <input 
                type="email" 
                id="email" 
                name="email" 
                required
                onChange={(e) => setEmail(e.target.value)}/>
                <br />
            </form>
            <br />
            <br />
            <button onClick={validateSignUp} className="signup">Signup</button>
            <div id="login-div">
                <p id="username_msg">
                Invalid Username (Reason:Must be 3-20 characters, start with a letter,
                and only contains (a-z, A-Z, 0-9), "-", or "_")
                </p>
                <p id="password_msg">
                Invalid Password (Reason:At least 8 characters with no spaces, contain
                at least one of each: uppercase, lowercase, number, and special
                character)
                </p>
                <p id="password_match_msg">Passwords do not match</p>
                <p id="email_msg">
                Invalid Email (Reason:Must be valid email address format, with no
                spaces "username@example.com")
                </p>
                <p id="signup_status"></p>
            </div>
        </div>
    )
}

export default RegForm;