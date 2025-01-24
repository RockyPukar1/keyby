import { useEffect, useState } from "react";

import { IProfile } from "@/interface/Profiles";

// import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";
import toast from "react-hot-toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import ProfileForm from "@/components/ProfileForm";

export default function Home() {
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // chrome.storage.local.get("profiles", (result) => {
    //   setProfiles(result.profiles || []);
    // });
    if (user) {
      fetch(`http://localhost:3000/profiles/${user.id}`)
        .then((res) => res.json())
        .then((data) => setProfiles(data.profiles))
        .catch((error) => {
          console.error("Failed to fetch profiles:", error);
        });
    }
  }, [user]);

  const saveProfile = async (updatedProfile: IProfile) => {
    /* setProfiles((prevProfiles) => {
      const newProfiles = [
        ...prevProfiles,
        { ...updatedProfile, id: crypto.randomUUID() },
      ];
      chrome.storage.local.set({ profiles: newProfiles });
      return newProfiles;
    }); */
    if (!user) {
      return toast.error("Please login first");
    }
    const response = await fetch("http://localhost:3000/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, profile: updatedProfile }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Profile saved successfully");
      toast.success("New Profile added successfully");
    } else {
      toast.error("Failed to save profile");
    }
  };

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    const response = await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: credential }),
    });

    const data = await response.json();
    if (data.success) {
      setUser(data);
      console.log("User authenticated:", data.user);
    } else {
      console.error("Authentication failed");
    }
  };

  const deleteProfile = async (profileId: string) => {
    // setProfiles((prevProfiles) => {
    //   const filteredProfiles = prevProfiles.filter(
    //     ({ id }) => id !== profileId
    //   );
    //   chrome.storage.local.set({ profiles: filteredProfiles });
    //   return filteredProfiles;
    // {});, {
    const response = await fetch(
      `http://localhost:3000/profiles/${user?.id}/${profileId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    if (data.success) {
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== profileId)
      );
      toast.success("Profile deleted successfully");
    } else {
      toast.error("Failed to delete profile");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Auto Fill</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => toast.error("Login Failed")}
      />
      <ProfileForm onSave={saveProfile} isEditing={true} />
      <ProfileList profiles={profiles} onDelete={deleteProfile} />
    </div>
  );
}
