
// Firebase Configuration for Concept Market
// Project: concept-market-20e5a

export const firebaseConfig = {
  apiKey: "AIzaSyDuAQyzfzr1mSspajT48X516BqBAK9ALAw",
  authDomain: "concept-market-20e5a.firebaseapp.com",
  projectId: "concept-market-20e5a",
  storageBucket: "concept-market-20e5a.firebasestorage.app",
  messagingSenderId: "589768366742",
  appId: "1:589768366742:web:2ca4c3a5b7c519ed9b00b7",
  measurementId: "G-LSJMT2KJJL"
};

export const isConfigured = () => {
  return firebaseConfig.projectId !== "";
};
