import { useState } from "react";
import { auth, googleProvider, firestoreDB } from "../../firebase-config";
import { linkWithPopup } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import "./link-google-button.styles.css";

const LinkGoogleButton = () => {
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLinkGoogle = async () => {
    setStatusMsg("");
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setStatusMsg("Please log in with your email and password first.");
        setLoading(false);
        return;
      }

      // Open Google popup and link to the CURRENT user
      const result = await linkWithPopup(user, googleProvider);
      const linkedUser = result.user;

      // Find the Google provider data
      const googleProviderData = linkedUser.providerData.find(
        (p) => p.providerId === "google.com"
      );

      const googleId = googleProviderData?.uid || null;

      // Update Firestore user doc with googleId
      if (googleId) {
        const userRef = doc(firestoreDB, "users", linkedUser.uid);
        await updateDoc(userRef, {
          googleId,
        });
      }

      setStatusMsg("✅ Google account linked successfully!");
    } catch (error) {
      console.error("Error linking Google:", error);

      if (error?.code === "auth/provider-already-linked") {
        setStatusMsg("Your Google account is already linked.");
      } else if (error?.code === "auth/credential-already-in-use") {
        setStatusMsg(
          "That Google account is already used by another user. Try a different Google account."
        );
      } else if (error?.code === "auth/popup-closed-by-user") {
        setStatusMsg("Google sign-in popup was closed before finishing.");
      } else {
        setStatusMsg("Failed to link Google account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-google-container">
      <button
        type="button"
        className="link-google-button"
        onClick={handleLinkGoogle}
        disabled={loading}
      >
        {loading ? "Linking..." : "Link Google Account"}
      </button>
      {statusMsg && (
        <p className="link-google-status">
          {statusMsg}
        </p>
      )}
    </div>
  );
};

export default LinkGoogleButton;
