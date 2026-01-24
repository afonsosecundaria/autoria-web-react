import styles from "../Perfil.module.css";

export default function Privacidade() {
  return (
    <div>
      <h3>Privacidade</h3>

      <div className={styles.card}>
        <h4>Alterar senha</h4>

        <input type="password" placeholder="Senha atual" />
        <input type="password" placeholder="Nova senha" />
        <input type="password" placeholder="Confirmar nova senha" />

        <button>Alterar senha</button>
      </div>

      <div className={styles.cardDanger}>
        <h4>Excluir conta</h4>
        <p>Essa ação é permanente e não poderá ser desfeita.</p>
        <button className={styles.dangerButton}>Excluir conta</button>
      </div>
    </div>
  );
}
