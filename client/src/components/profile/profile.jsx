import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getUser } from "../../functions/getUser";
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
  if (!user) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>User Profile</h1>
        <h2>
          Welcome {user.firstName} {user.lastName}
        </h2>
        <p>Your Email: {user.email}</p>
        <p>Your Phone: {user.phone}</p>
        <p>Your Address: {user.address}</p>
        <p>Your City: {user.city}</p>
        <p>Your State: NY</p>
        <p>Your Zipcode: {user.zipcode}</p>

        <button>Edit Profile</button>

        <button>Save Changes</button>
      </div>
    );
  }
};

export default Profile;
