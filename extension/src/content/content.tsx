import { useCallback, useEffect, useRef, useState } from "react";

import { fillForm } from "@/utils/helper";

import { IProfile } from "@/interface/Profiles";

import FillFormButton from "@/components/FillFormButton";
import toast from "react-hot-toast";

export default function Content() {
  const selectedProfileRef = useRef<IProfile | null>(null);

  const [profiles, setProfiles] = useState<IProfile[] | []>([]);
  const [selectedProfile, setSelectedProfile] = useState<IProfile | null>(null);
  const [isAutofillActive, setIsAutofillActive] = useState(true);

  const handleProfileSelect = (profileId: string) => {
    const profile = profiles.find(({ id }) => id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  const updateProfileField = useCallback((fieldName: string, value: string) => {
    const profile = selectedProfileRef.current;
    if (profile) {
      const updatedProfile = { ...profile, [fieldName]: value };
      setProfiles((prevProfiles) => {
        const newProfile = prevProfiles.map((p) =>
          p.id === profile.id ? updatedProfile : p
        );
        chrome.storage.local.set({
          profiles: newProfile,
        });
        return newProfile;
      });
      toast.success(`${fieldName} updated successfully`);
      setSelectedProfile(updatedProfile);
    }
  }, []);

  useEffect(() => {
    selectedProfileRef.current = selectedProfile;
  }, [selectedProfile]);

  useEffect(() => {
    chrome.storage.local.get("profiles", (result) => {
      const profiles = result.profiles || [];
      if (profiles.length > 0) {
        setProfiles(profiles);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      const formElements = document.querySelectorAll("input, textarea");

      formElements.forEach((input) => {
        const targetInput = input as HTMLInputElement | HTMLTextAreaElement;
        const fieldName = targetInput.name || targetInput.id;
        if (
          fieldName &&
          !input.nextElementSibling?.classList.contains("update-icon")
        ) {
          const icon = document.createElement("span");
          icon.textContent = "✎";
          icon.className =
            "update-icon right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg pointer-cursor";
          icon.onclick = () => {
            updateProfileField(fieldName, targetInput.value);
          };
          targetInput.style.paddingRight = "30px";

          const parentNode = targetInput.parentNode as HTMLElement;
          parentNode.appendChild(icon);
        }
      });
    }
  }, [selectedProfile, updateProfileField]);

  useEffect(() => {
    if (isAutofillActive && selectedProfile) {
      fillForm(selectedProfile);
    }
  }, [isAutofillActive, selectedProfile]);

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
