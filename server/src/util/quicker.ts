import bcrypt from 'bcrypt'
import config from '../config/config'
import jwt from 'jsonwebtoken'

export default {
    hashPassword: async (password: string) => {
        const salt = await bcrypt.hash(password, 10)
        return salt
    },
    // generateAccessToken: (payload: object) => {
    //     const { EXPIRY, SECRET = '' } = config.ACCESS_TOKEN
    //     const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
    //     return token
    // },
    // generateRefreshToken: (id: string) => {
    //     try {
    //         const { EXPIRY, SECRET = '' } = config.REFRESH_TOKEN
    //         const token = jwt.sign({ id: id }, SECRET, { expiresIn: EXPIRY })
    //         return token
    //     } catch (err) {
    //         if (err instanceof Error) {
    //             throw err
    //         }
    //         throw new Error('An unknown error occurred.')
    //     }
    // },

    verifyAccessToken: (token: string) => {
        try {
            const { SECRET = '' } = config.ACCESS_TOKEN
            const payload = jwt.verify(token, SECRET)
            return payload
        } catch (err) {
            if (err instanceof Error) {
                throw err
            }
            throw new Error('An unknown error occurred.')
        }
    },
    verifyRefreshToken: (token: string) => {
        try {
            const { SECRET = '' } = config.REFRESH_TOKEN
            const payload = jwt.verify(token, SECRET)
            return payload
        } catch (err) {
            if (err instanceof Error) {
                throw err
            }
            throw new Error('An unknown error occurred.')
        }
    },

}
