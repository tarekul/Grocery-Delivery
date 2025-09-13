import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getUser } from "../../functions/getUser";
import { updateUser } from "../../functions/updateUser";
import { uploadAvatar } from "../../functions/uploadAvatar"; // new helper
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
    try {
      const u = await getUser(firebaseUser.uid);
      setUser(u);
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
      setPhone(u.phone || "");
      setAddress(u.address || "");
      setCity(u.city || "");
      setState(u.state || "NY");
      setZipcode(u.zipcode || "");
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser({}); // optional: avoid infinite loading
    }
  })();
}, [firebaseUser]);   // <-- IMPORTANT

const [changes, setChanges] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        changes.firstName = value;
        break;
      case "lastName":
        setLastName(value);
        changes.lastName = value;
        break;
      case "phone":
        setPhone(value);
        changes.phone = value;
        break;
      case "address":
        setAddress(value);
        changes.address = value;
        break;
      case "city":
        setCity(value);
        changes.city = value;
        break;
      case "state":
        setState(value);
        break;
      case "zipcode":
        setZipcode(value);
        changes.zipcode = value;
        break;
      default:
        break;
    }
// track changes in state
  setChanges((prev) => ({
    ...prev,
    [name]: value
  }));

  };
 

  const onSave = async () => {
    const hasChanges = [
      firstName,
      lastName,
      phone,
      address,
      city,
      zipcode,
    ].some((field, index) => field !== (Object.values(user)[index] || ""));

    if (!hasChanges) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
        
      const updatedUser = await updateUser(firebaseUser.uid, {
        ...changes
      });
      setUser(updatedUser);
      setEditing(false);
    } catch (e) {
      setError(e?.response?.data || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPick = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setSaving(true); setError("");

  try {
    const url = await uploadAvatar(firebaseUser.uid, file, {
      onProgress: (p) => console.log("upload", p, "%")
    });
    // Save the URL to your backend/Firestore (so profile has photoURL)
    const updated = await updateUser(firebaseUser.uid, { photoURL: url });
    setUser(updated);
  } catch (err) {
    console.error(err);
    setError("Failed to update avatar.");
  } finally {
    setSaving(false);
    e.target.value = "";
  }
};

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      {/* --- Header --- */}
      <header className="profile-header">
        <img
          className="avatar"
          src={user.photoURL || "/shelf-images/user.png"}
          alt="avatar"
        />
        <div>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p className="muted">{user.email}</p>
          <div className="actions">
            {!editing && (
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            )}
            <label className="btn-primary">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarPick}
              />
              Update Avatar
            </label>
          </div>
          {saving && <p style={{ color: "crimson" }}>Saving...</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>
      </header>

      {/* --- Sections --- */}
      {!editing ? (
        <section className="card">
          <h3>Contact</h3>
          <div className="kv">
            <div>
              <dt>Phone</dt>
              <dd>{user.phone}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{user.address}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{user.city}</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>{user.state}</dd>
            </div>
            <div>
              <dt>Zip</dt>
              <dd>{user.zipcode}</dd>
            </div>
          </div>
        </section>
      ) : (
        <section className="card form-grid">
          <h3>Edit Profile</h3>
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
              <ZipDropdown setZipcode={setZipcode} />
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
        </section>
      )}
    </div>
  );
};

export default Profile;