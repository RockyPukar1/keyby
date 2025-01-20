import ProfileForm from "@/components/ProfileForm";
import { IProfile } from "@/interface/Profiles";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ProfileDetails() {
  const { id } = useParams();

  const [profile, setProfile] = useState<IProfile | null>(null);
  // eslint-disable-next-line
  const [_, setProfiles] = useState<IProfile[] | []>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("profiles", (result) => {
      setProfile(
        result.profiles.find((profile: IProfile) => profile.id === id) || null
      );
      setProfiles(result.profiles || []);
    });
  }, [id]);

  const saveProfile = (updatedProfile: IProfile) => {
    setProfiles((prevProfiles) => {
      const newProfiles = [...prevProfiles, updatedProfile];
      chrome.storage.local.set({ profiles: newProfiles });
      return newProfiles;
    });
    setIsEditing(false);
    toast.success("New Profile added successfully");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>
      {profile ? (
        <ProfileForm
          onSave={saveProfile}
          profile={profile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <p>Profile not Found</p>
      )}
    </div>
  );
}
