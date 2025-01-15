import { IProfile } from "@/interface/Profiles";

export const fillForm = (profile: IProfile) => {
  const formFields: { [key: string]: string } = {
    name: profile.name,
    email: profile.email,
  };

  Object.keys(formFields).forEach((key) => {
    const inputElements = document.querySelector(
      `input[name="${key}"], input[id="${key}"], textarea[name="${key}"], textarea[id="${key}"]`
    ) as HTMLInputElement | HTMLTextAreaElement;

    if (inputElements) {
      inputElements.value = formFields[key];
    }
  });
};
