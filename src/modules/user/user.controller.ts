import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  //   const { name, email, password, age } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);
    // console.log(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

const getllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const result = await userService.getUserByIDFromDB(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  // console.log({ name, password, age, is_active })

  try {
    const result = await userService.updateUserByIDFromDB(id as string, req.body);
    // console.log(result);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserByIDFromDB(id as string);
    // console.log(result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getllUsers,
  getUserByID,
  updateUserByID,
  deleteUserByID,
};
