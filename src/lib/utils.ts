import bcrypt from "bcryptjs";

export const hashPassword = ({ password }: { password: string }): string => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const comparePassword = ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};
