import { signUpBusinessSchema } from "@/modules/auth/schemas/signUpBusinessSchema";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface StrongPasswordInformationProps {
  password: string;
}

function StrongPasswordInformation({
  password,
}: StrongPasswordInformationProps) {
  const [isEightCharacters, setIsEightCharacters] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password: string) => {
    const result = signUpBusinessSchema.safeParse(password);
    setIsEightCharacters(result.success || password.length >= 8);
    setHasNumber(result.success || /\d/.test(password));
    setHasUppercase(result.success || /[A-Z]/.test(password));
    setHasLowercase(result.success || /[a-z]/.test(password));
    setHasSpecialCharacter(
      result.success || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    );
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      <div
        className={`flex gap-1 items-center ${
          isEightCharacters ? "text-green-500" : "text-gray-500"
        }`}
      >
        <CircleCheck size={18} />
        <p>Musi mieć minimum 8 znaków</p>
      </div>
      <div
        className={`flex gap-1 items-center ${
          hasNumber ? "text-green-500" : "text-gray-500"
        }`}
      >
        <CircleCheck size={18} />
        <p>Musi zawierać przynajmniej jedną cyfrę</p>
      </div>
      <div
        className={`flex gap-1 items-center ${
          hasUppercase ? "text-green-500" : "text-gray-500"
        }`}
      >
        <CircleCheck size={18} />
        <p>Musi zawierać przynajmniej jedną dużą literę</p>
      </div>
      <div
        className={`flex gap-1 items-center ${
          hasLowercase ? "text-green-500" : "text-gray-500"
        }`}
      >
        <CircleCheck size={18} />
        <p>Musi zawierać przynajmniej jedną małą literę</p>
      </div>
      <div
        className={`flex gap-1 items-center ${
          hasSpecialCharacter ? "text-green-500" : "text-gray-500"
        }`}
      >
        <CircleCheck size={18} />
        <p>Musi zawierać przynajmniej jeden znak specjalny</p>
      </div>
    </div>
  );
}

export default StrongPasswordInformation;
