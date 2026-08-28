import { useContext } from "react";
import { TestContext } from "./context";

export function useTest() {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used inside TestProvider");
  return context;
}
