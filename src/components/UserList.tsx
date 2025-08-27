import { User } from "../domain/User";
import { UserItem } from "./UserItem";

interface Props {
    users: User[];
    onUpdate: (id: number) => void;
    onDelete: (id: number) => void;
}

export const UserList: React.FC<Props> = ({ users, onUpdate, onDelete }) => (
    <ul>
        {users.map(u => (
            <UserItem key={u.id} user={u} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
    </ul>
);
