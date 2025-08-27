import { User } from "../domain/User";

interface Props {
    user: User;
    onUpdate: (id: number) => void;
    onDelete: (id: number) => void;
}

export const UserItem: React.FC<Props> = ({ user, onUpdate, onDelete }) => (
    <li>
        {user.nome} - {user.email}
        <button onClick={() => onUpdate(user.id)}>Editar</button>
        <button onClick={() => onDelete(user.id)}>Excluir</button>
    </li>
);
