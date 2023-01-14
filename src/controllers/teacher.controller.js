import { parse } from "path";
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

export const addCategories = async (req, res) => {
    const { names } = req.body;

    if (!names) return res.status(400).json({ message: "Names are required" });
    const categories = await Promise.all(names.map(async (name) => {
        const category = await prisma.category.findFirst({
            where: { name }
        })
        if (!category) return;
        return category;
    }));
    console.log(categories)
    if( categories.some((category) => category === undefined)) return res.status(404).json({ message: "Category not found" });
    if (!categories) return res.status(404).json({ message: "Categories not found" });

    const parsedCategories = categories.map((category) => {
        return category.name
    })

    let teacher = await prisma.teacher.findUnique({
        where: {
            userId: parseInt(req.id)
        },
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });


    let newCategories = teacher.categories.concat(parsedCategories);
    newCategories = [...new Set(newCategories)];
    console.log(newCategories);
    teacher = await prisma.teacher.update({
        where: {
            userId: parseInt(req.id)
        },
        data: {
            categories: newCategories
        }
    });
    return res.status(200).json({ message: "Categories added" });
}

export const deleteCategories = async (req, res) => {
    const { names } = req.body;
    let teacher = await prisma.teacher.findUnique({
        where: {
            userId: parseInt(req.id)
        },
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const newCategories = teacher.categories.filter((category) => !names.includes(category));
    teacher = await prisma.teacher.update({
        where: {
            userId: parseInt(req.id)
        },
        data: {
            categories: newCategories
        }
    });
    return res.status(200).json({ message: "Categories deleted" });
}



export const getAllTeachers = async (req, res) => {
    // TODO WYCIAGANIE LEKCJI
    const { accessibility, location, subject } = req.body;

    const teachers = await prisma.teacher.findMany();
    const allTeachers = await Promise.all(teachers.map(async (teacher) => {
        const teacherInfo  = await prisma.user.findUnique({
            where: {
                id: teacher.userId
            }
        })
        delete teacherInfo.password;
        delete teacherInfo.updatedAt;
        delete teacherInfo.userId;
        return Object.assign(teacher, teacherInfo);
    }));
    
    if (!allTeachers) return res.status(404).json({ message: "Teachers not found" });
    return res.status(200).json(allTeachers);
}