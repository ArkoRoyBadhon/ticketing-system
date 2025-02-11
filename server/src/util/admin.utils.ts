import prisma from './prisma'
import quicker from './quicker'

export const adminSeed = async () => {
    const isExist = await prisma.admin.findFirst({
        where: {
            role: 'SUPER_ADMIN'
        }
    })
    const hashedPassword = await quicker.hashPassword('123456')
    if (!isExist) {
        await prisma.admin.create({
            data: {
                email: 'admin@topmoments.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                firstName: 'Admin',
                lastName: 'TopMoments'
            }
        })
    }
}
