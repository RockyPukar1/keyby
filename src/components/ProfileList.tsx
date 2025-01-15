import { IProfile } from "@/interface/Profiles";

interface IProfileListProps {
  profiles: IProfile[];
  onDelete: (id: string) => void;
}

export default function ProfileList({ profiles, onDelete }: IProfileListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Saved Profile</h2>
      <ul className="space-y-2">
        {profiles.map(({ id, name, email }) => (
          <li
            key={id}
            className="bg-white shadow rounded p-4 flex justify-between items-center "
          >
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
            <button
              onClick={() => onDelete(id)}
              className="b-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
