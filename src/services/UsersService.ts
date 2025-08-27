import { User } from "../domain/User";

export class UsersService {
    private baseUrl = "http://localhost:3000/users";

    async list(): Promise<User[]> {
        const res = await fetch(this.baseUrl, { credentials: "include" });
        return res.json();
    }

    async create(user: User): Promise<User> {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        return res.json();
    }

    async update(id: number, nome: string, email: string): Promise<User> {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email }),
        });
        return res.json();
    }

    async delete(id: number): Promise<void> {
        await fetch(`${this.baseUrl}/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    }
}
