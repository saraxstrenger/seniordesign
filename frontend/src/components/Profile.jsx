import { useState } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
export default function Profile(props) {
  return (
    <div>
      <NavBar />
      <div className={styles.page}>Profile page</div>
    </div>
  );
}
