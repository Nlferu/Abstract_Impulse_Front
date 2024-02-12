import { useState } from "react";
import styles from "@/styles/Menu.module.css";
import Link from "next/link";

export default function MenuButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuList = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuButton}>
      <div
        className={`${styles.hamburgerMenu} ${
          isOpen && isModalOpen ? styles.open : ""
        }`}
        onClick={() => {
          toggleMenu(), handleMenuList();
        }}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div>
            <Link href="/" onClick={handleClose} className={styles.homeButton}>
              <span>HOME</span>
            </Link>
            <Link
              href="/withdraw"
              onClick={handleClose}
              className={styles.homeButton}
            >
              <span>Withdraw</span>
            </Link>
            <Link
              href="/about"
              onClick={handleClose}
              className={styles.homeButton}
            >
              <span>About</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
