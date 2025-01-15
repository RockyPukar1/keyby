import { useEffect, useState } from "react";

import { IProfile } from "@/interface/Profiles";

import ProfileForm from "@/components/ProfileForm";
import ProfileList from "@/components/ProfileList";

function App() {
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
  };

  const deleteProfile = (profileId: string) => {
    setProfiles((prevProfiles) => {
      const filteredProfiles = prevProfiles.filter(
        ({ id }) => id !== profileId
      );
      chrome.storage.local.set({ profiles: filteredProfiles });
      return filteredProfiles;
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-gray-800">
      <h1 className="text-xl font-bold mb-4">Auto Fill</h1>
      <ProfileForm onSave={saveProfile} />
      <ProfileList profiles={profiles} onDelete={deleteProfile} />
    </div>
  );
}

export default App;
