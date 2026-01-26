import styles from "../Perfil.module.css";

export default function MeuPerfil({ usuario }) {
  return (
    <div>
      <h3>Meu Perfil</h3>

      <div className={styles.card}>
        <label>Nome</label>
        <input 
          type="text" 
          value={usuario.nome + " " + usuario.sobrenome}
          readOnly
        />

        <label>Tipo de usuário</label>
        <input 
          type="text" 
          value={usuario.tipo_usuario}
          readOnly
        />
      </div>
    </div>
  );
}
