import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { getFirestore, deleteDoc, query, getDocs, collection, where, addDoc } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBlWegVlkM6k2iwE7VDhUg6JnwxM3tarTs",
    authDomain: "fasalcoassign.firebaseapp.com",
    projectId: "fasalcoassign",
    storageBucket: "fasalcoassign.appspot.com",
    messagingSenderId: "1098531026779",
    appId: "1:1098531026779:web:414cb51355a560fbd88c7e",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async() => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const logInWithEmailAndPassword = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const registerWithEmailAndPassword = async(name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const sendPasswordReset = async(email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const addMovieWatchlist = async(movie) => {
    try {
        const user = getAuth(app).currentUser;
        if (!user) return;

        const q = query(collection(db, "users"), where("uid", "==", user.uid));

        const docs = await getDocs(q);
        const docId = docs.docs[0].ref.id;
        const watchlistRef = collection(db, "users/" + docId + "/watchlist");
        const watchlistDoc = await getDocs(watchlistRef);

        if (watchlistDoc.docs.filter((doc) => doc.data().imdbID === movie.imdbID).length > 0) {
            alert("Movie already in watchlist");
            return;
        }

        // console.log(docs2.docs[0].data().watchlist);

        await addDoc(collection(docs.docs[0].ref, "watchlist"), {
            ...movie,
        });
        // alert("Movie added to watchlist");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const getMovieWatchList = async(uid) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", uid));

        const docs = await getDocs(q);
        const docId = docs.docs[0].ref.id;
        const watchlistRef = collection(db, "users/" + docId + "/watchlist");
        const watchlistDoc = await getDocs(watchlistRef);

        const data = watchlistDoc.docs.map((e) => e.data());
        return data;
    } catch (error) {
        alert(error);
    }
};

const deleteMovieWatchlist = async(movie) => {
    try {
        const user = getAuth(app).currentUser;
        if (!user) return;

        const q = query(collection(db, "users"), where("uid", "==", user.uid));

        const docs = await getDocs(q);
        const docId = docs.docs[0].ref.id;
        const watchlistRef = query(collection(db, "users/" + docId + "/watchlist"), where("imdbID", "==", movie.imdbID));
        const watchlistDoc = await getDocs(watchlistRef);

        await deleteDoc(watchlistDoc.docs[0].ref);
    } catch (error) {}
};

const logout = () => {
    signOut(auth);
};
export {
    auth,
    deleteMovieWatchlist,
    addMovieWatchlist,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};