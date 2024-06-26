import { useState } from "react"
import Link from "next/link"

import styles from "./navbar.module.css"

const menuItems = []

export const MobileNav = () => {
  const [menusOpen, setMenusOpen] = useState<boolean[]>([false, false])

  const toggleMenu = (index: number) => {
    if (!menusOpen[index]) {
      const updatedMenusOpen: boolean[] = []
      updatedMenusOpen[index] = !updatedMenusOpen[index]
      setMenusOpen(updatedMenusOpen)
    } else {
      const updatedMenusOpen: boolean[] = []
      setMenusOpen(updatedMenusOpen)
    }
  }

  return (
    <div className={styles.navbar}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.navbarOptionsContainer}>
          <div
            className={`${styles.navLeft} ${styles.navbarLi} ${styles.active}`}
            onClick={() => toggleMenu(index)}
          >
            <p className={`${styles.connectText} ${styles.toHide}`}>
              {item.label}
            </p>
          </div>
          <div
            className={`${styles.dropdown} ${
              menusOpen[index]
                ? styles.connectMenuOpen
                : styles.connectMenuClosed
            }`}
          >
            {item.links.map((link, linkIndex) => (
              <Link key={linkIndex} href={link.href}>
                <p className={styles.dropdownOption}>{link.text}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
