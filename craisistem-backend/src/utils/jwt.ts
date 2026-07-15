import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.TOKEN_SECRET || 'Super Secret Value';
const TOKEN_EXP = (process.env.TOKEN_EXP || "1d").toString();

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(
      {
        email: payload.email,
        sub: payload.sub
      }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    )
    return token
}

export const verifyJWT = (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      return payload
    } catch(err) {
      console.log(err)
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
