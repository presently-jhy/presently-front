// src/App.jsx
import AppRouter from "./router";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.textSection}>
        {/* 설명 글씨 영역 */}
        <h1>Presently</h1>
        <p>선물, 기념일, 더 완벽하게</p>
      </div>
      <div className={styles.phoneSection}>
        <AppRouter className={styles.componentView} />
      </div>
    </div>
  );
}

export default App;
