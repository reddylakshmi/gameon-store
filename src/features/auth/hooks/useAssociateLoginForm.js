import { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { useInventory } from "@/store/InventoryContext";

function useAssociateLoginForm() {
  const { login } = useAuth();
  const { associates } = useInventory();

  const [associateId, setAssociateId] = useState("GO1001");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!associateId.trim()) nextErrors.associateId = "Associate ID is required.";
    if (!password) nextErrors.password = "Password is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      setIsSubmitting(true);
      await login({ associateId: associateId.trim().toUpperCase(), password }, associates);
    } catch (error) {
      setErrors({ form: error.message || "Unable to sign in." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { associateId, password, errors, isSubmitting, setAssociateId, setPassword, handleSubmit };
}

export default useAssociateLoginForm;
