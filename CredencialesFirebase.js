/*----------------------------------------------------------*/

/*------------------------------*/
/*-- Credenciales de Firebase --*/
/*------------------------------*/

const firebaseConfig = {
    apiKey: "AIzaSyBnI8sAuQAoOlwe2nLvtFcxN3vVvqZJoDg",
    authDomain: "lipslide-skateshop.firebaseapp.com",
    projectId: "lipslide-skateshop",
    storageBucket: "lipslide-skateshop.firebasestorage.app",
    messagingSenderId: "276288760779",
    appId: "1:276288760779:web:29d23d1e05f0479beea44e",
    measurementId: "G-F7ST6LW8L6"
}

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/*----------------------------------------------------------*/