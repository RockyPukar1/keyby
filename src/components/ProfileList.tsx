import { IProfile } from "@/interface/Profiles";
import { Link } from "react-router-dom";

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
          <Link
            to={`/profile/${id}`}
            key={id}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
            <button
              onClick={() => onDelete(id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </Link>
        ))}
      </ul>
    </div>
  );
}
