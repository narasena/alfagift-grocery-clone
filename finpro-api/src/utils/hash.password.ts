import bycript from 'bcrypt';

export const hashPassword = async (password : string) => {
    const saltRounds = 10;
    return await bycript.hash(password, saltRounds);
}