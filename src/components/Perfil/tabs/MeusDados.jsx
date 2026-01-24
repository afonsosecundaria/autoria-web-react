import styles from "../Perfil.module.css";

export default function MeusDados() {
  return (
    <div>
      <h3>Meus Dados</h3>

      <div className={styles.card}>
        <label>Email</label>
        <input type="email" placeholder="email@exemplo.com" />

        <label>Telefone</label>
        <input type="text" placeholder="(00) 00000-0000" />

        <label>Data de nascimento</label>
        <input type="date" />

        <button>Atualizar dados</button>
      </div>
    </div>
  );
}
