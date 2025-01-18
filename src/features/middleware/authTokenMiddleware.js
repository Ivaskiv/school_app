import { auth } from '../../firebase/firebaseConfig';

const authToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send('Permission denied');
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
      details: error.message || 'An error occurred during token verification',
    });
  }
};

export default { authToken };
