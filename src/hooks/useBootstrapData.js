import { useEffect, useState } from "react";
import { loadBootstrapData } from "../services/pos/bootstrapService";

function useBootstrapData() {
  const [data, setData] = useState({
    inventory: [],
    paymentMethods: [],
    associates: []
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [bootstrapError, setBootstrapError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const nextData = await loadBootstrapData();
        if (
          !nextData ||
          typeof nextData !== "object" ||
          !Array.isArray(nextData.inventory) ||
          !Array.isArray(nextData.paymentMethods)
        ) {
          throw new Error("Bootstrap response has unexpected shape.");
        }
        if (!cancelled) {
          setData(nextData);
          setBootstrapError("");
        }
      } catch (error) {
        if (!cancelled) {
          setBootstrapError(error.message || "Unable to load store data.");
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...data,
    isBootstrapping,
    bootstrapError
  };
}

export default useBootstrapData;
