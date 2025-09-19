import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getUser } from "../../functions/getUser";
import { updateUser } from "../../functions/updateUser";
import { uploadAvatar } from "../../functions/uploadAvatar"; // new helper
import ZipDropdown from "../zip-dropdown/zip-dropdown";
import "./profile.css";
import defaultProfileImg from "./profile.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [changes, setChanges] = useState({});
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
  }, [firebaseUser]);

  useEffect(() => {
    setChanges((prev) => {
      if (zipcode === (user?.zipcode || "")) {
        const { zipcode: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, zipcode };
    });
  }, [zipcode, user]);

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

    //Tracks only modified user form fields
    setChanges((prev) => {
      if (value === (user?.[name] || "")) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: value };
    });
  };

  const onSave = async () => {
    const hasChanges =
      firstName !== (user.firstName || "") ||
      lastName !== (user.lastName || "") ||
      phone !== (user.phone || "") ||
      address !== (user.address || "") ||
      city !== (user.city || "") ||
      zipcode !== (user.zipcode || "");

    if (!hasChanges) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updatedUser = await updateUser(firebaseUser.uid, {
        ...changes,
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
    setSaving(true);
    setError("");

    try {
      const url  = await uploadAvatar(file, {
      onProgress: (p) => console.log("upload", p, "%"),
      });
      console.log("Uploaded avatar URL:", url);
      // Save the URL to your backend/Firestore (so profile has photoURL)
      const updated = await updateUser(firebaseUser.uid, {
      photoURL: url,
      });
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
          src={user.photoURL || defaultProfileImg}
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
        <section className="profile-card">
          <h3>Contact</h3>
          <div className="profile-box">
            <div className="profile-row">
              <span className="profile-label">Phone</span>
              <span className="profile-value">{user.phone || "—"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Address</span>
              <span className="profile-value">{user.address || "—"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">City</span>
              <span className="profile-value">{user.city || "—"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">State</span>
              <span className="profile-value">{user.state || "—"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Zip</span>
              <span className="profile-value">{user.zipcode || "—"}</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="profile-card profile-form">
          <h3>Edit Profile</h3>
          <div className="grid">
            <label>
              First Name
              <input name="firstName" value={firstName} onChange={onChange} />
            </label>
            <label>
              Last Name
              <input name="lastName" value={lastName} onChange={onChange} />
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
              <ZipDropdown zipcode={zipcode} setZipcode={setZipcode} />
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
