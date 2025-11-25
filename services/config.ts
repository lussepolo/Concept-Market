
// Instructions:
// 1. Copy the values from your Firebase Console (Project Settings > General > Your Apps)
// 2. Paste them inside the quotes below.

export const firebaseConfig: any = {
  apiKey: "AIzaSyCHelBONW-eeGwQ1_EEd-Uygq4m72TwdzY",
  authDomain: "concept-market-2025.firebaseapp.com",
  projectId: "concept-market-2025",
  storageBucket: "concept-market-2025.firebasestorage.app",
  messagingSenderId: "597860736950",
  appId: "1:597860736950:web:91ec584a7f94103a74ab17",
  measurementId: "G-BCT71NM326"
};

export const isConfigured = () => {
  return firebaseConfig.projectId !== "";
};
