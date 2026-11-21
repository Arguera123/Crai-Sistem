import jwt, { JwtPayload } from 'jsonwebtoken'

if (!process.env.TOKEN_SECRET) {
  console.warn("[jwt] TOKEN_SECRET no esta definido: se usa un valor por defecto INSEGURO. Definalo en el archivo .env");
}

const JWT_SECRET = process.env.TOKEN_SECRET || 'Super Secret Value';
const TOKEN_EXP = (process.env.TOKEN_EXP || "1d").toString();

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(
      {
        email: payload.email,
        sub: payload.sub
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXP as jwt.SignOptions["expiresIn"] }
    )
    return token
}

export const verifyJWT = (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      return payload as JwtPayload
    } catch(err) {
      return undefined
    }
}

export const decodeJWT = (token : string) => {
    try {
      const payload : any = jwt.decode(token)
      return payload      
    } catch (err) {
      return false
    }
}
