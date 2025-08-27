// src/pages/UsersPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "host/useAuth";
import { UsersService } from "../services/UsersService";
import { User } from "../domain/User";
import { UserForm } from "../components/UserForm";
import { UserList } from "../components/UserList";

export function UsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const service = new UsersService();

    const fetchUsers = async () => {
        const data = await service.list();
        setUsers(data);
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const handleCreate = async (user: User) => {
        await service.create(user);
        fetchUsers();
    };

    const handleUpdate = async (id: number) => {
        const nome = prompt("Novo nome:") || "";
        const email = prompt("Novo email:") || "";
        await service.update(id, nome, email);
        fetchUsers();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Deseja realmente excluir?")) return;
        await service.delete(id);
        fetchUsers();
    };

    return (
        <div>
            <h1>Usuários</h1>
            <h3>Bem vindo { user.nome }!</h3>
            <UserForm onCreate={handleCreate} />
            <UserList users={users} onUpdate={handleUpdate} onDelete={handleDelete} />
        </div>
    );
}
