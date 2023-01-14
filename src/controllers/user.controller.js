import prisma from '../prismaClient.js'


export const getUser = async (req, res) => {
    const id = req.id;
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);

}


export const deleteAccount = async (req, res) => {
    const id = req.id;
    const user = await prisma.user.delete({
        where: {
            id: parseInt(id)
        }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted" });
}

export const changeLocation = async (req, res) => {
    const id = req.id;
    const { location } = req.body;
    if(!location) return res.status(400).json({ message: "Location is required" });
    const user = await prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            location: location
        }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Location changed" });
}

export const changeName = async (req, res) => {
    const id = req.id;
    const { firstName, lastName } = req.body;
    if(!firstName || !lastName) return res.status(400).json({ message: "first and last name is required" });
    const user = await prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            firstName, lastName
        }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Name changed" });
}
