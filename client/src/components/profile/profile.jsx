import React, { useState } from "react";
import { getUser } from "../../functions/getUser";
import { useAuth } from "../../contexts/authContext";
const Profile = () => {
    const [user, setUser] = useState(null);
    const { firebaseUser } = useAuth();
    React.useEffect(() => {
        if (firebaseUser) {
            getUser(firebaseUser.uid)
                .then((data) => {
                    setUser(data);
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err);
                });
        }
    }, [firebaseUser]);
    console.log("Firebase User in Profile:", firebaseUser.uid);
    if (!user) {
        return <div>Loading...</div>;
    } else { 
        return (
            <div>
            <h1>User Profile</h1>
            <h2>Welcome {getUser().name}</h2>
            <p>Your Email: {getUser().email}</p>
            <p>Your Phone: {getUser().phone}</p>
            <p>Your Address: {getUser().address}</p>
            <p>Your City: {getUser().city}</p>
            <p>Your State: {getUser().state}</p>
            <p>Your Zipcode: {getUser().zipcode}</p>

            <button>Edit Profile</button>
            
            <button>Save Changes</button>
            </div>
        ) 
    }
};

export default Profile;
