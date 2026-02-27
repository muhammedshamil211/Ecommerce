import styles from "./CloseButton.module.css";

export default function CloseButton({
  onClick,
  variant = "glass", // glass | soft | dark
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className={`${styles.closeBtn}  ${styles[variant]} ${className}`}
    >
      <span className={styles.icon}></span>
      <span className={styles.icon2}></span>
    </button>
  );
}