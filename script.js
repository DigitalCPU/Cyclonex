// 🔹 Import Firebase
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Initialize Firebase
const auth = getAuth();
const db = getFirestore();

// 🔹 Signup Function
async function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let username = prompt("Enter a username:"); // Ask for a username

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            let user = userCredential.user;
            console.log("User signed up:", user);

            // 🔹 Store user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email,
                friends: []
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

// 🔹 Update Sidebar with Logged-in User's Info
function updateUserInfo() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                let userData = userDoc.data();
                document.getElementById("username-display").innerText = userData.username;
            } else {
                document.getElementById("username-display").innerText = "No username found";
            }
        } else {
            document.getElementById("username-display").innerText = "Not logged in";
        }
    });
}

// 🔹 Run function when page loads
updateUserInfo();

// 🔹 Add Friend Function
async function addFriend() {
    let friendEmail = document.getElementById("friend-email").value;
    let user = auth.currentUser;

    if (!user) {
        alert("You must be logged in!");
        return;
    }

    // 🔍 Find the friend in Firestore by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", friendEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("Friend not found!");
        return;
    }

    let friendDoc = querySnapshot.docs[0];
    let friendId = friendDoc.id;

    // 🔹 Add friend to the user's friends list
    await updateDoc(doc(db, "users", user.uid), {
        friends: arrayUnion(friendId)
    });

    alert("Friend added!");
}

// 🔹 Update Friends List in Sidebar
async function updateFriendsList() {
    let user = auth.currentUser;
    if (!user) return;

    let userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return;

    let userData = userDoc.data();
    let friendsContainer = document.getElementById("friends-list");

    friendsContainer.innerHTML = ""; // Clear previous list

    for (let friendId of userData.friends) {
        let friendDoc = await getDoc(doc(db, "users", friendId));
        if (friendDoc.exists()) {
            let friendData = friendDoc.data();
            let friendElement = document.createElement("div");
            friendElement.innerText = friendData.username;
            friendsContainer.appendChild(friendElement);
        }
    }
}

// 🔹 Update friends list when user logs in
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateFriendsList();
    }
});

// 🔹 Sidebar Toggle Function (Keep this at the bottom)
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.transform === "translateX(0px)") {
        sidebar.style.transform = "translateX(-250px)"; // Hide sidebar
    } else {
        sidebar.style.transform = "translateX(0px)"; // Show sidebar
    }
}
