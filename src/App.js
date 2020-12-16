import React, { useState, useRef } from "react";
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB_9l7jzZFX8l3UoeWw1wf-VVCuZfLFGak",
  authDomain: "superchat-ntb.firebaseapp.com",
  databaseURL: "https://superchat-ntb.firebaseio.com",
  projectId: "superchat-ntb",
  storageBucket: "superchat-ntb.appspot.com",
  messagingSenderId: "1040163697098",
  appId: "1:1040163697098:web:a0be28d34a2cf575d41f33",
  measurementId: "G-LH898R3RPZ"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
      <h1>NTB</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section> 
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => {
      return auth.signOut();
    }}>Sign out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(5000);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState(''); 

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <>
      <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
      </main>
    <form onSubmit={sendMessage}>
    <input  value={formValue} placeholder="Type message.." onChange={(e) => setFormValue(e.target.value)} />

    <button type="submit" disabled={!formValue}><img src="./send.png" alt="shit" /></button>

    </form>
    </>
  )
}

function ChatMessage(props) {
  const  { text, uid, photoURL } = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src= { photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    </>
  )
}

export default App;
