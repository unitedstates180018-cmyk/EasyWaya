import { auth, db } from "./firebase.js";
import { collection, addDoc, query, orderBy, onSnapshot }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");

document.getElementById("sendBtn").onclick = async () => {

    if(input.value.trim() === "") return;

    await addDoc(collection(db, "messages"), {
        text: input.value,
        uid: auth.currentUser.uid,
        timestamp: Date.now()
    });

    input.value = "";
};

const q = query(collection(db, "messages"), orderBy("timestamp"));

onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach(doc => {
        const data = doc.data();

        messagesDiv.innerHTML += 
            `<div class="message">${data.text}</div>`;
    });
});
