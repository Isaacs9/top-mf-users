import { useState } from "react";
import {User} from "../domain/User";

interface Props {
    onCreate: (nome: string, email: string, password: string) => void;
}

export const UserForm: React.FC<Props> = ({ onCreate }) => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({nome, email, password} as User);
        setNome(""); setEmail(""); setPassword("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
            <button type="submit">Criar Usuário</button>
        </form>
    );
};
