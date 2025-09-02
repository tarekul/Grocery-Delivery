import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getUser } from "../../functions/getUser";
import { updateUser } from "../../functions/updateUser";
import "./profile.css";
import ZipDropdown from "../zip-dropdown/zip-dropdown";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("NY");
  const [zipcode, setZipcode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { firebaseUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      const user = await getUser(firebaseUser.uid);
      setUser(user);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "NY");
      setZipcode(user.zipcode || "");
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      default:
        break;
    }
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateUser(firebaseUser.uid, {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipcode,
      });
      setUser({
        ...user,
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipcode,
      });
      setEditing(false);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h1>User Profile</h1>
      {!editing ? (
        <>
          <h2>
            Welcome {user.firstName} {user.lastName}
          </h2>
          <p>Your Email: {user.email}</p>
          <p>Your Phone: {user.phone}</p>
          <p>Your Address: {user.address}</p>
          <p>Your City: {user.city}</p>
          <p>Your Zipcode: {user.zipcode}</p>

          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <>
          <div className="grid">
            <label>
              First Name
              <input
                name="firstName"
                value={firstName}
                onChange={onChange}
              />
            </label>
            <label>
              Last Name
              <input
                name="lastName"
                value={lastName}
                onChange={onChange}
              />
            </label>
            <label>
              Phone
              <input name="phone" value={phone} onChange={onChange} />
            </label>
            <label>
              Address
              <input name="address" value={address} onChange={onChange} />
            </label>
            <label>
              City
              <input name="city" value={city} onChange={onChange} />
            </label>
            <label>
              State
              <p>{state}</p>
            </label>
            <label>
              Zip Code
              <ZipDropdown
                zipcode={zipcode}
                setZipcode={setZipcode}
              />
            </label>
          </div>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <button disabled={saving} onClick={onSave}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            disabled={saving}
            onClick={() => {
              setEditing(false);
              setError("");
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
