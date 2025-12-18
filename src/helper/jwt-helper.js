import jwt from 'jsonwebtoken';

const JWT_EXPIRATION = '1h';

export const generateJWT = (c, userId, email) => {
  const payload = {
    userId,
    email,
  };
  const secret = c.env.JWT_SECRET || 'qwqonddqwiqwh1821j31igbwiduxhn8112ex1h299qhwehq98u';

  const token = jwt.sign(payload, secret, { expiresIn: JWT_EXPIRATION });
  return token;
};

export const verifyJWT = (c, token) => {
  try {
    const secret = c.env.JWT_SECRET || 'qwqonddqwiqwh1821j31igbwiduxhn8112ex1h299qhwehq98u';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
