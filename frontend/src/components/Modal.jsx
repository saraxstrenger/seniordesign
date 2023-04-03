import "./css/Modal.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal(props) {
  const { isOpen, children } = props;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { duration: 0.3 } }}
            exit={{ scale: 0 }}
            className="modal-content-wrapper"
          >
            <motion.div className="modal-content">{children}</motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
