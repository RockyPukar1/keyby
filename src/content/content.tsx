import { useCallback, useEffect, useState } from "react";

import { IProfile } from "@/interface/Profiles";

import FillFormButton from "@/components/FillFormButton";
import { fillForm } from "@/utils/helper";

export default function Content() {
  const [profiles, setProfiles] = useState<IProfile[] | []>([]);
  const [selectedProfile, setSelectedProfile] = useState<IProfile | null>(null);
  const [isAutofillActive, setIsAutofillActive] = useState(true);

  const handleProfileSelect = (profileId: string) => {
    const profile = profiles.find(({ id }) => id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  const saveProfile = useCallback((updatedProfile: IProfile) => {
    setProfiles((prevProfiles) => {
      const newProfiles = [
        ...prevProfiles,
        { ...updatedProfile, id: crypto.randomUUID() },
      ];
      chrome.storage.local.set({ profiles: newProfiles });
      return newProfiles;
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("profiles", (result) => {
      const profiles = result.profiles || [];
      if (profiles.length > 0) {
        setProfiles(profiles);
      }
    });
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        if (isAutofillActive && selectedProfile) {
          fillForm(selectedProfile);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isAutofillActive, selectedProfile]);

  useEffect(() => {
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && selectedProfile && (target.name || target.id)) {
        const newProfile = {
          ...selectedProfile,
          [target.name || target.id]: target.value,
        };
        saveProfile(newProfile);
      }
    };

    const formElements = document.querySelectorAll("input, textarea");
    formElements.forEach((el) =>
      el.addEventListener("input", handleInputChange)
    );

    return () => {
      formElements.forEach((el) =>
        el.removeEventListener("input", handleInputChange)
      );
    };
  }, [selectedProfile, saveProfile]);

  if (!profiles.length) {
    return null;
  }

  return (
    <div className="w-auto min-w-64 fixed bottom-10 right-1- z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Auto Fill Profile
      </h2>
      <div>
        <select
          onChange={(e) => handleProfileSelect(e.target.value)}
          className="p-2 border rounded-md mb-4"
        >
          <option value="">Select Profile</option>
          {profiles.map(({ id, name, email }) => (
            <option key={id} value={id}>
              {name} - {email}
            </option>
          ))}
        </select>
      </div>
      {selectedProfile && (
        <FillFormButton
          onClick={() => setIsAutofillActive((prev) => !prev)}
          isAutofillActive={isAutofillActive}
        />
      )}
    </div>
  );
}
