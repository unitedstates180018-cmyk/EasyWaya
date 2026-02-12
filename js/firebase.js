import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCVC05ibpNKzg1ERe0tNIFh8B0V4uIcOQI",
  authDomain: "easywaya-af4aa.firebaseapp.com",
  projectId: "easywaya-af4aa",
  storageBucket: "easywaya-af4aa.firebasestorage.app",
  messagingSenderId: "970416705354",
  appId: "1:970416705354:web:226152c8e42e1f35b77bb3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Recaptcha
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'normal'
});

// 📲 Send OTP
window.sendOTP = function () {

  let number = document.getElementById("phoneNumber").value.trim();

  if (number.length !== 10) {
    alert("Enter valid 10 digit Indian number");
    return;
  }

  let phoneNumber = "+91" + number;

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("OTP Sent");
      document.getElementById("otpSection").style.display = "block";
    })
    .catch((error) => {
      alert(error.message);
    });
};

// 🔐 Verify OTP
window.verifyOTP = async function () {

  let code = document.getElementById("otpCode").value;

  if (!code) {
    alert("Enter OTP");
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    // 🔥 Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      phoneNumber: user.phoneNumber,
      online: true,
      createdAt: serverTimestamp()
    }, { merge: true });

    alert("Login Successful ✅");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Invalid OTP ❌");
  }
};
