import { IProfile } from "@/interface/Profiles";

export const fillForm = (profile: IProfile) => {
  Object.entries(profile).forEach(([key, value]) => {
    const inputElements = document.querySelector(
      `input[name="${key}"], input[id="${key}"], textarea[name="${key}"], textarea[id="${key}"]`
    ) as HTMLInputElement | HTMLTextAreaElement;
    if (inputElements) {
      inputElements.value = value;
    }
  });
};
