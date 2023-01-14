import prisma from "../prismaClient.js";


export const getTeacher = async (req, res) => {
    const id = req.query.id;
    console.log(req.query);
    if (!id) return res.status(400).json({ message: "Id is required" });
    const teacher = await prisma.teacher.findUnique({
        where: {
        id: parseInt(id),
        },
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json(teacher);
}


export const changeBio = async (req, res) => {
    const id = req.id;
    const { bio } = req.body;
    if(!bio) return res.status(400).json({ message: "Bio is required" });
    const teacher = await prisma.teacher.update({
        where: {
            userId: parseInt(id)
        },
        data: {
            bio: bio
        }
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json({ message: "Bio changed" });
}

export const changeAccessibility = async (req, res) => {
    const id = req.id;
    const { accessibility } = req.body;
    if(!accessibility) return res.status(400).json({ message: "Accessibility is required" });
    const teacher = await prisma.teacher.update({
        where: {
            userId: parseInt(id)
        },
        data: {
            accessibilityOptions: accessibility
        }
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json({ message: "Accessibility changed" });
}