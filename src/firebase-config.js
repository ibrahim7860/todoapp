import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, OAuthProvider } from 'firebase/auth'

export const firebaseConfig = {
    apiKey: "AIzaSyAuHi-aACIg9q_gsKqYjOYvCr6lBp5Bmh8",
    authDomain: "todo-app-86fb4.firebaseapp.com",
    projectId: "todo-app-86fb4",
    storageBucket: "todo-app-86fb4.appspot.com",
    messagingSenderId: "828888171542",
    appId: "1:828888171542:web:0b1228d079aa075ec16137",
    measurementId: "G-43VZGW78QJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        const googleCredential = GoogleAuthProvider.credentialFromResult(result);
        const googleToken = googleCredential.accessToken;
        const googleUser = result.user
    }).catch((error) => alert(error.message))
}

const providerTwo = new FacebookAuthProvider()
export const signInWithFacebook = () => {
    signInWithPopup(auth, providerTwo).then((result) => {
        const facebookCredential = FacebookAuthProvider.credentialFromResult(result);
        const facebookToken = facebookCredential.accessToken;
        const facebookUser = result.user;
    }).catch((error) => alert(error.message))
}

const providerThree = new OAuthProvider('microsoft.com')
export const signInWithMicrosoft = () => {
    signInWithPopup(auth, providerThree).then((result) => {
        const microsoftCredential = providerThree.credentialFromResult(result);
        const microsoftToken = microsoftCredential.accessToken;
        const microsoftUser = result.user;
    }).catch((error) => alert(error.message))
}