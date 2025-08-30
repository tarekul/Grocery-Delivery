import { useEffect, useState } from "react";
import { getUser } from "../../functions/getUser";
//import { updateUser } from "../../functions/updateUser"; // (add this file below)     // you already have this
import React from "react";
import { useAuth } from "../../contexts/authContext";
import { updateUser } from "../../functions/updateUser";
import "./profile.css"; // optional

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { firebaseUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      const user = await getUser(firebaseUser.uid);
      setUser(user);
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: "NY",
        zipcode: user.zipcode || "",
      });
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateUser(form);
      setUser(updated);
      setEditing(false);
    } catch (e) {
      setError(e?.response?.data || "Failed to save profile.");
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
                value={form.firstName}
                onChange={onChange}
              />
            </label>
            <label>
              Last Name
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
              />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={onChange} />
            </label>
            <label>
              Address
              <input name="address" value={form.address} onChange={onChange} />
            </label>
            <label>
              City
              <input name="city" value={form.city} onChange={onChange} />
            </label>
            <label>
              State
              <p>{form.state}</p>
            </label>
            <label>
              Zip Code
              <input name="zipcode" value={form.zipcode} onChange={onChange} />
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
