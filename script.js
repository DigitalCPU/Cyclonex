import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHi0cT2Pk_aymI2yFr_TrFQJfMWfrZ6C8",
    authDomain: "lifelike-cd485.firebaseapp.com",
    projectId: "lifelike-cd485",
    storageBucket: "lifelike-cd485.firebasestorage.app",
    messagingSenderId: "621008241447",
    appId: "1:621008241447:web:3920e1234de6383fcd5f02"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const usernameDisplay = document.getElementById("username-display");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const friendsList = document.getElementById("friends-list");
    const followersList = document.getElementById("followers-list");

    window.toggleSidebar = function() {
        if (sidebar) {
            sidebar.classList.toggle("hidden");
        } else {
            console.error("Sidebar element not found");
        }
    };

    window.signup = async function() {
        const email = emailInput?.value;
        const password = passwordInput?.value;
        if (email && password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    friends: [],
                    followers: []
                });
                alert("Sign up successful!");
            } catch (error) {
                alert("Error: " + error.message);
            }
        } else {
            alert("Please enter email and password.");
        }
    };

    window.login = async function() {
        const email = emailInput?.value;
        const password = passwordInput?.value;
        if (email && password) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                if (usernameDisplay) usernameDisplay.textContent = email.split("@")[0];
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    if (friendsList) friendsList.innerHTML = userDoc.data().friends.map(friend => `<p>${friend}</p>`).join('');
                    if (followersList) followersList.innerHTML = userDoc.data().followers.map(follower => `<p>${follower}</p>`).join('');
                }
                alert("Logged in successfully!");
            } catch (error) {
                alert("Error: " + error.message);
            }
        } else {
            alert("Please enter email and password.");
        }
    };

    window.logout = async function() {
        try {
            await signOut(auth);
            if (usernameDisplay) usernameDisplay.textContent = "Not logged in";
            if (friendsList) friendsList.innerHTML = "";
            if (followersList) followersList.innerHTML = "";
            alert("Logged out successfully.");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };
});
