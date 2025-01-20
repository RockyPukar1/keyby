import { IProfile } from "@/interface/Profiles";
import { useForm } from "react-hook-form";

interface IProfileFormProps {
  profile?: IProfile;
  onSave: (data: IProfile) => void;
  isEditing?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileForm({
  profile,
  onSave,
  isEditing = false,
  setIsEditing,
}: IProfileFormProps) {
  console.log(profile);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProfile>({
    defaultValues: profile || {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: IProfile) => {
    console.log(data);
    onSave(data);
    reset();
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-semibold mb-4">
        {profile ? "Edit" : "Add New"} Profile
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name
        </label>
        <input
          {...register("name", {
            required: "Name is required",
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          disabled={!isEditing}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          {...register("email", {
            required: "Email is required",
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          disabled={!isEditing}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        {isEditing ? (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Profile
            </button>
            {setIsEditing && (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </>
        ) : (
          <>
            {setIsEditing && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
