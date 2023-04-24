import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const Preview = () => {
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
    router.push("/home");
  }, []);

  return null;
};

export default Preview;