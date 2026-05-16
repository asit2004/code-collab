import styles from './OutputPanel.module.css';

export default function OutputPanel({ output, onClose }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Output</span>
          <span className={`${styles.status} ${output.isError ? styles.error : styles.success}`}>
            {output.status || (output.isError ? 'Error' : 'Success')}
          </span>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>X</button>
      </div>
      <pre className={`${styles.output} ${output.isError ? styles.errorText : ''}`}>
        {output.output || 'No output'}
      </pre>
    </div>
  );
}
