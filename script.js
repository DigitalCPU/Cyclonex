import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.appspot.com",
    messagingSenderId: "YOUR-SENDER-ID",
    appId: "YOUR-APP-ID"
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
        sidebar.classList.toggle("hidden");
    };

    window.signup = async function() {
        const email = emailInput.value;
        const password = passwordInput.value;
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
        const email = emailInput.value;
        const password = passwordInput.value;
        if (email && password) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                usernameDisplay.textContent = email.split("@")[0];
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    friendsList.innerHTML = userDoc.data().friends.map(friend => `<p>${friend}</p>`).join('');
                    followersList.innerHTML = userDoc.data().followers.map(follower => `<p>${follower}</p>`).join('');
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
            usernameDisplay.textContent = "Not logged in";
            friendsList.innerHTML = "";
            followersList.innerHTML = "";
            alert("Logged out successfully.");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };
});
