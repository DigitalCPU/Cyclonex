// 🔹 Import Firebase
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore, doc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Initialize Firebase
const auth = getAuth();
const db = getFirestore();

// 🔹 Signup Function
async function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            let user = userCredential.user;
            console.log("User signed up:", user);

            // 🔹 Store user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                friends: [],
                profileSettings: {}
            });

            alert("Account created successfully!");
        })
        .catch(error => {
            console.error("Signup Error:", error.message);
            alert(error.message);
        });
}

// 🔹 Login Function
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log("User logged in:", user);
            alert("Login successful!");
        })
        .catch(error => {
            console.error("Login Error:", error.message);
            alert(error.message);
        });
}

// 🔹 Logout Function
async function logout() {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
            alert("Logged out successfully!");
        })
        .catch(error => {
            console.error("Logout Error:", error.message);
        });
}

// 🔹 Update Sidebar with Logged-in User's Email
function updateUserInfo() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            document.getElementById("username-display").innerText = user.email; // Show email
        } else {
            // User is logged out
            document.getElementById("username-display").innerText = "Not logged in";
        }
    });
}

// 🔹 Run function to check user login status when page loads
updateUserInfo();

// 🔹 Sidebar Toggle Function (Keep this at the bottom)
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.transform === "translateX(0px)") {
        sidebar.style.transform = "translateX(-250px)"; // Hide sidebar
    } else {
        sidebar.style.transform = "translateX(0px)"; // Show sidebar
    }
}
