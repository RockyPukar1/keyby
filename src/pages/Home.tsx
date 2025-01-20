import { useEffect, useState } from "react";

import { IProfile } from "@/interface/Profiles";

import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";
import toast from "react-hot-toast";

export default function Home() {
  const [profiles, setProfiles] = useState<IProfile[]>([]);

  useEffect(() => {
    chrome.storage.local.get("profiles", (result) => {
      setProfiles(result.profiles || []);
    });
  }, []);

  const saveProfile = (updatedProfile: IProfile) => {
    setProfiles((prevProfiles) => {
      const newProfiles = [
        ...prevProfiles,
        { ...updatedProfile, id: crypto.randomUUID() },
      ];
      chrome.storage.local.set({ profiles: newProfiles });
      return newProfiles;
    });
    toast.success("New Profile added successfully");
  };

  const deleteProfile = (profileId: string) => {
    setProfiles((prevProfiles) => {
      const filteredProfiles = prevProfiles.filter(
        ({ id }) => id !== profileId
      );
      chrome.storage.local.set({ profiles: filteredProfiles });
      return filteredProfiles;
    });
    toast.success("Profile deleted successfully");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Auto Fill</h1>
      <ProfileForm onSave={saveProfile} isEditing={true} />
      <ProfileList profiles={profiles} onDelete={deleteProfile} />
    </div>
  );
}
