import styles from "../Perfil.module.css";

export default function MeusDados({ usuario }) {
  return (
    <div>
      <h3>Meus Dados</h3>

      <div className={styles.card}>
        <label>Email</label>
        <input 
          type="email" 
          value={usuario.email} 
          readOnly
        />

        <label>Telefone</label>
        <input 
          type="text" 
          value={usuario.telefone} 
          readOnly
        />
      </div>
    </div>
  );
}
