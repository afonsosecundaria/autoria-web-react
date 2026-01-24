import styles from "../Perfil.module.css";

export default function MeuPerfil() {
  return (
    <div>
      <h3>Meu Perfil</h3>

      <div className={styles.card}>
        <label>Nome</label>
        <input type="text" placeholder="Seu nome" />

        <label>Bio</label>
        <textarea placeholder="Fale um pouco sobre você"></textarea>

        <button>Salvar alterações</button>
      </div>
    </div>
  );
}
