import { NOMEM } from "dns"
import jwt from "jsonwebtoken"

const JWT_SIGN_SECRET = '$2b$05$8Hxtmp7uVSy.yENUDeK6Zu.2HoYDgkRnITLvxLOTKqKPh5FNVCk3Gh"ddààà&è852éà))))))&ééééééhhdhDDus_sknppppERRFF'

export function genererJwonWebToken (data) {
    return jwt.sign({
        userId: data.id,
        role: data.role,
        userName: data.userName,
        nom: data.nom,
        prenoms: data.prenoms,
        email: data.email
    }, JWT_SIGN_SECRET)
}

export function verifyToken(token){
   return jwt.verify(token, JWT_SIGN_SECRET)
}