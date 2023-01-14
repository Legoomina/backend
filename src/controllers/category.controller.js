import prisma from "../prismaClient.js";


export const addCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const check = await prisma.category.findUnique({
        where: {
            name
        }
    })

    if (check) return res.status(400).json({ message: "Category already exists" });
    const category = await prisma.category.create({
        data: {
            name: name
        }
    });
    return res.status(200).json(category);
}

export const getAllCategories = async (req, res) => {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
}

export const deleteCategory = async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const category = await prisma.category.delete({
        where: {
            id: parseInt(id)
        }
    });
    return res.status(200).json(category);
}